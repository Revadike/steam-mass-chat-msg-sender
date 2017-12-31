@ECHO OFF
CD /D %~dp0
:go
node --max_old_space_size=8096 index.js
pause
goto go