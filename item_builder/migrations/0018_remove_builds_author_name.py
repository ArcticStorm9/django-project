# Generated by Django 3.2.2 on 2021-06-06 19:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('item_builder', '0017_remove_builds_liked_users'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='builds',
            name='author_name',
        ),
    ]
