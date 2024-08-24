from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from hhd_backend.api.models import (
    Household,
    MealsList,
    ShoppingItem,
    ShoppingList,
    ShoppingListItem,
    User,
    WeekList,
)

# Register your models here.

admin.site.register(User, UserAdmin)
admin.site.register(Household, admin.ModelAdmin)
admin.site.register(MealsList, admin.ModelAdmin)
admin.site.register(ShoppingItem, admin.ModelAdmin)
admin.site.register(ShoppingList, admin.ModelAdmin)
admin.site.register(ShoppingListItem, admin.ModelAdmin)
admin.site.register(WeekList, admin.ModelAdmin)
