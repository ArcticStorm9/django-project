# Generated by Django 3.2.2 on 2021-06-07 02:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_builder', '0019_auto_20210607_0234'),
    ]

    operations = [
        migrations.AlterField(
            model_name='discorduser',
            name='liked_builds',
            field=models.JSONField(default=list),
        ),
    ]
