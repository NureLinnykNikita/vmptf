from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Заголовок')),
                ('text', models.TextField(verbose_name='Текст')),
                ('published_date', models.DateField(verbose_name='Дата публікації')),
                ('author', models.CharField(max_length=100, verbose_name='Автор')),
            ],
            options={
                'verbose_name': 'Стаття',
                'verbose_name_plural': 'Статті',
                'ordering': ['-published_date'],
            },
        ),
    ]
