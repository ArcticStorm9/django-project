# Generated by Django 3.2.2 on 2021-05-13 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('item_builder', '0005_auto_20210513_1547'),
    ]

    operations = [
        migrations.AlterField(
            model_name='builds',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='items',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
