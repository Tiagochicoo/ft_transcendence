# Generated by Django 4.2.13 on 2024-05-13 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcendence', '0010_alter_user_email_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]