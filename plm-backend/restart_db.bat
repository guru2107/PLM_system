@echo off
echo Restarting PostgreSQL Server...
net stop postgresql-x64-18
net start postgresql-x64-18
echo Database configuration reloaded successfully!
pause
