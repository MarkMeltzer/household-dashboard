import ShoppingItemInput from './ShoppingItemInput';
import { ReactSortable } from 'react-sortablejs';
import { removeItemFromArray } from './utils';
import { Link } from 'react-router-dom';

const ShoppingList = ({
  isEditing,
  shoppingItems,
  shoppingList,
  setShoppingList
}) => {
  // extend the shoppinglist when it gets too big
  const nMaxItems = window.innerWidth < 1000 ? 20 : 30;
  const nRows = (Math.floor(shoppingList.length / nMaxItems) + 1) * 10;
  const bottomStyle = {
    gridTemplateRows: `repeat(${nRows}, auto)`
  }

  const shopColors = {
    "Lidl": "rgba(0, 79, 170, 0.178)",
    "Jumbo": "rgba(238, 184, 23, 0.37)",
    "Albert Heijn": "rgba(0, 173, 230, 0.253)"
  }

  function addShoppingItem() {
    setShoppingList([...shoppingList, { id: "newItem", checked: false }]);    
  }

  function deleteShoppingItem(index) {
    setShoppingList(removeItemFromArray(shoppingList, index));
  }

  let bottomSection;
  if (!shoppingItems.data) {
    // Data is not loaded yet
    bottomSection = <div className="bottomSection" style={bottomStyle}>
      <p className='loading'>Loading....</p>
    </div>
  } else if (shoppingItems.data && !isEditing) {
    // View mode
    bottomSection = <div className="bottomSection" style={bottomStyle}>
      {shoppingList.map((item, index) => 
        // item = { id, checked, amount }
        <div
          className="shoppingItem"
          key={item.id}
          style={
            shoppingItems.data[item.id]?.shop ? 
              { backgroundColor: shopColors[shoppingItems.data[item.id].shop]} :
              {}}
        >
          {shoppingItems.data[item.id] && <>
            {item.amount > 1 && item.amount + "x  "}
            <Link to={"/shoppingItem/" + item.id}>{shoppingItems.data[item.id].name}</Link>
          </>}
        </div>)}
    </div>
  } else if (shoppingItems.data && isEditing) {
    // Edit mode
    bottomSection = 
      <ReactSortable
        list={shoppingList}
        setList={setShoppingList}
        handle=".dragHandle"
        animation={150}
        className="bottomSection"
        style={bottomStyle}
        filter=".addNewButton">
        {
          shoppingList.map((item, index) => 
            // item = { id, checked, amount }
            <div
              className="shoppingItem"
              key={item.id}
              style={
                shoppingItems.data[item.id]?.shop ? 
                  { backgroundColor: shopColors[shoppingItems.data[item.id].shop]} :
                  {}}
            >
              {<>
                <div className='dragHandleContainer'>
                  <div className='dragHandle'></div>
                </div>
                <ShoppingItemInput 
                  shoppingItems={shoppingItems}
                  shoppingList={shoppingList}
                  setShoppingList={setShoppingList}
                  index={index}
                />
                <button
                  className="deleteItemButton"
                  onClick={e => {deleteShoppingItem(index)}}
                >X</button>
              </>}
            </div>).concat(
              <button 
                onClick={addShoppingItem}
                className="addNewButton"
                key="addNewButton"
              >Add new</button>
            )
        }
      </ReactSortable>
  }

  return bottomSection;
}

export default ShoppingList;