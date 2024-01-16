import ShoppingListViewMode from "./ShoppingListViewMode";
import ShoppingListEditMode from "./ShoppingListEditMode";

const ShoppingList = ({ isEditing, shoppingItems, shoppingList, setShoppingList, weekListId }) => {
  // extend the shoppinglist when it gets too big
  let nCols = 1;
  if (window.innerWidth < 1200) {
    nCols = 1;
  } else if (window.innerWidth < 1900) {
    nCols = 2;
  } else {
    nCols = 3;
  }

  const rowStep = 20
  const nMaxItems = nCols * rowStep
  const nRows = (Math.floor(shoppingList.length / nMaxItems) + 1) * rowStep;
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
    />
  } else if (shoppingItems.data && isEditing) {
    // Edit mode
    bottomSection = <ShoppingListEditMode 
      shoppingList={shoppingList}
      setShoppingList={setShoppingList}
      shoppingItems={shoppingItems}
      bottomStyle={bottomStyle}
    />
  }

  return bottomSection;
};

export default ShoppingList;
