# 🚗 IoT-SPMS — Smart Parking Management System

IoT-SPMS is a Smart Parking Management System developed as a course project for **Software Engineering (CO3001)** at **Ho Chi Minh City University of Technology (HCMUT)**.

This project implements an **Admin Web Dashboard MVP** for managing and monitoring a smart parking system.  
The user-side mobile interfaces are designed as **Figma prototypes**, while the implemented web application focuses on the **Admin Dashboard**.

---

## ✨ Features

### Admin Dashboard
- View system overview
- Monitor total parking slots
- Monitor available and occupied slots
- View parking activity overview
- View revenue and report statistics

### Parking Slot Management
- View parking slot list
- Add new parking slot
- Edit parking slot information
- Delete parking slot
- Track slot status:
  - Available
  - Occupied
  - Maintenance

### Fee Policy Management
- View fee policy list
- Manage fee policies by user group
- Support BKPay-related policy simulation
- Support different vehicle types and payment methods

### Reports
- View parking usage statistics
- View revenue overview
- View BKPay transaction statistics
- View occupancy rate by parking area
- Export report simulation

### Authentication Flow
- Admin login simulation through HCMUT_SSO
- Logout confirmation screen

---

## 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- ExpressJS

### Design & Prototype
- Figma

---

## 📁 Project Structure

```bash
spms_demo/
├── backend/
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone <your-repository-link>
cd spms_demo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Project

```bash
npm start
```

---

## 🌐 Access System

Open browser and go to:

```text
http://localhost:3000
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard` | GET | Get dashboard overview data |
| `/api/slots` | GET | Get parking slot list |
| `/api/slots` | POST | Add a new parking slot |
| `/api/slots/:id` | PUT | Update parking slot information |
| `/api/slots/:id` | DELETE | Delete a parking slot |
| `/api/fees` | GET | Get fee policy list |
| `/api/reports` | GET | Get report overview data |

---

## 🖥️ Implemented Screens

- Admin Login
- System Dashboard
- Parking Slot Management
- Add Parking Slot
- Edit Parking Slot
- Fee Policy Configuration
- Reports Dashboard
- Logout Confirmation

---

## 📱 Prototype Scope

The implemented web application focuses on the **Admin Dashboard**.

The following user-side interfaces are designed in Figma prototype only:

- Student / university member parking flow
- Visitor parking flow
- Mobile login interface
- Mobile payment-related screens

---

## 🧪 Demo Data

This project uses mock data stored directly in the backend source code.

The demo data includes:

- Parking slot information
- Slot status
- Fee policies
- Dashboard statistics
- Report statistics
- BKPay transaction simulation data

No real database is used in this MVP version.

---

## 🚀 Demo Guide

To demonstrate the system:

1. Run the project using:

```bash
npm start
```

2. Open:

```text
http://localhost:3000
```

3. Click **Đăng nhập qua HCMUT_SSO**.

4. Navigate through the sidebar:
   - Tổng quan hệ thống
   - Quản lí chỗ đỗ xe
   - Thiết lập phí
   - Báo cáo tổng quan
   - Đăng xuất

5. In **Quản lí chỗ đỗ xe**, try:
   - Adding a new slot
   - Editing a slot
   - Deleting a slot

---

## 📝 Notes

- This project is an MVP demonstration for academic purposes.
- The backend uses mock data instead of a real database.
- The frontend is implemented with plain HTML, CSS and JavaScript.
- The web implementation focuses on the Admin Dashboard.
- Mobile user interfaces are demonstrated through Figma prototype only.

---

## 👨‍💻 Authors

Faculty of Computer Science and Engineering  
Ho Chi Minh City University of Technology (HCMUT)

Course: **CO3001 - Software Engineering**
