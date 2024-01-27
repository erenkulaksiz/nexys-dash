@echo off
set /p msg=Message: 
npm version patch
git add .
git commit -m "%msg%"
git push origin master
