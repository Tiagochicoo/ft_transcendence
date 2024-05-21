#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database to start..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database started"

# Apply database migrations
echo "Applying database migrations..."
python manage.py makemigrations transcendence
python manage.py migrate

if [ "$DJANGO_CREATE_SUPERUSER" = "True" ]; then
echo "Creating superuser if not exists..."
echo "from django.contrib.auth.models import User; 
if not User.objects.filter(username='$POSTGRES_USER').exists():
    User.objects.create_superuser('$POSTGRES_USER', '$POSTGRES_EMAIL', '$POSTGRES_PASSWORD')
else:
    print('Superuser already exists. No new superuser was created.')" | python manage.py shell
fi

# Start the Django application
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
