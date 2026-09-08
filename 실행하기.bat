@echo off
chcp 65001 > nul
title 내 차 어디에? - 주차 위치 기록 앱

cd /d "%~dp0"

echo ========================================================
echo    🚗 '내 차 어디에?' 주차 위치 앱을 시작합니다...
echo ========================================================
echo.

:: 1. 필수 모듈 확인
if not exist "node_modules\" (
    echo [1/3] 필수 패키지를 설치하고 있습니다. 잠시만 기다려 주세요...
    call npm.cmd install
    if errorlevel 1 (
        echo [오류] 패키지 설치에 실패했습니다.
        pause
        exit /b 1
    )
)

:: 2. 프로덕션 빌드 생성 (PWA 및 최적화)
if not exist "dist\" (
    echo [2/3] 앱 빌드를 진행하고 있습니다...
    call npm.cmd run build
    if errorlevel 1 (
        echo [오류] 앱 빌드에 실패했습니다.
        pause
        exit /b 1
    )
)

echo [3/3] 내부 접속용 서버를 실행합니다...
echo.
echo - PC 브라우저가 자동으로 열립니다. (https://localhost:4173)
echo - 스마트폰은 아래 터미널에 표시되는 QR 코드를 카메라로 스캔하거나
echo   네트워크 주소(https://...)로 접속하세요.
echo.
echo ※ 최초 접속 시 '보안 경고(자체 서명 인증서)'가 나타나면
echo   [고급] -^> [계속 진행 / 안전하지 않음으로 이동]을 눌러주세요.
echo   (스마트폰 GPS 위치 권한 허용을 위해 HTTPS가 필요합니다)
echo.
echo ========================================================
echo.

call npm.cmd run start

pause
