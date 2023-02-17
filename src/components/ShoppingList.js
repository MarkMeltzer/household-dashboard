import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import ShoppingItemInput from "./ShoppingItemInput";
import { removeItemFromArray, updateArray, updateObject } from "../utils";
import globalContext from "../globalContext";
import config from "../config.json";
import Modal from "./Modal";

const ViewModeModal = ({ item, shoppingItems }) => {
  return (
    <div className="shoppingListEditModeModal">
      <p className="shoppingItemName">{shoppingItems.data[item.id].name}</p>
      <p style={{ maxWidth: "30rem" }}>{item.note}</p>
    </div>
  );
};

const EditModeModal = ({ item, index, shoppingList, setShoppingList, shoppingItems }) => {
  function deleteShoppingItem(index) {
    setShoppingList(removeItemFromArray(shoppingList, index));
  }

  return (
    <div className="shoppingListEditModeModal">
      <p className="shoppingItemName">{shoppingItems.data[item.id].name}</p>
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

const ShoppingList = ({ isEditing, shoppingItems, shoppingList, setShoppingList, weekListId }) => {
  const context = useContext(globalContext);

  // extend the shoppinglist when it gets too big
  const nMaxItems = window.innerWidth < 1000 ? 20 : 30;
  const nRows = (Math.floor(shoppingList.length / nMaxItems) + 1) * 10;
  const bottomStyle = {
    gridTemplateRows: `repeat(${nRows}, auto)`,
  };

  const shopColors = {
    Lidl: "rgba(0, 79, 170, 0.178)",
    Jumbo: "rgba(238, 184, 23, 0.37)",
    "Albert Heijn": "rgba(0, 173, 230, 0.253)",
  };

  function addShoppingItem() {
    setShoppingList([...shoppingList, { id: "newItem", checked: false, note: "" }]);
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
    const apiURL = config.DATA_SERVER_URL + "/weekLists/" + weekListId + "/shoppingList/" + index;
    const requestOpts = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + context["token"],
      },
      body: JSON.stringify({ checked: e.target.checked }),
    };
    fetch(apiURL, requestOpts)
      .then((res) => {
        if (res.ok) {
          e.target.disabled = false;
        } else {
          throw Error("HTTP error code " + res.status + " " + res.statusText);
        }
      })
      .catch((err) => {
        console.warn(err);
        e.target.disabled = false;
      });
  }

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
    bottomSection = (
      <div className="bottomSection" style={bottomStyle}>
        {shoppingList.map((item, index) => (
          // item = { id, checked, amount }
          <div
            className="shoppingItemViewMode"
            key={item.id}
            style={{
              backgroundColor: shoppingItems.data[item.id]?.shop
                ? shopColors[shoppingItems.data[item.id].shop]
                : "rgba(0,0,0,0)",
            }}
          >
            {shoppingItems.data[item.id] && (
              <>
                <input
                  type="checkbox"
                  onClick={(e) => {
                    checkItem(index, e);
                  }}
                  defaultChecked={item.checked}
                />
                {item.amount > 1 && item.amount + "x"}
                <Link
                  to={"/shoppingItem/" + item.id}
                  style={{
                    textDecorationLine: item.checked ? "line-through" : "revert",
                    color: item.checked ? "#6a6c79" : "revert",
                  }}
                >
                  {shoppingItems.data[item.id].name}
                </Link>
                {item.note && (
                  <Modal
                    activator={
                      <div
                        className="shoppingListItemInlineNote"
                        style={{ textDecorationLine: item.checked ? "line-through" : "revert" }}
                      >
                        {item.note}
                      </div>
                    }
                    activatorStyle={{ maxWidth: "100%" }}
                  >
                    <ViewModeModal item={item} shoppingItems={shoppingItems} />
                  </Modal>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  } else if (shoppingItems.data && isEditing) {
    // Edit mode
    bottomSection = (
      <ReactSortable
        list={shoppingList}
        setList={setShoppingList}
        handle=".dragHandle"
        animation={150}
        className="bottomSection"
        style={bottomStyle}
        filter=".addNewButton"
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
                  <div className="dragHandleContainer">
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

  return bottomSection;
};

export default ShoppingList;
