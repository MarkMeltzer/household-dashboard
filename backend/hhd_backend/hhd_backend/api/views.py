from rest_framework import permissions, viewsets

from hhd_backend.api.models import Household, ShoppingList, User, WeekList
from hhd_backend.api.serializers import (
    HouseholdSerializer,
    ShoppingListSerializer,
    UserSerializer,
    WeekListSerializer,
)


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""

    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class HouseholdViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint that allows users to be viewed or edited."""

    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer
    permission_classes = [permissions.IsAuthenticated]


class WeekListViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint that allows users to be viewed or edited."""

    queryset = WeekList.objects.all()
    serializer_class = WeekListSerializer
    permission_classes = [permissions.IsAuthenticated]


class ShoppingListViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint that allows users to be viewed or edited."""

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated]
