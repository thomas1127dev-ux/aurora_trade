
Django backend for the Aurora project.

Environment variables (.env):
DJANGO_SECRET_KEY, DJANGO_DEBUG (1/0),
MYSQL_DATABASE (default aurora_trade), MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT,
EMAIL_BACKEND (optional), EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD,
LOGIN_EXPIRE_HOUR (default 24)

Install & run:
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
