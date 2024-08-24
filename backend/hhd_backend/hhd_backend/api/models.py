from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models


# Create your models here.
class User(AbstractUser):
    pass


class Household(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self) -> str:
        return self.name


class WeekList(models.Model):
    household = models.ForeignKey(Household, on_delete=models.CASCADE)

    created = models.DateField(auto_now_add=True)
    starting_date = models.DateField()

    def __str__(self) -> str:
        return f'Starting date "{self.starting_date}"'


class MealsList(models.Model):
    week_list = models.OneToOneField(WeekList, on_delete=models.CASCADE)


class ShoppingItem(models.Model):
    household = models.ForeignKey(Household, on_delete=models.CASCADE)

    name = models.CharField(max_length=256)

    def __str__(self) -> str:
        return self.name


class ShoppingList(models.Model):
    week_list = models.OneToOneField(WeekList, on_delete=models.CASCADE)

    shopping_items = models.ManyToManyField(ShoppingItem, through='ShoppingListItem')

    def __str__(self) -> str:
        week_list = getattr(self, 'week_list', None)
        return f'For weeklist "{week_list}"'


class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE)
    shopping_item = models.ForeignKey(ShoppingItem, on_delete=models.CASCADE)

    amount = models.IntegerField(default=1, validators=[MinValueValidator(1)])

    def __str__(self) -> str:
        return f'{self.shopping_item} on {self.shopping_list}'
