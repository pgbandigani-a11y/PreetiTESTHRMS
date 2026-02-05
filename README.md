# HRMS Lite 🏢

A lightweight Human Resource Management System built with React and FastAPI.

## 🚀 Tech Stack

**Frontend:**
- React 19 with Vite
- Tailwind CSS 4

**Backend:**
- FastAPI (Python)
- MongoDB with Motor (async driver)
- Pydantic v2

## 📁 Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── server/          # FastAPI backend
    ├── config/
    ├── routes/
    ├── schemas/
    ├── main.py
    └── requirements.txt
```

## ⚙️ Setup & Installation

### Backend

```bash
cd server
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file in the server directory:
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/hrms_lite
```

Run the server:
```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/employees` | List all employees |
| POST | `/employees` | Add new employee |
| GET | `/attendance` | List attendance records |
| POST | `/attendance` | Mark attendance |

## 🚀 Deployment (Render)

### Frontend (Static Site)
- **Root Directory:** `client`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### Backend (Web Service)
- **Root Directory:** `server`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

Add `MONGODB_URL` as an environment variable in Render.
