# Generated by Django 4.2.13 on 2024-05-21 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcendence', '0002_alter_user_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='avatars/avatar.png', upload_to='avatars/'),
        ),
    ]
