Option Explicit

Dim oShell, frontendDir, backendDir
Set oShell = CreateObject("WScript.Shell")

' ====================================================
' المسارات — عدّلها إذا تغيّر موقع المجلدات
' ====================================================

' مجلد الـ Frontend (نفس مجلد هذا الملف تلقائياً)
frontendDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))

' مجلد الـ Backend — عدّل الاسم إذا كان مختلفاً
backendDir = frontendDir & "..\spare-parts-backend"

' ====================================================
' تشغيل الـ Backend (بدون نافذة)
' ====================================================
oShell.Run "cmd /c cd /d """ & backendDir & """ && npm run dev", 0, False

' ====================================================
' تشغيل خادم الـ Frontend (بدون نافذة)
' ====================================================
oShell.Run "cmd /c node """ & frontendDir & "serve-frontend.js""", 0, False

' انتظار 5 ثوانٍ حتى تبدأ الخوادم
WScript.Sleep 5000

' فتح المتصفح
oShell.Run "http://localhost:4200"

Set oShell = Nothing
