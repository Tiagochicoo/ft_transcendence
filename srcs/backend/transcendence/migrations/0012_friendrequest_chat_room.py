# Generated by Django 4.2.13 on 2024-05-14 19:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('transcendence', '0011_alter_user_email_alter_user_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='friendrequest',
            name='chat_room',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='chat_room', to='transcendence.chatroom'),
        ),
    ]
