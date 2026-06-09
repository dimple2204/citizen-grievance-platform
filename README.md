# Citizen Grievance Redressal Platform (LokShikayat)

A full-stack web application built to help citizens report civic issues (like road damage, water supply disruptions, and garbage disposal problems) directly to municipal departments. The platform manages the workflow of grievances, tracks resolution SLAs (Service Level Agreements), provides visual analytics for administrators, and includes a helper AI chatbot to assist citizens in drafting complaints.

## 🚀 Key Features

* **Citizen Portal**: Lodge complaints by entering details, selecting a department, setting priority, and submitting optional geographic coordinates. Includes a tracking history log.
* **Officer Workspace**: Officers can view complaints assigned to their specific department, update the status (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` / `REJECTED`), and write official remarks.
* **Admin Dashboard**: A summary dashboard displaying Key Performance Indicators (SLA breach rates, resolution times, satisfaction ratings) and visual trend lines using Recharts.
* **LokMitra AI Helper**: A chat assistant integrated with `meta/llama-3.3-70b-instruct` via the NVIDIA API to help citizens write clear, detailed complaint descriptions.
* **Ward Feed & Community Polls**: Displays contact info for the ward councillor and allows citizens to vote on active community proposals with instant result updates.

## 🛠️ Tech Stack

* **Backend**: Java 17, Spring Boot 3.3.5, Spring Security, JWT (Stateless Auth), Spring Data JPA, PostgreSQL.
* **Frontend**: React 19, Vite, Tailwind CSS 4, Recharts (for charts), Axios, React Router 7.

## 📂 Project Structure

```text
├── backend/
│   ├── src/main/java/org/example/backend/
│   │   ├── config/          # Spring Security and CORS config
│   │   ├── controller/      # REST API Controllers (Auth, Complaints, Community, AI)
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities (User, Complaint, Department, PollOption)
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   └── service/         # Business logic (SLA calculations, AI client)
│   └── pom.xml              # Maven dependencies
│
└── frontend/
    ├── src/
    │   ├── components/      # UI components (Navbar, ProtectedRoutes, Tab layouts)
    │   ├── context/         # AuthContext and PortalContext state providers
    │   ├── pages/           # Pages (Home, Login/Register, Portals, AdminDashboard)
    │   └── services/        # Axios API client definition
    └── package.json         # Node dependencies & scripts
```

## 🌐 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/login` | Authenticate user & return JWT token |
| `POST` | `/api/complaints/submit` | Lodge a new complaint (Citizen) |
| `PATCH` | `/api/complaints/{id}/status` | Update grievance status (Officer) |
| `GET` | `/api/admin/analytics` | Fetch aggregate stats & trends (Admin) |
| `POST` | `/api/chat` | Query LokMitra AI assistant |
| `GET` | `/api/community/feed` | Load councillor updates and polls |

## ⚙️ How to Run locally

### Prerequisites
* JDK 17
* Node.js (v18+)
* PostgreSQL running on port 5432

### 1. Database Setup
Create a PostgreSQL database:
```sql
CREATE DATABASE grievance_db;
```

### 2. Backend Setup
1. Open `backend/src/main/resources/application.properties`.
2. Configure your PostgreSQL connection credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/grievance_db
   spring.datasource.username=YOUR_POSTGRES_USER
   spring.datasource.password=YOUR_POSTGRES_PASSWORD
   nvidia.api.key=YOUR_NVIDIA_API_KEY
   ```
3. Start the Spring Boot application:
   ```bash
   # In backend/ directory
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. In the `frontend/` directory, install packages:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Access the app at `http://localhost:5173`.

## 📈 Planned Improvements
* **Map view**: Integrate Leaflet/Mapbox to display complaints on a coordinate-based map.
* **Push alerts**: Add WebSockets for real-time notifications on ticket updates.
