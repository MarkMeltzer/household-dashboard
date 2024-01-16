import React from "react";
import { Link } from "react-router-dom";
import config from "../../config.json";
import { useContext } from "react";
import globalContext from "../../globalContext";
import { updateArray, updateObject } from "../../utils";
import Modal from "../Modal";
import { weekListShopColors as shopColors } from "../../consts";

const ViewModeModal = ({ item, shoppingItems }) => {
  return (
    <div className="shoppingListEditModeModal">
      <p className="shoppingItemName">{shoppingItems.data[item.id].name}</p>
      <p style={{ maxWidth: "30rem" }}>{item.note}</p>
    </div>
  );
};

function ShoppingListViewMode({
  shoppingList,
  setShoppingList,
  shoppingItems,
  weekListId,
  bottomStyle,
}) {
  const context = useContext(globalContext);

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

  return (
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
                  activatorStyle={{ maxWidth: "100%", gridColumn: "-1/-2" }}
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
}

export default ShoppingListViewMode;
