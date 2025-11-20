Aurora Frontend (Vite + React + MUI + SCSS) - v2

Highlights:
- Robust validation with zod + react-hook-form (username, password strength, email, code, confirm password)
- Modern, symmetric UI: glass cards, consistent spacing, focus animations
- Top navigation with theme toggle, animated avatar menu, admin button shown if user email listed in src/config.js or if me.is_staff is true
- Route protection, token stored in localStorage and attached automatically to Axios requests
- Framer Motion used for subtle animations

Run:
1. cd aurora_frontend_vite_v2
2. npm install
3. npm run dev
4. Open http://localhost:3000

API compatibility (unchanged):
- POST /api/v1/user/send-code/   { email, purpose }
- POST /api/v1/user/register     { username, email, code, password, confirm_password }
- POST /api/v1/user/login        { login, password } => returns access token in `access`
- GET  /api/v1/user/me           Authorization: Bearer <token>
- GET  /api/v1/user/announcement/list
