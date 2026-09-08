# Medical Administration Portal

A full-stack Medical Data Administration Portal with role-based access control, built with **React + Vite** (frontend) and **ASP.NET Core .NET 8 Web API** (backend) connected to **SQL Server**.

---

## Quick Production Launch (1-Click)

The portal is packaged and deployed as a unified production release on port `5000`:

- **Double-click** `start-production.bat` to run the portal and open the browser at **http://localhost:5000**.
- **Double-click** `stop-production.bat` to stop the production server.
- **Double-click** `build-and-deploy.bat` to rebuild the React frontend, update static assets, and publish a fresh release.

---

## Features

- **JWT Authentication** — Secure login with hashed passwords (BCrypt)
- **Role-Based Authorization** — Administrator & Sub-Administrator
- **Patients Directory & Medical Timeline** — Centralized patient registry and clinical trajectory
- **Clinical Reports & Demographics** — Interactive visual analytics, department loads, age/gender charts
- **Medical Records CRUD** — Create, Read, Update, Delete with full validation
- **Data Export** — 1-click export of medical records to CSV
- **Staff Provisioning** — Administrator portal to provision staff accounts
- **Single-Port Production Deployment** — ASP.NET Core serves both REST APIs and the React SPA on port 5000
- **Swagger API Documentation** — Interactive API explorer at `/swagger`

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router, Axios, React Icons |
| **Backend** | ASP.NET Core .NET 8, Entity Framework Core |
| **Database** | SQL Server (LocalDB / Express / Developer) |
| **Authentication** | JWT Bearer Tokens |
| **Password Hashing** | BCrypt.Net |
| **API Docs** | Swagger / OpenAPI |

---

## Architecture

```
React Frontend (port 5173)
       │
       │ HTTP REST API + JWT
       ▼
ASP.NET Core Web API (port 5000)
       │
       │ Entity Framework Core
       ▼
SQL Server Database
```

Both Administrator and Sub-Administrator use:
- **ONE** React frontend
- **ONE** .NET backend
- **ONE** SQL Server database
- **ONE** authentication system

---

## Prerequisites

Install the following before running:

1. **Node.js** (v18+) — https://nodejs.org/
2. **.NET 8 SDK** — https://dotnet.microsoft.com/download/dotnet/8.0
3. **SQL Server** — One of:
   - SQL Server LocalDB (comes with Visual Studio)
   - SQL Server Express (free): https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - SQL Server Developer (free, full-featured)

Verify installation:
```bash
node --version
dotnet --version
```

---

## Database Setup

### Connection String

The default connection string in `backend/appsettings.json` uses **LocalDB**:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MedicalAdminPortalDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

**For SQL Server Express**, change to:
```
Server=.\\SQLEXPRESS;Database=MedicalAdminPortalDb;Trusted_Connection=True;TrustServerCertificate=True
```

**For SQL Server Developer / Full**, change to:
```
Server=.;Database=MedicalAdminPortalDb;Trusted_Connection=True;TrustServerCertificate=True
```

### Entity Framework Migrations

```bash
cd backend

# Install EF Core tools (if not already)
dotnet tool install --global dotnet-ef

# Create migration
dotnet ef migrations add InitialCreate

# Apply migration (creates the database)
dotnet ef database update
```

> **Note:** The backend auto-runs migrations and seeds data on startup, so you may not need to run these manually.

---

## Backend Setup

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Run the backend
dotnet run
```

The API will be available at: **http://localhost:5000**

Swagger UI: **http://localhost:5000/swagger**

### JWT Configuration

In `backend/appsettings.json`:

```json
"JwtSettings": {
  "SecretKey": "MedicalAdminPortal_SuperSecret_JWT_Key_2024_Must_Be_At_Least_32_Characters!",
  "Issuer": "MedicalAdminPortal",
  "Audience": "MedicalAdminPortalUsers",
  "ExpirationMinutes": 480
}
```

> ⚠️ Change `SecretKey` for production deployment.

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### Environment Variables

In `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Test Credentials

| Role | Username | Password |
|------|----------|----------|
| **Administrator** | `admin` | `Admin@123` |
| **Sub-Administrator** | `subadmin` | `SubAdmin@123` |

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login and get JWT token |

### Medical Records
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| GET | `/api/medical-records` | JWT | Admin, SubAdmin |
| GET | `/api/medical-records/{id}` | JWT | Admin, SubAdmin |
| GET | `/api/medical-records/stats` | JWT | Admin, SubAdmin |
| POST | `/api/medical-records` | JWT | **SubAdmin only** |
| PUT | `/api/medical-records/{id}` | JWT | **SubAdmin only** |
| DELETE | `/api/medical-records/{id}` | JWT | **SubAdmin only** |

### User Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile` | JWT | Get profile |
| PUT | `/api/users/profile` | JWT | Update profile |
| POST | `/api/users/change-password` | JWT | Change password |

---

## Role Permissions

| Permission | Administrator | Sub-Administrator |
|-----------|:---:|:---:|
| View Medical Records | ✅ | ✅ |
| Search / Filter / Sort | ✅ | ✅ |
| View Record Details | ✅ | ✅ |
| Create Records | ❌ | ✅ |
| Edit Records | ❌ | ✅ |
| Delete Records | ❌ | ✅ |
| Update Own Profile | ✅ | ✅ |
| Change Password | ✅ | ✅ |

> **Important:** Permissions are enforced at BOTH the frontend (UI) AND backend (API) levels. An Administrator calling POST/PUT/DELETE on the API will receive `403 Forbidden`.

---

## Project Structure

```
medical-admin-portal/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── UsersController.cs
│   │   └── MedicalRecordsController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── MedicalRecord.cs
│   │   └── Enums.cs
│   ├── DTOs/
│   │   ├── AuthDtos.cs
│   │   ├── UserDtos.cs
│   │   └── MedicalRecordDtos.cs
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   └── DbSeeder.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── UserService.cs
│   │   └── MedicalRecordService.cs
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   └── MedicalAdminPortal.csproj
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProfileDropdown.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── MedicalRecordForm.jsx
│   │   │   ├── MedicalRecordModal.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── AccessBadge.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Unauthorized.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── medicalRecordService.js
│   │   │   └── userService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md
```

---

## Quick Start (Both Servers)

**Terminal 1 — Backend:**
```bash
cd medical-admin-portal/backend
dotnet run
```

**Terminal 2 — Frontend:**
```bash
cd medical-admin-portal/frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Testing Role Permissions

1. Login as `admin` / `Admin@123` → See read-only dashboard
2. Confirm: No Create/Edit/Delete buttons visible
3. Logout → Login as `subadmin` / `SubAdmin@123`
4. Create a new medical record → Verify success
5. Logout → Login as `admin`
6. Verify the new record appears in the table
7. Try calling `PUT /api/medical-records/1` as admin via Swagger → 403 Forbidden
8. Try calling `DELETE /api/medical-records/1` as admin → 403 Forbidden

---

## Future Improvements

- [ ] Real-time updates with SignalR
- [ ] File upload for profile images
- [ ] Export medical records to PDF/Excel
- [ ] Audit log for all data changes
- [ ] Additional roles (Doctor, Nurse, etc.)
- [ ] Two-factor authentication
- [ ] Email notifications
- [ ] Dark mode theme
- [ ] Unit and integration tests
- [ ] Docker containerization

---

## License

This project is for educational/demonstration purposes only. Uses fictional medical data.
