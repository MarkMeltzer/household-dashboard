from rest_framework import routers

from django.contrib import admin
from django.urls import include, path

from hhd_backend.api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'week_lists', views.WeekListViewSet)
router.register(r'households', views.HouseholdViewSet)
router.register(r'shopping_lists', views.ShoppingListViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
