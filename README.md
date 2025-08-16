# BigData Excel ↔ Google Sheets Dashboard (Node.js + React)

**ภาษาไทยอยู่ด้านล่าง (Thai below).**

A full-stack web app where **admins** can:
- Log in
- Upload Excel files (`.xlsx`) or import data from **Google Sheets**
- Build and save charts (bar/line/pie) to a **public dashboard**
- Mark datasets/charts as public or private
- Allow **users** (no login) to view charts and **download the source Excel**

## Quick Start

### Requirements
- Node.js 18+
- npm 9+
- (Optional) Google Cloud Service Account for Google Sheets import

### 1) Install
```bash
cd server && npm install
cd ../web && npm install
```

### 2) Configure Environment
Create `server/.env` using `server/.env.example`:
```
PORT=4000
JWT_SECRET=change_this_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```
> If you will import from Google Sheets, rename `server/service-account.sample.json` to `service-account.json`
> and paste your credentials there. Then **share the Sheet** with the `client_email` of that service account.

### 3) Run Dev Servers
In two terminals:
```bash
# Terminal A
cd server
npm run dev

# Terminal B
cd web
npm run dev
```
- Backend: http://localhost:4000
- Frontend: http://localhost:5173

### 4) Login as Admin
- Email: `ADMIN_EMAIL` (default: `admin@example.com`)
- Password: `ADMIN_PASSWORD` (default: `admin123`)

### 5) Use the App
- **Admin**:
  - Upload Excel at **Admin Dashboard → Upload Excel**
  - Import Google Sheets at **Admin Dashboard → Import Google Sheet** (provide Sheet ID and optional A1 range)
  - Build charts at **Admin Dashboard → Chart Builder** (choose dataset, sheet, x/y columns, chart type)
  - Toggle chart visibility to show in **Public Dashboard**
- **Users**:
  - Visit **Public Dashboard** to see charts and **download source Excel**

### Notes
- Uploaded files are stored under `server/uploads/` and registered in SQLite DB at `server/data/db.sqlite`.
- The app reads the workbook and exposes sheet data via `/api/datasets/:id/data` (paginated).
- For very large Excel files, consider paging and lighter charts; this starter loads chunks on demand.

---

## ไทย (TH)

เว็บแอปฯ สำหรับ **ผู้ดูแล (Admin)**:
- เข้าสู่ระบบ
- อัปโหลดไฟล์ Excel (`.xlsx`) หรือ **ดึงข้อมูลจาก Google Sheets**
- สร้างและบันทึกกราฟ (แท่ง/เส้น/วงกลม) แสดงบน **หน้าสาธารณะ**
- ตั้งค่าให้ชุดข้อมูล/กราฟเป็นสาธารณะหรือส่วนตัว
- **ผู้ใช้ทั่วไป** (ไม่ต้องล็อกอิน) สามารถดูกราฟและ **ดาวน์โหลดไฟล์ Excel ต้นฉบับ**

### เริ่มต้นใช้งาน
ดูขั้นตอนด้านบน (Quick Start). ตัวอย่างไฟล์อยู่ในโฟลเดอร์ `demo_data/` — อัปโหลดผ่านหน้า Admin ได้ทันที

---

## Project Structure
```
bigdata-dashboard/
  server/         # Express + SQLite + Google Sheets import + file uploads
  web/            # React + Vite + Tailwind + Recharts
  demo_data/      # Your uploaded sample Excel files (copy)
  docs/           # PDF manual
```
