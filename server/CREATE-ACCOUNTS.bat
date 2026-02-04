@echo off
title BantayPlaka - Create Admin and Guard Accounts
cd /d "%~dp0"
echo.
echo BantayPlaka: Creating login accounts for this PC...
echo.
node setup-accounts.js
echo.
pause
