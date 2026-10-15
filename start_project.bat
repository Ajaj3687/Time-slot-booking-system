@echo off
echo Starting Time Slot Booking System...

cd client

if not exist "node_modules" (
    echo Installing dependencies... (This may take a few minutes)
    call npm install
)

echo Starting Development Server...
start http://localhost:5173
npm run dev
