# Generated by Django 4.2 on 2023-05-28 20:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('carrito_backend', '0003_detallecarrito_descripcion_detallecarrito_nombre_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Supermercado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=20)),
            ],
        ),
        migrations.RemoveField(
            model_name='producto',
            name='descripcion',
        ),
        migrations.AddField(
            model_name='carrito',
            name='supermercado',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='carrito_backend.supermercado'),
        ),
        migrations.AddField(
            model_name='producto',
            name='supermercado',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='carrito_backend.supermercado'),
        ),
    ]
