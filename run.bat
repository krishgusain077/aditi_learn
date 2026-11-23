@echo off
setlocal enabledelayedexpansion

:: Install npm dependencies
echo Installing npm dependencies...
npm install
if errorlevel 1 (
  echo npm install failed.
  exit /b 1
)

:: Run TypeScript typecheck
echo Running TypeScript typecheck...
npm run typecheck
if errorlevel 1 (
  echo Typecheck failed.
  exit /b 1
)

:: Run contract smoke tests
echo Running contract tests...
npm run test:contracts
if errorlevel 1 (
  echo Contract tests failed.
  exit /b 1
)

:: Run Jest test suite
echo Running Jest test suite...
npm test
if errorlevel 1 (
  echo Jest tests failed.
  exit /b 1
)

:: Start Expo development server
echo Starting Expo dev server...
npm start

exit /b 0