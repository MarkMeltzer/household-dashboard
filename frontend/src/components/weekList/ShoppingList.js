import ShoppingListViewMode from "./ShoppingListViewMode";
import ShoppingListEditMode from "./ShoppingListEditMode";

const ShoppingList = ({ 
  shoppingItems,
  shoppingList,
  setShoppingList,
  shops,
  showSortButton,
  clickSortButton,
  submitWeekList,
  weekListId,
  isEditing,
 }) => {
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
  const shoppingListStyle = {
    gridTemplateRows: `repeat(${nRows}, auto)`,
  };

  if (!shoppingItems.data) {
    // Data is not loaded yet
    return (
      <div className="bottomSection">
        <p className="loading">Loading....</p>
      </div>
    );
  } else if (shoppingItems.data && !isEditing) {
    // View mode
    return <div className="bottomSection">
      {showSortButton && <div className="sortButtonContainer">
        <button onClick={() => submitWeekList(true)} className="sortButton">Sort</button>
      </div>}
      <ShoppingListViewMode 
        shoppingList={shoppingList}
        setShoppingList={setShoppingList}
        shoppingItems={shoppingItems}
        shops={shops}
        weekListId={weekListId}
        shoppingListStyle={shoppingListStyle}
      />
    </div>
  } else if (shoppingItems.data && isEditing) {
    // Edit mode
    return <div className="bottomSection">
      {showSortButton && <div className="sortButtonContainer">
        <button onClick={() => clickSortButton()} className="sortButton">Sort</button>
      </div>}
      <ShoppingListEditMode 
        shoppingList={shoppingList}
        setShoppingList={setShoppingList}
        shoppingItems={shoppingItems}
        shops={shops}
        shoppingListStyle={shoppingListStyle}
      />
    </div>
  }
};

export default ShoppingList;
