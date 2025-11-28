# 🚀 Enterprise HRMS SaaS Platform

A comprehensive, multi-tenant Human Resource Management System built with React, Node.js, and MongoDB.

## 🌟 Features

### 🏢 Multi-Tenant Architecture
- Complete company isolation
- Subscription-based access control
- Plan-based feature restrictions
- Scalable SaaS infrastructure

### 👥 Role-Based Access Control
- **Super Admin**: SaaS platform management
- **Company Admin**: Full company control
- **HR Manager**: HR operations management
- **Team Lead**: Team management
- **Employee**: Self-service portal

### 💰 Subscription Plans

#### BASIC Plan (₹999/month)
- 30 employees
- Basic attendance & leave
- Simple reports
- 1GB storage

#### MEDIUM Plan (₹2999/month)
- 150 employees
- Payroll management
- Performance tracking
- 10GB storage

#### GOLD Plan (₹5999/month)
- Unlimited employees
- All features included
- Face recognition attendance
- Geo-fencing
- Unlimited storage

### 📋 Core Modules

1. **Employee Management** - Complete employee lifecycle
2. **Attendance System** - Multiple check-in methods
3. **Leave Management** - Multi-level approval workflow
4. **Payroll System** - Automated salary processing
5. **Performance Management** - KPI & OKR tracking
6. **Task Management** - Project & task tracking
7. **Document Management** - Secure file storage
8. **Reports & Analytics** - Comprehensive reporting
9. **Workflow Automation** - Custom workflows (Gold)
10. **Asset Management** - Company asset tracking

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** authentication
- **Bcrypt** password hashing
- **Multer** file uploads
- **NodeMailer** email service
- **Winston** logging

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Zustand** state management
- **React Query** data fetching
- **Tailwind CSS** styling
- **React Hook Form** form handling
- **Recharts** data visualization

### Security Features
- JWT token authentication
- Role-based authorization
- Multi-tenant data isolation
- Rate limiting
- Input validation & sanitization
- XSS protection
- CORS configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd HRMS
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Database Setup**
```bash
# Make sure MongoDB is running
# The application will create indexes automatically
```

### Environment Variables

Create `.env` file in backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrms_saas
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_your_stripe_key
RAZORPAY_KEY_ID=rzp_test_your_key
```

## 📊 Database Schema

### Core Collections
- `companies` - Tenant information
- `employees` - Employee master data
- `attendance_logs` - Daily attendance records
- `leaves` - Leave applications
- `payrolls` - Salary processing
- `tasks` - Task management
- `assets` - Company assets

### Multi-Tenant Design
Every tenant-specific collection includes `tenant_id` for data isolation.

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Company registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Token refresh

### Employee Management
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `POST /api/attendance/punch` - Mark attendance
- `GET /api/attendance/summary` - Attendance summary
- `POST /api/attendance/manual` - Manual entry

### Leave Management
- `POST /api/leaves/apply` - Apply leave
- `GET /api/leaves/balance` - Leave balance
- `POST /api/leaves/approve` - Approve leave

## 🎨 UI Components

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Dark mode support (planned)

### Key Components
- Dashboard widgets
- Data tables with sorting/filtering
- Form components with validation
- Modal dialogs
- Notification system

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Feature-based permissions
- Session management

### Data Protection
- Multi-tenant isolation
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

## 📈 Scalability

### Performance Optimizations
- Database indexing
- Query optimization
- Caching strategies
- Image compression
- Code splitting

### Monitoring
- Error logging with Winston
- Performance metrics
- Health check endpoints
- Audit trails

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker Support (Coming Soon)
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@hrmssaas.com or join our Slack channel.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core HRMS modules
- ✅ Multi-tenant architecture
- ✅ Role-based access
- ✅ Subscription management

### Phase 2 (Q1 2024)
- 🔄 Mobile app (React Native)
- 🔄 Advanced analytics
- 🔄 API integrations
- 🔄 Workflow automation

### Phase 3 (Q2 2024)
- 📅 AI-powered insights
- 📅 Advanced reporting
- 📅 Third-party integrations
- 📅 White-label solutions

## 📞 Demo Credentials

### Super Admin
- Email: superadmin@hrms.com
- Password: password123

### Company Admin
- Email: admin@company.com
- Password: password123

### HR Manager
- Email: hr@company.com
- Password: password123

---

**Built with ❤️ by the HRMS SaaS Team**