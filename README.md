# HRMS Lite - Full-Stack Application

A complete production-ready Human Resource Management System built with Next.js and Node.js. This application allows admins to manage employees, track attendance, and view dashboard summaries.

## 🚀 Features

- **Authentication**: Cookie-based JWT authentication with OTP login
- **Employee Management**: Create, view, and delete employees
- **Attendance Tracking**: Mark and filter attendance by date
- **Dashboard**: Real-time summary with employee statistics and today's attendance
- **Protected Routes**: Secure access to all admin features
- **Modern UI**: Clean, professional interface built with Tailwind CSS and Shadcn UI

## 🧱 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** components
- **Axios** for API calls
- **React Hook Form** + **Zod** for validation

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **ESM Modules** ("type": "module")
- **MongoDB** with **Mongoose**
- **JWT** Authentication
- **HTTP-Only Cookies** for secure token storage

## 📁 Project Structure

```
hrms-lite/
├── frontend/          # Next.js application
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities and API client
│   └── middleware.ts # Route protection
│
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/   # Database and environment config
│   │   ├── models/   # Mongoose models
│   │   ├── routes/   # API routes
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth and error middleware
│   │   └── utils/    # Helper functions
│   └── src/scripts/  # Seed scripts
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hrms-lite
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLIENT_URL=http://localhost:3000

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@hrms-lite.com
```

**Email Setup (Gmail Example):**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password in `EMAIL_PASSWORD` (not your regular Gmail password)
4. Set `EMAIL_USER` to your Gmail address
5. For other email providers, update `EMAIL_HOST` and `EMAIL_PORT` accordingly

**Note:** If email is not configured, OTP will be logged to console (development mode only).

4. Seed admin users:
```bash
npm run seed
```

This will create two admin accounts:
- `developwithdubey@gmail.com`
- `ayushdubey2017@gmail.com` (OTP always: `1111`)

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Authentication

### Admin Accounts

Two admin accounts are pre-seeded:

1. **developwithdubey@gmail.com**
   - OTP will be generated randomly
   - Check console logs for OTP in development mode

2. **ayushdubey2017@gmail.com**
   - **OTP is always: `1111`** (for demo purposes)

### Login Flow

1. Enter your email on the login page
2. Receive OTP (check console in development)
3. Enter OTP on verification page
4. Get authenticated with HTTP-only cookie
5. Access protected dashboard

## 📡 API Routes

### Authentication
- `POST /api/v1/auth/send-otp` - Send OTP to email
- `POST /api/v1/auth/verify-otp` - Verify OTP and login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

### Employees
- `POST /api/v1/employees` - Create employee
- `GET /api/v1/employees` - Get all employees
- `DELETE /api/v1/employees/:id` - Delete employee

### Attendance
- `POST /api/v1/attendance` - Mark attendance
- `GET /api/v1/attendance/employee/:employeeId` - Get attendance by employee
- `GET /api/v1/attendance/date?date=YYYY-MM-DD` - Filter attendance by date
- `GET /api/v1/attendance/summary` - Get all attendance records

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard summary

## 🎨 Frontend Pages

- `/login` - Login page
- `/verify-otp` - OTP verification page
- `/dashboard` - Dashboard with summary cards and today's attendance
- `/employees` - Employee list with add/delete functionality
- `/attendance` - Attendance marking and filtering
- `/attendance/[employeeId]` - Individual employee attendance history

## 🗄️ Database Models

### User
```typescript
{
  email: string (unique)
  role: "admin"
  createdAt: Date
}
```

### Employee
```typescript
{
  employeeId: string (unique)
  fullName: string
  email: string (unique)
  department: string
  createdAt: Date
}
```

### Attendance
```typescript
{
  employee: ObjectId (ref Employee)
  date: string (YYYY-MM-DD)
  status: "Present" | "Absent"
  createdAt: Date
}
```

**Unique Constraint**: One attendance record per employee per date

## 🔒 Security Features

- HTTP-only cookies for JWT storage
- Cookie-based authentication (no localStorage)
- Protected API routes with middleware
- CORS configured for frontend origin
- Input validation with Zod
- Secure password handling (OTP-based)

## 🛠️ Development

### Backend Commands
```bash
npm run dev    # Start development server with hot reload
npm run build  # Build for production
npm run start  # Start production server
npm run seed   # Seed admin users
```

### Frontend Commands
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_URL` - Frontend URL for CORS
- `EMAIL_HOST` - SMTP server host (default: smtp.gmail.com)
- `EMAIL_PORT` - SMTP server port (default: 587)
- `EMAIL_USER` - Email address for sending OTP
- `EMAIL_PASSWORD` - Email password or app password
- `EMAIL_FROM` - Sender email address

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🚀 Deployment

### Backend Deployment

1. Build the TypeScript code:
```bash
npm run build
```

2. Set environment variables on your hosting platform
3. Start the server:
```bash
npm start
```

### Frontend Deployment

1. Build the Next.js application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Or deploy to **Vercel**, **Netlify**, or any static hosting provider.

## ⚠️ Important Notes

- **OTP Storage**: OTPs are stored in memory (for production, use Redis or similar)
- **JWT Secret**: Change `JWT_SECRET` in production
- **MongoDB**: Ensure MongoDB is running before starting backend
- **CORS**: Update `CLIENT_URL` for production deployment
- **Cookies**: HTTP-only cookies require same-origin or proper CORS setup

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with correct values
- Check port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is properly configured

### Authentication issues
- Clear cookies and try logging in again
- Verify JWT_SECRET is set correctly
- Check if admin users are seeded

## 📄 License

This project is for educational/demonstration purposes.

## 👨‍💻 Author

Built as a full-stack HRMS Lite application demonstration.

---

**Happy Coding! 🚀**
