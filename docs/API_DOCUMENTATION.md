# 📚 HRMS SaaS API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.hrmssaas.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🔐 Authentication Endpoints

### Register Company
```http
POST /auth/register
```

**Request Body:**
```json
{
  "company_name": "Tech Corp",
  "company_email": "admin@techcorp.com",
  "company_phone": "+91 9876543210",
  "industry": "Technology",
  "company_size": "51-200",
  "admin_name": "John Doe",
  "admin_email": "john@techcorp.com",
  "admin_phone": "+91 9876543211",
  "password": "SecurePass123!",
  "plan": "MEDIUM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company registered successfully",
  "data": {
    "company": {
      "id": "company_id",
      "name": "Tech Corp",
      "plan": "MEDIUM",
      "trial_end": "2024-01-15T00:00:00.000Z"
    },
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@techcorp.com",
      "role": "COMPANY_ADMIN"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@techcorp.com",
  "password": "SecurePass123!"
}
```

### Refresh Token
```http
POST /auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

---

## 👥 Employee Management

### List Employees
```http
GET /employees?page=1&limit=10&search=john&department=IT&status=ACTIVE
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email
- `department` (optional): Filter by department ID
- `status` (optional): Filter by status (ACTIVE, INACTIVE, etc.)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "employee_id",
      "employee_id": "EMP001",
      "first_name": "John",
      "last_name": "Doe",
      "official_email": "john@company.com",
      "phone": "+91 9876543210",
      "department": {
        "id": "dept_id",
        "name": "IT"
      },
      "designation": {
        "id": "desig_id",
        "name": "Software Engineer"
      },
      "role": "EMPLOYEE",
      "status": "ACTIVE",
      "date_of_joining": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Create Employee
```http
POST /employees
```

**Request Body:**
```json
{
  "employee_id": "EMP002",
  "first_name": "Jane",
  "last_name": "Smith",
  "official_email": "jane@company.com",
  "personal_email": "jane.smith@gmail.com",
  "phone": "+91 9876543211",
  "date_of_birth": "1990-05-15",
  "gender": "Female",
  "department_id": "dept_id",
  "designation_id": "desig_id",
  "reporting_manager": "manager_id",
  "date_of_joining": "2024-01-15",
  "employment_type": "Full-time",
  "role": "EMPLOYEE",
  "salary_structure_id": "salary_id",
  "bank_details": {
    "account_number": "1234567890",
    "ifsc_code": "HDFC0001234",
    "bank_name": "HDFC Bank",
    "branch": "Main Branch"
  }
}
```

### Update Employee
```http
PUT /employees/:id
```

### Delete Employee
```http
DELETE /employees/:id
```

---

## ⏰ Attendance Management

### Mark Attendance
```http
POST /attendance/punch
```

**Request Body:**
```json
{
  "type": "IN", // or "OUT"
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "Bangalore, Karnataka"
  },
  "method": "WEB", // WEB, MOBILE, BIOMETRIC, FACE
  "face_data": {
    "confidence_score": 0.95,
    "image_base64": "base64_image_data"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "id": "attendance_id",
    "employee_id": "employee_id",
    "date": "2024-01-15",
    "punch_in": "2024-01-15T09:15:00.000Z",
    "status": "PRESENT",
    "is_late": false,
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  }
}
```

### Get Attendance Summary
```http
GET /attendance/summary?employee_id=emp_id&month=1&year=2024
```

### Manual Attendance Entry
```http
POST /attendance/manual
```

**Request Body:**
```json
{
  "employee_id": "employee_id",
  "date": "2024-01-15",
  "punch_in": "09:00",
  "punch_out": "18:00",
  "reason": "Forgot to punch",
  "approved_by": "manager_id"
}
```

---

## 🏖️ Leave Management

### Apply Leave
```http
POST /leaves/apply
```

**Request Body:**
```json
{
  "leave_type_id": "leave_type_id",
  "from_date": "2024-01-20",
  "to_date": "2024-01-22",
  "is_half_day": false,
  "reason": "Personal work",
  "contact_number": "+91 9876543210",
  "address_during_leave": "Home address"
}
```

### Get Leave Balance
```http
GET /leaves/balance?employee_id=emp_id&year=2024
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "leave_type": {
        "id": "leave_type_id",
        "name": "Annual Leave",
        "code": "AL"
      },
      "allocated": 21,
      "used": 5,
      "pending": 2,
      "balance": 14
    }
  ]
}
```

### Approve/Reject Leave
```http
POST /leaves/:id/approve
```

**Request Body:**
```json
{
  "status": "APPROVED", // or "REJECTED"
  "comments": "Approved for the requested dates"
}
```

---

## 💰 Payroll Management

### Generate Payroll
```http
POST /payroll/generate
```

**Request Body:**
```json
{
  "month": 1,
  "year": 2024,
  "employee_ids": ["emp1", "emp2"], // optional, if not provided, generates for all
  "include_bonus": true,
  "include_overtime": true
}
```

### Get Salary Slip
```http
GET /payroll/salary-slip/:employee_id?month=1&year=2024
```

### Update Salary Structure
```http
PUT /payroll/salary-structure/:employee_id
```

**Request Body:**
```json
{
  "basic": 25000,
  "hra": 10000,
  "allowances": {
    "transport": 2000,
    "medical": 1500,
    "special": 3000
  },
  "deductions": {
    "pf": 1800,
    "esi": 750,
    "tax": 2500
  }
}
```

---

## 📊 Reports & Analytics

### Attendance Report
```http
GET /reports/attendance?from_date=2024-01-01&to_date=2024-01-31&department=IT
```

### Leave Report
```http
GET /reports/leaves?from_date=2024-01-01&to_date=2024-01-31&status=APPROVED
```

### Payroll Report
```http
GET /reports/payroll?month=1&year=2024&department=IT
```

### Employee Report
```http
GET /reports/employees?status=ACTIVE&department=IT&export=pdf
```

---

## 🏢 Company Management (Admin Only)

### Update Company Settings
```http
PUT /companies/settings
```

**Request Body:**
```json
{
  "settings": {
    "timezone": "Asia/Kolkata",
    "currency": "INR",
    "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "grace_period_minutes": 15
  }
}
```

### Manage Subscription
```http
PUT /companies/subscription
```

**Request Body:**
```json
{
  "plan": "GOLD",
  "billing_cycle": "MONTHLY", // or "YEARLY"
  "auto_renewal": true
}
```

---

## 🚀 Super Admin Endpoints

### List All Companies
```http
GET /super-admin/companies?status=ACTIVE&plan=GOLD
```

### Approve Company
```http
POST /super-admin/companies/:id/approve
```

### Create Subscription Plan
```http
POST /super-admin/plans
```

**Request Body:**
```json
{
  "name": "PREMIUM",
  "title": "Premium Plan",
  "price": 7999,
  "currency": "INR",
  "billing_cycle": "MONTHLY",
  "limits": {
    "employees": -1,
    "storage_gb": -1
  },
  "features": {
    "payroll": true,
    "performance": true,
    "geo_attendance": true,
    "face_attendance": true,
    "workflows": true
  }
}
```

---

## 📱 Webhook Endpoints

### Stripe Webhook
```http
POST /webhooks/stripe
```

### Razorpay Webhook
```http
POST /webhooks/razorpay
```

---

## 🔍 Search & Filters

### Global Search
```http
GET /search?q=john&type=employee,task,document
```

### Advanced Filters
Most list endpoints support advanced filtering:
- Date ranges: `from_date`, `to_date`
- Status filters: `status=ACTIVE,PENDING`
- Department filters: `department=IT,HR`
- Role filters: `role=EMPLOYEE,MANAGER`

---

## 📄 File Upload

### Upload Document
```http
POST /upload/document
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: File to upload
- `type`: Document type (RESUME, PHOTO, etc.)
- `employee_id`: Employee ID (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "file_path": "/uploads/documents/filename.pdf",
    "file_name": "resume.pdf",
    "file_size": 1024000,
    "mime_type": "application/pdf"
  }
}
```

---

## 🚦 Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **File Upload**: 10 requests per hour per user

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

---

## 🧪 Testing

Use the provided Postman collection for testing all endpoints:
```bash
# Import the collection
postman-collection.json
```

## 📞 Support

For API support, contact: api-support@hrmssaas.com