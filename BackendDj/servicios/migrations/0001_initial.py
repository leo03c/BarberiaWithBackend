# Generated by Django 5.2.1 on 2025-05-07 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Servicio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=7)),
                ('descripcion', models.TextField()),
                ('imag', models.ImageField(blank=True, null=True, upload_to='servicio/')),
            ],
        ),
    ]
