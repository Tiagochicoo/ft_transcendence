# Generated by Django 4.2.13 on 2024-05-31 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transcendence', '0003_user_preferred_language'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_2fa_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='two_factor_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]