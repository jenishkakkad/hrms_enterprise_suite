import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

const useAuthStore = create(
  persist(
    (set, get) => ({
      // -----------------------------
      // 🔹 STATE
      // -----------------------------
      user: null,
      company: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // -----------------------------
      // 🔹 LOGIN
      // -----------------------------
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          console.log('🔐 Login attempt:', credentials);
          const response = await axios.post('/auth/login', credentials);
          console.log('✅ Login success:', response.data);
          
          const { user, company, token, refreshToken } = response.data.data;

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            company,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true, data: response.data };
        } catch (error) {
          console.error('❌ Login failed:', error.response?.data || error.message);
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false
          });
          return { success: false, error: errorMessage };
        }
      },

      // -----------------------------
      // 🔹 REGISTER
      // -----------------------------
      register: async (registrationData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post('/auth/register', registrationData);
          const { user, company, token, refreshToken } = response.data.data;

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            company,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false
          });
          return { success: false, error: errorMessage };
        }
      },

      // -----------------------------
      // 🔹 LOGOUT
      // -----------------------------
      logout: () => {
        delete axios.defaults.headers.common['Authorization'];

        set({
          user: null,
          company: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null
        });
      },

      // -----------------------------
      // 🔹 REFRESH TOKEN (Auto)
      // -----------------------------
      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          get().logout();
          return false;
        }

        try {
          const response = await axios.post('/auth/refresh-token', { refreshToken });
          const { token } = response.data.data;

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ token });

          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      // -----------------------------
      // ⭐ NEW: VERIFY TOKEN (Real-Life HRMS)
      // -----------------------------
      verifyToken: async () => {
        const { token, logout } = get();

        if (!token) return false;

        try {
          const response = await axios.get('/auth/verify');
          return response.data.valid === true;
        } catch (error) {
          logout(); // token invalid → logout
          return false;
        }
      },

      // -----------------------------
      // PROFILE UPDATE
      // -----------------------------
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.put('/auth/profile', profileData);
          const updatedUser = response.data.data;

          set({
            user: { ...get().user, ...updatedUser },
            isLoading: false,
            error: null
          });

          return { success: true, data: response.data };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      // -----------------------------
      // PERMISSION MANAGEMENT
      // -----------------------------
      permissions: [],
      
      fetchPermissions: async () => {
        try {
          const response = await axios.get('/auth/permissions');
          set({ permissions: response.data.data });
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      },

      hasPermission: (module, action) => {
        const { permissions, user } = get();
        
        if (user?.role === 'SUPER_ADMIN') return true;
        
        return permissions.some(p => 
          p.module === module && p.action === action
        );
      },

      // -----------------------------
      // UTILITY ACCESS CONTROL
      // -----------------------------
      hasRole: (role) => get().user?.role === role,

      hasAnyRole: (roles) => roles.includes(get().user?.role),

      hasFeature: (feature) => get().company?.features?.[feature] === true,

      isWithinLimit: (limitType, currentCount) => {
        const limit = get().company?.limits?.[limitType];
        if (limit === -1) return true;
        return currentCount < limit;
      },

      clearError: () => set({ error: null })
    }),

    // -----------------------------
    // PERSIST STORAGE (localStorage)
    // -----------------------------
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      })
    }
  )
);

// ----------------------------------
// AXIOS INTERCEPTOR (Auto Refresh)
// ----------------------------------
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshed = await useAuthStore.getState().refreshAccessToken();
      if (refreshed) return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

// ----------------------------------
// SET INITIAL TOKEN ON APP LOAD
// ----------------------------------
const initialState = useAuthStore.getState();
if (initialState.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialState.token}`;
}

export { useAuthStore };
