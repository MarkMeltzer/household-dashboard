import ShoppingListViewMode from "./ShoppingListViewMode";
import ShoppingListEditMode from "./ShoppingListEditMode";

const ShoppingList = ({ isEditing, shoppingItems, shoppingList, setShoppingList, weekListId }) => {
  const shopColors = {
    Lidl: "rgba(0, 79, 170, 0.178)",
    Jumbo: "rgba(238, 184, 23, 0.37)",
    "Albert Heijn": "rgba(0, 173, 230, 0.253)",
  };

  // extend the shoppinglist when it gets too big
  const nMaxItems = window.innerWidth < 1000 ? 20 : 30;
  const nRows = (Math.floor(shoppingList.length / nMaxItems) + 1) * 10;
  const bottomStyle = {
    gridTemplateRows: `repeat(${nRows}, auto)`,
  };

  let bottomSection;
  if (!shoppingItems.data) {
    // Data is not loaded yet
    bottomSection = (
      <div className="bottomSection" style={bottomStyle}>
        <p className="loading">Loading....</p>
      </div>
    );
  } else if (shoppingItems.data && !isEditing) {
    // View mode
    bottomSection = <ShoppingListViewMode 
      shoppingList={shoppingList}
      setShoppingList={setShoppingList}
      shoppingItems={shoppingItems}
      weekListId={weekListId}
      bottomStyle={bottomStyle}
      shopColors={shopColors}
    />
  } else if (shoppingItems.data && isEditing) {
    // Edit mode
    bottomSection = <ShoppingListEditMode 
      shoppingList={shoppingList}
      setShoppingList={setShoppingList}
      shoppingItems={shoppingItems}
      bottomStyle={bottomStyle}
      shopColors={shopColors}
    />
  }

  return bottomSection;
};

export default ShoppingList;
