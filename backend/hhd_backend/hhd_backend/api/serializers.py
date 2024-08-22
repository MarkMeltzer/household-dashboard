from rest_framework import serializers

from django.contrib.auth.models import User

from hhd_backend.api.models import Household, ShoppingList, ShoppingListItem, WeekList


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class HouseholdSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Household
        fields = '__all__'


class WeekListSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WeekList
        fields = '__all__'


class ShoppingListItemSerializer(serializers.HyperlinkedModelSerializer):
    shopping_item_name = serializers.SlugRelatedField(
        source='shopping_item',
        slug_field='name',
        read_only=True,
    )

    class Meta:
        model = ShoppingListItem
        fields = ['shopping_item_name', 'amount']


class ShoppingListSerializer(serializers.HyperlinkedModelSerializer):
    shopping_list_items = ShoppingListItemSerializer(many=True, source='shoppinglistitem_set')

    class Meta:
        model = ShoppingList
        fields = ['week_list', 'shopping_list_items']
