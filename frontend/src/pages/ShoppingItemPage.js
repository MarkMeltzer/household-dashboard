import { useParams } from "react-router";
import { useState, useEffect } from "react";
import useGetShoppingItem from "../hooks/useGetShoppingItem";
import useUpdateShoppingItem from "../hooks/useUpdateShoppingItem";
import useGetShops from "../hooks/useGetShops";
import { updateObject } from "../utils";
import "../css/pages/ShoppingItemPage.css"

const ShoppingItemPage = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const { data: shoppingItem, setData: setShoppingItem, ...getShoppingItem} = useGetShoppingItem(id)
  const updateShoppingItem = useUpdateShoppingItem(id);
  const { data: shops, ...getShops} = useGetShops()

  useEffect(() => {
    // request shoppingItem data when component mounts
    getShoppingItem.sendRequest()
    getShops.sendRequest()
  }, [])

  function handleEditClick(e) {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    setIsEditing(false)

    updateShoppingItem.sendRequest(JSON.stringify(shoppingItem))
  }

  function setShop(shopId) {
    // Clear location since shop no longer matches
    let newShoppingItem = updateObject(shoppingItem, "location", "")

    setShoppingItem(updateObject(newShoppingItem, "shop", shopId))
  }
  
  const dataDisplay = shoppingItem && shops &&
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

      {shoppingItem.shop && <div className="location">
        <span className="locationTitle">Location: </span>
        <span className="locationValue">
          {!isEditing && (shoppingItem.location ? shops[shoppingItem.shop].locations[shoppingItem.location].name : "Not specified")}
          {isEditing && <select name="location"
            value={shoppingItem.location ? shoppingItem.location : ""}
            disabled={updateShoppingItem.isLoading}
            onChange={(e)=>(
              setShoppingItem(updateObject(shoppingItem, "location", e.target.value)))}
          >
            {Object.entries(shops[shoppingItem.shop].locations).map(location => {
              return <option key={location[0]} value={location[0]}>{location[1].name}</option>
            })}
            <option value="">None</option>
          </select>}
        </span>
      </div>}

      <div className="shop">
        <span className="shopTitle">Shop: </span>
        <span className="shopValue">
          {!isEditing && (shoppingItem.shop ? shops[shoppingItem.shop].name : "Not specified")}
          {isEditing && <select name="shops"
            value={shoppingItem.shop ? shoppingItem.shop : ""}
            disabled={updateShoppingItem.isLoading}
            onChange={(e)=> setShop(e.target.value)}
          >
            {Object.entries(shops).map(shop => {
              return <option key={shop[0]} value={shop[0]}>{shop[1].name}</option>
            })}
            <option value="">None</option>
          </select>}
        </span>
      </div>
    </div>

  // TODO: handle errors from multiple sources more gracefully (eg. shoppingItem AND shops)
  return <div className="shoppingItemDisplayContainer">
    {getShoppingItem.error && <p className="error">Error: {getShoppingItem.error.message}</p>}
    {!getShoppingItem.error && getShoppingItem.isLoading && <p className='loading'>Loading....</p>}
    {!getShoppingItem.error && !getShoppingItem.isLoading && dataDisplay}
  </div>
}

export default ShoppingItemPage;
