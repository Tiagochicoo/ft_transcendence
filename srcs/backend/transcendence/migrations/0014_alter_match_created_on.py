# Generated by Django 4.2.13 on 2024-05-18 09:15

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('transcendence', '0013_match_created_on'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='created_on',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]