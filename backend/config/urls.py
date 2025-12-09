# En config/urls.py (o tu urls.py principal)

from django.contrib import admin
from django.urls import path, include
# --- IMPORTA ESTOS DOS ---
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', include('django_prometheus.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)