# 📁 HRMS SaaS Project Structure

```
HRMS/
├── 📁 backend/                          # Node.js API Server
│   ├── 📁 src/
│   │   ├── 📁 config/                   # Configuration files
│   │   │   ├── database.js              # MongoDB connection
│   │   │   ├── email.js                 # Email configuration
│   │   │   └── storage.js               # File storage config
│   │   │
│   │   ├── 📁 controllers/              # Route controllers
│   │   │   ├── authController.js        # Authentication logic
│   │   │   ├── employeeController.js    # Employee management
│   │   │   ├── attendanceController.js  # Attendance tracking
│   │   │   ├── leaveController.js       # Leave management
│   │   │   ├── payrollController.js     # Payroll processing
│   │   │   └── reportController.js      # Reports generation
│   │   │
│   │   ├── 📁 models/                   # MongoDB schemas
│   │   │   ├── Company.js               # Multi-tenant company model
│   │   │   ├── Employee.js              # Employee master data
│   │   │   ├── Attendance.js            # Attendance logs & summary
│   │   │   ├── Leave.js                 # Leave types & applications
│   │   │   ├── Payroll.js               # Salary structures & slips
│   │   │   ├── Task.js                  # Task management
│   │   │   ├── Asset.js                 # Asset tracking
│   │   │   └── Document.js              # Document management
│   │   │
│   │   ├── 📁 routes/                   # API routes
│   │   │   ├── authRoutes.js            # Authentication endpoints
│   │   │   ├── employeeRoutes.js        # Employee CRUD operations
│   │   │   ├── attendanceRoutes.js      # Attendance endpoints
│   │   │   ├── leaveRoutes.js           # Leave management APIs
│   │   │   ├── payrollRoutes.js         # Payroll APIs
│   │   │   └── adminRoutes.js           # Admin-only endpoints
│   │   │
│   │   ├── 📁 middleware/               # Custom middleware
│   │   │   ├── authMiddleware.js        # JWT authentication
│   │   │   ├── tenantMiddleware.js      # Multi-tenant isolation
│   │   │   ├── roleMiddleware.js        # Role-based access
│   │   │   ├── errorMiddleware.js       # Error handling
│   │   │   └── uploadMiddleware.js      # File upload handling
│   │   │
│   │   ├── 📁 services/                 # Business logic services
│   │   │   ├── emailService.js          # Email notifications
│   │   │   ├── smsService.js            # SMS notifications
│   │   │   ├── payrollService.js        # Payroll calculations
│   │   │   ├── attendanceService.js     # Attendance processing
│   │   │   ├── reportService.js         # Report generation
│   │   │   └── integrationService.js    # Third-party integrations
│   │   │
│   │   ├── 📁 utils/                    # Utility functions
│   │   │   ├── dateUtils.js             # Date manipulation
│   │   │   ├── validationUtils.js       # Input validation
│   │   │   ├── encryptionUtils.js       # Data encryption
│   │   │   ├── pdfGenerator.js          # PDF generation
│   │   │   └── excelGenerator.js        # Excel export
│   │   │
│   │   ├── 📁 validators/               # Input validation schemas
│   │   │   ├── authValidator.js         # Auth validation rules
│   │   │   ├── employeeValidator.js     # Employee validation
│   │   │   └── leaveValidator.js        # Leave validation
│   │   │
│   │   └── server.js                    # Main server file
│   │
│   ├── 📁 tests/                        # Test files
│   │   ├── 📁 unit/                     # Unit tests
│   │   ├── 📁 integration/              # Integration tests
│   │   └── 📁 fixtures/                 # Test data
│   │
│   ├── 📁 uploads/                      # File uploads directory
│   ├── 📁 logs/                         # Application logs
│   ├── package.json                     # Dependencies & scripts
│   ├── .env.example                     # Environment variables template
│   └── .gitignore                       # Git ignore rules
│
├── 📁 frontend/                         # React Application
│   ├── 📁 public/                       # Static files
│   │   ├── index.html                   # Main HTML template
│   │   ├── manifest.json                # PWA manifest
│   │   └── favicon.ico                  # App icon
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/               # Reusable components
│   │   │   ├── 📁 Auth/                 # Authentication components
│   │   │   │   ├── ProtectedRoute.js    # Route protection
│   │   │   │   ├── RoleBasedRoute.js    # Role-based routing
│   │   │   │   └── LoginForm.js         # Login form component
│   │   │   │
│   │   │   ├── 📁 Layout/               # Layout components
│   │   │   │   ├── Layout.js            # Main layout wrapper
│   │   │   │   ├── Sidebar.js           # Navigation sidebar
│   │   │   │   ├── Header.js            # Top header bar
│   │   │   │   └── Footer.js            # Footer component
│   │   │   │
│   │   │   ├── 📁 UI/                   # UI components
│   │   │   │   ├── Button.js            # Custom button
│   │   │   │   ├── Modal.js             # Modal dialog
│   │   │   │   ├── Table.js             # Data table
│   │   │   │   ├── Form.js              # Form components
│   │   │   │   └── Charts.js            # Chart components
│   │   │   │
│   │   │   ├── 📁 Employee/             # Employee components
│   │   │   │   ├── EmployeeList.js      # Employee listing
│   │   │   │   ├── EmployeeForm.js      # Add/Edit employee
│   │   │   │   └── EmployeeCard.js      # Employee card view
│   │   │   │
│   │   │   ├── 📁 Attendance/           # Attendance components
│   │   │   │   ├── AttendancePortal.js  # Check-in/out portal
│   │   │   │   ├── AttendanceTable.js   # Attendance records
│   │   │   │   └── FaceRecognition.js   # Face recognition
│   │   │   │
│   │   │   └── 📁 Reports/              # Reporting components
│   │   │       ├── ReportBuilder.js     # Report builder
│   │   │       ├── ChartWidget.js       # Chart widgets
│   │   │       └── ExportButton.js      # Export functionality
│   │   │
│   │   ├── 📁 pages/                    # Page components
│   │   │   ├── 📁 Auth/                 # Authentication pages
│   │   │   │   ├── Login.js             # Login page
│   │   │   │   ├── Register.js          # Company registration
│   │   │   │   └── ForgotPassword.js    # Password reset
│   │   │   │
│   │   │   ├── 📁 Dashboard/            # Dashboard pages
│   │   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   │   ├── SuperAdminDashboard.js
│   │   │   │   ├── CompanyAdminDashboard.js
│   │   │   │   ├── HRDashboard.js
│   │   │   │   ├── ManagerDashboard.js
│   │   │   │   └── EmployeeDashboard.js
│   │   │   │
│   │   │   ├── 📁 Employee/             # Employee pages
│   │   │   │   ├── EmployeeList.js      # Employee listing page
│   │   │   │   ├── EmployeeProfile.js   # Employee profile
│   │   │   │   └── AddEmployee.js       # Add new employee
│   │   │   │
│   │   │   ├── 📁 Attendance/           # Attendance pages
│   │   │   │   ├── AttendancePortal.js  # Attendance portal
│   │   │   │   └── AttendanceReports.js # Attendance reports
│   │   │   │
│   │   │   ├── 📁 Leave/                # Leave management pages
│   │   │   │   ├── LeaveApplication.js  # Apply for leave
│   │   │   │   ├── LeaveApproval.js     # Approve leaves
│   │   │   │   └── LeaveReports.js      # Leave reports
│   │   │   │
│   │   │   ├── 📁 Payroll/              # Payroll pages
│   │   │   │   ├── PayrollDashboard.js  # Payroll overview
│   │   │   │   └── SalarySlips.js       # Salary slip viewer
│   │   │   │
│   │   │   ├── 📁 Performance/          # Performance pages
│   │   │   │   ├── PerformanceReview.js # Performance reviews
│   │   │   │   └── KPIDashboard.js      # KPI dashboard
│   │   │   │
│   │   │   ├── 📁 Admin/                # Admin pages
│   │   │   │   ├── CompanySettings.js   # Company settings
│   │   │   │   ├── UserManagement.js    # User management
│   │   │   │   └── SubscriptionManagement.js
│   │   │   │
│   │   │   └── 📁 SuperAdmin/           # Super admin pages
│   │   │       ├── SuperAdminDashboard.js
│   │   │       ├── CompanyManagement.js
│   │   │       └── PlanManagement.js
│   │   │
│   │   ├── 📁 hooks/                    # Custom React hooks
│   │   │   ├── useAuth.js               # Authentication hook
│   │   │   ├── useApi.js                # API calling hook
│   │   │   ├── useLocalStorage.js       # Local storage hook
│   │   │   └── usePermissions.js        # Permissions hook
│   │   │
│   │   ├── 📁 services/                 # API services
│   │   │   ├── api.js                   # Base API configuration
│   │   │   ├── authService.js           # Authentication APIs
│   │   │   ├── employeeService.js       # Employee APIs
│   │   │   ├── attendanceService.js     # Attendance APIs
│   │   │   └── reportService.js         # Reporting APIs
│   │   │
│   │   ├── 📁 store/                    # State management
│   │   │   ├── authStore.js             # Authentication state
│   │   │   ├── employeeStore.js         # Employee state
│   │   │   ├── attendanceStore.js       # Attendance state
│   │   │   └── uiStore.js               # UI state
│   │   │
│   │   ├── 📁 utils/                    # Utility functions
│   │   │   ├── dateUtils.js             # Date formatting
│   │   │   ├── validationUtils.js       # Form validation
│   │   │   ├── formatUtils.js           # Data formatting
│   │   │   └── constants.js             # App constants
│   │   │
│   │   ├── 📁 assets/                   # Static assets
│   │   │   ├── 📁 images/               # Images
│   │   │   ├── 📁 icons/                # Icons
│   │   │   └── 📁 styles/               # CSS files
│   │   │
│   │   ├── App.js                       # Main App component
│   │   ├── App.css                      # Global styles
│   │   └── index.js                     # React entry point
│   │
│   ├── package.json                     # Frontend dependencies
│   ├── tailwind.config.js               # Tailwind CSS config
│   └── .gitignore                       # Git ignore rules
│
├── 📁 shared/                           # Shared utilities
│   ├── 📁 constants/                    # Shared constants
│   │   ├── roles.js                     # User roles
│   │   ├── permissions.js               # Permission matrix
│   │   └── plans.js                     # Subscription plans
│   │
│   ├── 📁 utils/                        # Shared utilities
│   │   ├── validation.js                # Validation schemas
│   │   └── helpers.js                   # Helper functions
│   │
│   └── 📁 types/                        # TypeScript types (if used)
│       ├── user.types.js
│       ├── company.types.js
│       └── api.types.js
│
├── 📁 docs/                             # Documentation
│   ├── API_DOCUMENTATION.md             # API documentation
│   ├── DEPLOYMENT_GUIDE.md              # Deployment guide
│   ├── USER_MANUAL.md                   # User manual
│   ├── DEVELOPER_GUIDE.md               # Developer guide
│   └── 📁 images/                       # Documentation images
│
├── 📁 scripts/                          # Utility scripts
│   ├── setup.sh                         # Initial setup script
│   ├── deploy.sh                        # Deployment script
│   ├── backup.sh                        # Database backup
│   └── seed-data.js                     # Sample data seeder
│
├── 📁 docker/                           # Docker configuration
│   ├── Dockerfile.backend               # Backend Dockerfile
│   ├── Dockerfile.frontend              # Frontend Dockerfile
│   ├── docker-compose.yml               # Docker compose
│   └── nginx.conf                       # Nginx configuration
│
├── 📁 .github/                          # GitHub workflows
│   └── 📁 workflows/
│       ├── ci.yml                       # Continuous integration
│       ├── deploy.yml                   # Deployment workflow
│       └── security.yml                 # Security scanning
│
├── README.md                            # Project overview
├── PROJECT_STRUCTURE.md                 # This file
├── LICENSE                              # License file
├── .gitignore                           # Global git ignore
└── package.json                         # Root package.json

```

## 🏗️ Architecture Overview

### Multi-Tenant Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    HRMS SaaS Platform                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)                                          │
│  ├── Company A Dashboard                                   │
│  ├── Company B Dashboard                                   │
│  └── Company C Dashboard                                   │
├─────────────────────────────────────────────────────────────┤
│  API Layer (Node.js/Express)                              │
│  ├── Authentication & Authorization                        │
│  ├── Tenant Isolation Middleware                          │
│  ├── Role-Based Access Control                            │
│  └── Feature-Based Access Control                         │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                      │
│  ├── Employee Management                                   │
│  ├── Attendance Processing                                 │
│  ├── Leave Management                                      │
│  ├── Payroll Processing                                    │
│  └── Report Generation                                     │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (MongoDB)                                      │
│  ├── Company A Data (tenant_id: A)                        │
│  ├── Company B Data (tenant_id: B)                        │
│  ├── Company C Data (tenant_id: C)                        │
│  └── Global Data (Plans, Templates)                       │
└─────────────────────────────────────────────────────────────┘
```

### Role-Based Access Matrix
```
┌─────────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Module          │ Super Admin │ Company     │ HR Manager  │ Team Lead   │ Employee    │
│                 │             │ Admin       │             │             │             │
├─────────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ SaaS Dashboard  │ Full        │ No          │ No          │ No          │ No          │
│ Company Mgmt    │ Full        │ No          │ No          │ No          │ No          │
│ Employee Mgmt   │ View All    │ Full        │ Full        │ Team View   │ Self View   │
│ Attendance      │ View All    │ Full        │ Full        │ Team View   │ Self Only   │
│ Leave Mgmt      │ View All    │ Full        │ Full        │ Approve     │ Apply Only  │
│ Payroll         │ No          │ Full        │ Partial     │ No          │ Self View   │
│ Performance     │ No          │ Full        │ Partial     │ Team View   │ Self Only   │
│ Reports         │ Global      │ Company     │ HR Reports  │ Team        │ Self        │
│ Settings        │ Global      │ Company     │ No          │ No          │ No          │
└─────────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Subscription Plan Features
```
┌─────────────────┬─────────────┬─────────────┬─────────────┐
│ Feature         │ BASIC       │ MEDIUM      │ GOLD        │
├─────────────────┼─────────────┼─────────────┼─────────────┤
│ Employees       │ 30          │ 150         │ Unlimited   │
│ HR Users        │ 1           │ 3           │ Unlimited   │
│ Storage         │ 1GB         │ 10GB        │ Unlimited   │
│ Attendance      │ Basic       │ Basic       │ Advanced    │
│ Leave Mgmt      │ Basic       │ Advanced    │ Advanced    │
│ Payroll         │ No          │ Yes         │ Yes         │
│ Performance     │ No          │ Basic       │ Advanced    │
│ Geo Attendance  │ No          │ No          │ Yes         │
│ Face Recognition│ No          │ No          │ Yes         │
│ Workflows       │ No          │ No          │ Yes         │
│ Integrations    │ No          │ No          │ Yes         │
│ White Labeling  │ No          │ No          │ Yes         │
│ Support         │ Email       │ Email+Chat  │ Priority    │
└─────────────────┴─────────────┴─────────────┴─────────────┘
```

## 🔧 Key Technologies Used

### Backend Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **NodeMailer** - Email service
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

### Frontend Stack
- **React 18** - UI library
- **React Router** - Routing
- **Zustand** - State management
- **React Query** - Data fetching
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Toastify** - Notifications

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Supertest** - API testing
- **Nodemon** - Development server
- **PM2** - Process management

### DevOps & Deployment
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD
- **MongoDB Atlas** - Cloud database
- **AWS S3** - File storage
- **Stripe/Razorpay** - Payments

## 📊 Database Collections

### Core Collections
1. **companies** - Tenant/company information
2. **employees** - Employee master data
3. **attendance_logs** - Daily attendance records
4. **attendance_summary** - Monthly attendance summary
5. **leaves** - Leave applications
6. **leave_types** - Leave type definitions
7. **leave_balance** - Employee leave balances
8. **payrolls** - Salary processing records
9. **salary_structures** - Employee salary structures
10. **tasks** - Task management
11. **assets** - Company asset tracking
12. **documents** - Document management
13. **departments** - Department master
14. **designations** - Designation master
15. **shifts** - Shift definitions

### Global Collections (Super Admin)
1. **subscription_plans** - Available plans
2. **global_holidays** - Holiday calendar
3. **global_leave_types** - Standard leave types
4. **email_templates** - Email templates
5. **system_settings** - Global settings

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies** for both backend and frontend
3. **Configure environment variables**
4. **Start MongoDB** service
5. **Run backend** server (`npm run dev`)
6. **Run frontend** application (`npm start`)
7. **Access application** at `http://localhost:3000`

## 📝 Development Guidelines

### Code Structure
- Follow **MVC pattern** for backend
- Use **component-based architecture** for frontend
- Implement **proper error handling**
- Add **comprehensive logging**
- Write **unit and integration tests**

### Security Best Practices
- **Never commit** sensitive data
- Use **environment variables** for configuration
- Implement **proper authentication**
- Add **input validation**
- Use **HTTPS** in production

### Performance Optimization
- Implement **database indexing**
- Use **query optimization**
- Add **caching** where appropriate
- Optimize **bundle size**
- Implement **lazy loading**

---

This structure provides a scalable, maintainable, and secure foundation for the HRMS SaaS platform with clear separation of concerns and proper multi-tenant architecture.