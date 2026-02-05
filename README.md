HRMS Lite

A lightweight Human Resource Management System (HRMS) built with React and FastAPI.
Designed to manage employees and attendance with a clean UI and a fast, async backend.


## 🚀 Tech Stack


Frontend
React 19 (Vite)
Tailwind CSS 4

Backend
FastAPI (Python)
MongoDB
Motor (Async MongoDB driver)
Pydantic v2

## 📁 Project Structure

HRMS-Lite/
│
├── client/                  
│   ├── src/
│   │   ├── components/      
│   │   ├── pages/           
│   │   ├── services/       
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── server/                  
    ├── config/              
    ├── routes/              
    ├── schemas/            
    ├── main.py              
    └── requirements.txt


## ⚙️ Setup & Installation

### Backend

```bash
cd server
python -m venv venv

venv\Scripts\activate      
# source venv/bin/activate 
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
