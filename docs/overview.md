# Create the content for the PROJECT_DOCUMENTATION.md file
doc_content = """
# 📘 Project Documentation — AssetsIQ Of NIC

---

## 🧾 Project Overview

**AssetsIQ Of NIC** is a secure and intelligent digital asset management system developed for managing IT assets across departments within government infrastructure. It is designed and implemented under the National Informatics Centre (NIC) to streamline the lifecycle of asset records, improve auditing and compliance tracking, and centralize access to critical project infrastructure data.

---

## 🎯 Objective

The primary goal of **AssetsIQ** is to:
- Simplify the creation, tracking, and updating of digital assets.
- Provide visibility and security compliance tracking (e.g., VA, SSL scores, third-party audits).
- Offer role-based access for HODs, Project Managers (PMs), and auditors.
- Centralize project metadata such as hosting infrastructure, technology stack, database configurations, and audit statuses.

---

## 🔐 Key Features

- **Role-Based Access Control** for HODs, PMs, and auditors.
- **Modular Asset Entry**: Assets divided into Business Profile (BP), Security Audit (SA), Infrastructure (Infra), and Tech Stack (TS).
- **Comprehensive API Set**: For creating, updating, retrieving, and deleting assets using asset ID or other identifiers (PRISM ID, project name, department name, etc.).
- **Audit & Compliance Tracking**: Store and track SSL scores, audit certificates, VA audit reports, and next expiry dates.
- **Search & Filter** by data center, department, project, or technology parameters.

---

## 🧱 Technology Stack

| Layer         | Tech Used                                |
|--------------|-------------------------------------------|
| **Frontend**  | React.js / HTML5 / CSS3 / Bootstrap       |
| **Backend**   | Node.js (Express.js)                     |
| **Database**  | MongoDB (`users`, `assets`, `auditLogs`) |
| **Hosting**   | Cloud / Co-location (VM / Containerized) |
| **Deployment**| Docker, with future Kubernetes support    |
| **Security**  | SSL, VA Audit Integration                |

---

## 📦 API Modules

- **POST** `/assets` → Add new asset  
- **GET** `/assets/:id` → Fetch asset by ID  
- **PUT** `/assets/bp/:id` → Update Business Profile  
- **PUT** `/assets/sa/:id` → Update Security Audit  
- **PUT** `/assets/infra/:id` → Update Infrastructure  
- **PUT** `/assets/ts/:id` → Update Tech Stack  
- **DELETE** `/assets/:id` → Delete Asset  
- **GET** `/assets/by-project-name/:name`, `/by-prism-id/:id`, `/by-dept-name/:name`, `/by-DC/:dc` → Filtered fetch

---

## 🧑‍💻 User Types

- **HOD**: Can assign new projects and validate information.
- **PM**: Can fill in detailed asset information in multiple stages.
- **Auditor**: Views reports, audit data, SSL scores, and compliance.

---

## 🏢 Infrastructure Support

- **Data Centers**: NDC, SDC, AWS, Azure, GCP  
- **Deployment Types**: VM, Containers, Physical Machine  
- **Server OS**: Linux / Windows  
- **Database Server**: MongoDB (digital_asset)

---

## 🛠️ Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-org/assetsiq-nic-backend.git
cd assetsiq-nic-backend
