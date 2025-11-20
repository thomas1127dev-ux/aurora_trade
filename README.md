
Aurora minimal scaffold.

Backend: backend/
Frontend: frontend/

This is a scaffold implementing:
- Django REST API: registration with email verification, login (username/email), announcement list, basic user info.
- React frontend: login, register, dashboard protected by token, theme switch (persisted in localStorage), copy invite code, announcement display.

Instructions:
1. Backend: set environment variables in backend/.env or export them. Install python packages, run migrations, create superuser, runserver.
2. Frontend: npm install in frontend, npm start.

The zip contains everything required to run locally. The email sending uses Django console backend by default (prints codes to console).
