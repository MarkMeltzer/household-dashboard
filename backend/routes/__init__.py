from . import getLoginToken, recipes, shoppingItems, shops, users, weekLists

blueprints = [
    weekLists.blueprint,
    shoppingItems.blueprint,
    getLoginToken.blueprint,
    recipes.blueprint,
    shops.blueprint,
    users.blueprint,
]
