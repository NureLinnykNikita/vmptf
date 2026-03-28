from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Рівень 3: Веб-інтерфейс
    path('', include('articles.urls')),
    # Рівень 4: API
    path('api/', include('articles.api_urls')),
]
