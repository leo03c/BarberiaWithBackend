# Generated by Django 5.1.3 on 2025-03-17 20:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_producto_cantidad'),
    ]

    operations = [
        migrations.RenameField(
            model_name='promocion',
            old_name='producto',
            new_name='servicio',
        ),
    ]
