# Generated by Django 5.1.3 on 2025-03-04 20:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_puesto_remove_cliente_user_delete_customuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trabajador',
            name='puesto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.puesto'),
        ),
    ]
