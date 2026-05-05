@echo off
REM Script to upload puzzle game data to MongoDB using curl
REM Make sure your backend server is running on http://localhost:5000

echo Uploading puzzle game data to MongoDB...

curl -X POST http://localhost:5000/api/puzzle-data/bulk ^
  -H "Content-Type: application/json" ^
  -d "{\"gameDataArray\": [{\"username\": \"test_user\", \"level\": \"Easy\", \"pieces\": 4, \"time\": \"00:09\", \"timeTaken\": 9, \"tries\": 0, \"mouseSpeed\": 698, \"path\": 4798, \"rating\": \"Excellent\", \"date\": \"2026-05-03T13:45:00Z\"}, {\"username\": \"test_user\", \"level\": \"Medium\", \"pieces\": 9, \"time\": \"00:17\", \"timeTaken\": 17, \"tries\": 1, \"mouseSpeed\": 502, \"path\": 5870, \"rating\": \"Excellent\", \"date\": \"2026-05-03T13:46:00Z\"}]}"

echo.
echo Fetching puzzle history...
curl -X GET "http://localhost:5000/api/puzzle-data/history?username=test_user"

echo.
echo Fetching puzzle statistics...
curl -X GET "http://localhost:5000/api/puzzle-data/stats?username=test_user"

pause
