# InterviewSync AI - AI-Powered Real-Time Interview Platform

InterviewSync AI is a full-stack AI-powered interview preparation and real-time coding collaboration platform. It helps candidates practice technical and behavioral interviews through AI-driven questioning, live camera-enabled interview sessions, collaborative coding rooms, code execution, speech-to-text interaction, proctoring alerts, and performance analytics.

The platform is designed to simulate a realistic coding interview environment where candidates can log in, start an interview, join collaborative code rooms, run code, receive AI feedback, and track progress through a secure dashboard.

## Features

- **AI Interviewer**: Uses Google Gemini API to ask domain-specific interview questions and evaluate candidate responses.
- **Real-Time Code Collaboration**: Socket.IO-powered coding rooms with shared room IDs, password-based access, live code syncing, participant tracking, and invite links.
- **Run Code Support**: Execute JavaScript, Python, Java, and C++ code through the Judge0 API with stdin, stdout, compile output, runtime errors, status, time, and memory feedback.
- **Camera-Enabled Interview Room**: Requires camera access during interview sessions and displays participant and interviewer tiles for a realistic interview-room experience.
- **Live Proctoring**: Detects tab switching, missing face, multiple faces, and suspicious behavior during interview sessions.
- **Speech-to-Text Interaction**: Uses the Web Speech API for voice-based answer input and natural interview flow.
- **AI Evaluation and Feedback**: Evaluates technical correctness, clarity, depth, behavior, confidence, and communication quality.
- **Dashboard and Analytics**: Tracks interview history, scores, alerts, domain-wise progress, and performance trends.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing.
- **Question Bank**: Includes seed data for DSA, Web Development, Machine Learning, Data Science, HR, and DBMS interview questions.
- **Public Code Room Access**: Users can join a standalone code room from the home page using only a room ID and password.

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React
- Socket.IO Client

**Backend**
- Node.js
- Express.js
- Socket.IO
- Mongoose
- JWT
- bcryptjs

**Database**
- MongoDB / MongoDB Atlas

**AI and Execution**
- Google Gemini API
- Judge0 API
- Web Speech API
- Browser MediaDevices API for camera access

## Project Structure

```text
interview-sync-ai/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   │   ├── CodeRoom.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   └── StartInterview.jsx
│   │   │   ├── InterviewChat.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Results.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── codeController.js
    │   └── interviewController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   ├── Answer.js
    │   ├── InterviewSession.js
    │   ├── Question.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── codeRoutes.js
    │   └── interviewRoutes.js
    ├── seed.js
    ├── server.js
    └── .env.example
```

## Setup and Installation

### Prerequisites

- Node.js v16 or higher
- MongoDB local database or MongoDB Atlas connection URI
- Google Gemini API key
- Judge0 API URL or API key if using a hosted Judge0 provider

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Ai-Interview-Platform-
```

### 2. Install Dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/interview-ai
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_API_KEY=
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Seed the Database

Run the seed command inside the `server` directory:

```bash
cd server
npm run seed
```

This populates MongoDB with sample interview questions across multiple domains.

### 5. Run the Application

Start the backend:

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Main Routes

```text
/                         Home page
/register                 User registration
/login                    User login
/dashboard                Authenticated dashboard
/dashboard/start          Start an AI interview session
/interview-room           Camera-enabled AI interview room
/dashboard/code-room      Authenticated collaborative coding room
/code-room                Public code room entry without login
/results/:id              Interview result and feedback page
```

## Deployment Notes

### Frontend on Vercel

Set these environment variables in Vercel:

```env
VITE_API_URL=https://your-backend-url/api
VITE_SOCKET_URL=https://your-backend-url
```

Do not add `/api` to `VITE_SOCKET_URL`.

### Backend on Render/Railway

Set these environment variables in your backend hosting service:

```env
PORT=5000
CLIENT_URL=https://your-frontend-url
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_API_KEY=
```

After updating environment variables, redeploy both frontend and backend.

## Usage Flow

1. Register or log in to access the dashboard.
2. Start a new interview by selecting a domain and duration.
3. Allow camera access to enter the interview room.
4. Answer AI-generated technical or behavioral questions using text or speech.
5. Use the collaborative code room for coding interview practice.
6. Run code directly from the room and view output or errors.
7. Review performance, alerts, and feedback in the dashboard/results section.

## Resume Summary

InterviewSync AI is an AI-powered real-time collaborative interview platform built with React, Node.js, Express, MongoDB, Socket.IO, Google Gemini API, and Judge0. It supports live coding rooms, code execution, camera-enabled interview sessions, speech-to-text answers, AI-based evaluation, proctoring alerts, JWT authentication, and performance analytics.

## License

This project is built for educational, research, and portfolio purposes.
