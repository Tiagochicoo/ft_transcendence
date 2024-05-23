# Generated by Django 4.2.13 on 2024-05-22 10:13

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('transcendence', '0015_merge_20240521_0904'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='created_on',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
