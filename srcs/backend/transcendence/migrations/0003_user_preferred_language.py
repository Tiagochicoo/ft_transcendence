# Generated by Django 4.2.13 on 2024-05-30 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcendence', '0002_alter_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='preferred_language',
            field=models.CharField(default='en', max_length=2),
        ),
    ]
