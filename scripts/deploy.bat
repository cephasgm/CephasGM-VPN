@echo off
echo 🚀 CephasGM VPN Deployment
echo ==========================

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

echo Building and starting services...
cd ..\infra
docker-compose up --build -d

echo.
echo ✅ Deployment completed!
echo.
echo 📊 Dashboard: http://localhost:3001
echo 🔗 API: http://localhost:3000
echo 🌐 Health Check: http://localhost:3000/health
echo.
echo 💡 To view logs: docker-compose logs -f
echo 💡 To stop: docker-compose down