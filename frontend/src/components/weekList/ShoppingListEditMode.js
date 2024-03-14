import { React, useContext, useEffect } from "react";
import Modal from "../Modal";
import { removeItemFromArray, updateArray, updateObject } from "../../utils";
import { ReactSortable } from "react-sortablejs";
import ShoppingItemInput from "./ShoppingItemInput";
import { weekListShopColors } from "../../consts";
import { convertShopLookupTable } from "./WeekList";

const EditModeModal = ({ item, index, shoppingList, setShoppingList, shoppingItems }) => {
  function deleteShoppingItem(index) {
    setShoppingList(removeItemFromArray(shoppingList, index));
  }

  return (
    <div className="shoppingListEditModeModal">
      <p className="shoppingItemName">
        {item.id === "newItem" ? "New Item" : shoppingItems.data[item.id].name}
      </p>
      <button
        className="shoppingListItemDeleteButton"
        onClick={(e) => {
          deleteShoppingItem(index);
        }}
      >
        Delete item from list
      </button>
      <textarea
        value={item.note}
        placeholder="Type note here"
        style={{ resize: "none" }}
        onChange={(e) => {
          setShoppingList(
            updateArray(
              shoppingList,
              index,
              updateObject(shoppingList[index], "note", e.target.value)
            )
          );
        }}
        rows="10"
        cols="25"
      ></textarea>
    </div>
  );
};

function ShoppingListEditMode({
  shoppingList,
  setShoppingList,
  shoppingItems,
  shops,
  shoppingListStyle,
  manuallySortable,
}) {
  function addShoppingItem() {
    setShoppingList([...shoppingList, { id: "newItem", checked: false, note: "" }]);
  }

  const shopColors = shops ? convertShopLookupTable(weekListShopColors, shops) : {}

  return (
    <ReactSortable
      list={shoppingList}
      setList={setShoppingList}
      handle=".dragHandle"
      animation={150}
      style={shoppingListStyle}
      filter=".addNewButton"
      sort={manuallySortable}
      className="shoppingList"
    >
      {shoppingList
        .map((item, index) => (
          // item = { id, checked, amount }
          <div
            className="shoppingItemEditMode"
            key={item.id}
            style={{
              backgroundColor: shoppingItems.data[item.id]?.shop
                ? shopColors[shoppingItems.data[item.id].shop]
                : "rgba(0,0,0,0)",
            }}
          >
            {
              <>
                <div className="dragHandleContainer" style={{width: manuallySortable ? 'auto' : '0px'}}>
                  <div className="dragHandle"></div>
                </div>
                <ShoppingItemInput
                  shoppingItems={shoppingItems}
                  shoppingList={shoppingList}
                  setShoppingList={setShoppingList}
                  index={index}
                />
                <Modal activator={<button className="shoppingListItemMenuButton">...</button>}>
                  <EditModeModal
                    item={item}
                    index={index}
                    shoppingList={shoppingList}
                    setShoppingList={setShoppingList}
                    shoppingItems={shoppingItems}
                  />
                </Modal>
              </>
            }
          </div>
        ))
        .concat(
          <button
            onClick={addShoppingItem}
            className="addNewButton"
            key="addNewButton"
            disabled={shoppingList.find((item) => item.id === "newItem")}
          >
            Add new
          </button>
        )}
    </ReactSortable>
  );
}

export default ShoppingListEditMode;
