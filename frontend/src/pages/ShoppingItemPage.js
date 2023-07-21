import { useParams } from "react-router";
import { useState, useEffect } from "react";
import useGetShoppingItem from "../hooks/useGetShoppingItem";
import useUpdateShoppingItem from "../hooks/useUpdateShoppingItem";
import { updateObject } from "../utils";
import "../css/pages/ShoppingItemPage.css"

const ShoppingItemPage = () => {
  const { id } = useParams();
  const { data, _, isLoading, error, sendRequest } = useGetShoppingItem(id);
  const [shoppingItem, setShoppingItem] = useState(null);
  const updateShoppingItem = useUpdateShoppingItem(id);

  useEffect(() => {
    // TODO: check if this is necessary and we can't just use the setData from useGetShoppingItem

    // request shoppingItem data when component mounts
    if (!data && !isLoading) {
      sendRequest();
    }

    // data has arrived, lets keep track of it so we can change it later
    if (data && !error) {
      setShoppingItem(data)
    }
  }, [data, error])

  const [isEditing, setIsEditing] = useState(false);
  function handleEditClick(e) {
    if (isEditing) {
      // lets submit the changed shoppingItem data to the server
      updateShoppingItem.sendRequest(
        JSON.stringify(shoppingItem),
        (_) => { setIsEditing(false); },
        (_) => { setIsEditing(false); },
      )
    } else {
      setIsEditing(true);
    }
  }
  
  const dataDisplay = shoppingItem &&
    <div className="shoppingItemDisplay">
      <button 
        className="shoppingItemEditButton"
        onClick={handleEditClick}
        disabled={updateShoppingItem.isLoading}>
        {(() => {
          if (updateShoppingItem.isLoading) {
              return "Submitting..."
            } else if (isEditing) {
              return "Submit!"
            } else {
              return "Edit"
          }
        })()}
      </button>
      <p className="shoppingItemTitle">Shopping Item</p>
      <p className="shoppingItemName">
        {!isEditing && shoppingItem.name}
        {isEditing &&
          <input type="text" 
            value={shoppingItem.name}
            disabled={updateShoppingItem.isLoading}
            onChange={(e)=>(
              setShoppingItem(updateObject(shoppingItem, "name", e.target.value)))}
          />}
      </p>

      <div className="price">
        <span className="priceTitle">Price: </span>
        <span className="priceValue">
          {!isEditing && (shoppingItem.price ? "€ " + shoppingItem.price.toFixed(2) : "Not specified")}
          {isEditing && <input type="number"
            value={shoppingItem.price ? shoppingItem.price : 0.0}
            disabled={updateShoppingItem.isLoading}
            step={0.25}
            onChange={(e)=>(
              setShoppingItem(updateObject(shoppingItem, "price", e.target.valueAsNumber)))}
          />}
        </span>
      </div>

      <div className="location">
        <span className="locationTitle">Location: </span>
        <span className="locationValue">
          {!isEditing && (shoppingItem.location ? shoppingItem.location : "Not specified")}
          {isEditing && <input type="text"
            value={shoppingItem.location ? shoppingItem.location : ""}
            disabled={updateShoppingItem.isLoading}
            onChange={(e)=>(
              setShoppingItem(updateObject(shoppingItem, "location", e.target.value)))}
          />}
        </span>
      </div>

      <div className="shop">
        <span className="shopTitle">Shop: </span>
        <span className="shopValue">
          {!isEditing && (shoppingItem.shop ? shoppingItem.shop : "Not specified")}
          {isEditing && <select name="shops"
            value={shoppingItem.shop ? shoppingItem.shop : ""}
            disabled={updateShoppingItem.isLoading}
            onChange={(e)=>(
              setShoppingItem(updateObject(shoppingItem, "shop", e.target.value)))}
          >
            <option value="Lidl">Lidl</option>
            <option value="Jumbo">Jumbo</option>
            <option value="Albert Heijn">Albert Heijn</option>
            <option value="">None</option>
          </select>}
        </span>
      </div>
    </div>

  return <div className="shoppingItemDisplayContainer">
    {error && <p className="error">Error: {error.message}</p>}
    {!error && isLoading && <p className='loading'>Loading....</p>}
    {!error && !isLoading && dataDisplay}
  </div>
}

export default ShoppingItemPage;