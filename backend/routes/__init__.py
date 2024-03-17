from . import weekLists
from . import shoppingItems
from . import getLoginToken
from . import recipes
from . import shops
from . import users

blueprints = [
    weekLists.blueprint,
    shoppingItems.blueprint,
    getLoginToken.blueprint,
    recipes.blueprint,
    shops.blueprint,
    users.blueprint,
]
