import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import ShoppingItemInput from './ShoppingItemInput';
import { removeItemFromArray, updateArray, updateObject } from '../utils';
import globalContext from '../globalContext';
import config from "../config.json"

const ShoppingList = ({
  isEditing,
  shoppingItems,
  shoppingList,
  setShoppingList,
  weekListId
}) => {
  const context = useContext(globalContext);

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

  function checkItem(index, e) {
    e.target.disabled = true;

    // update local shoppingList
    const newShoppingList = updateArray(
      shoppingList,
      index,
      updateObject(shoppingList[index], "checked", e.target.checked)
    );
    setShoppingList(newShoppingList);

    // update server shoppingList
    const apiURL = config.DATA_SERVER_URL +
      "/weekLists/" + weekListId +
      "/shoppingList/" + index;
    const requestOpts = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + context["token"]
      },
      body: JSON.stringify({ checked: e.target.checked })
    }
    fetch(apiURL, requestOpts)
      .then(res => {
        if (res.ok) {      
          e.target.disabled = false;
        } else {
          throw Error("HTTP error code " + res.status + " " + res.statusText);
        }
      }).catch(err => {
        console.warn(err);
        e.target.disabled = false;
      })
    
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
          className="shoppingItemViewMode"
          key={item.id}
          style={{
            backgroundColor: shoppingItems.data[item.id]?.shop ?
              shopColors[shoppingItems.data[item.id].shop] :
              "rgba(0,0,0,0)"
          }}
        >
          {shoppingItems.data[item.id] && <>
            <input
              type="checkbox"
              id="shoppingListItemCheckbox"
              onClick={e => {checkItem(index, e)}}
              defaultChecked={item.checked}/>
            <div>
              {item.amount > 1 && item.amount + "x  "}
              <Link 
                to={"/shoppingItem/" + item.id}
                style={{
                  textDecorationLine: item.checked ? "line-through" : "revert",
                  color: item.checked ? "#6a6c79" : "revert"
                }}
              >
                {shoppingItems.data[item.id].name}
              </Link>
            </div>
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
              className="shoppingItemEditMode"
              key={item.id}
              style={{
                backgroundColor: shoppingItems.data[item.id]?.shop ?
                  shopColors[shoppingItems.data[item.id].shop] :
                  "rgba(0,0,0,0)"
              }}
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
                disabled={shoppingList.find(item => item.id === "newItem")}
              >Add new</button>
            )
        }
      </ReactSortable>
  }

  return bottomSection;
}

export default ShoppingList;