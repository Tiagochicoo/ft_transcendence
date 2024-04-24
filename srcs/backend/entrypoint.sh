#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database to start..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database started"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Create a superuser - this can be conditional or based on an environment variable
if [ "$DJANGO_CREATE_SUPERUSER" = "True" ]; then
    echo "Creating superuser..."
    echo "from django.contrib.auth.models import User; User.objects.create_superuser('$POSTGRES_USER', '$POSTGRES_EMAIL', '$POSTGRES_PASSWORD')" | python manage.py shell
fi

# Start the Django application
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
