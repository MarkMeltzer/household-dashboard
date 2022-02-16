import CreatableSelect from 'react-select/creatable';
import useFetch from "./hooks/useFetch";
import config from "./config.json";
import { useState, useEffect, useContext } from "react";
import globalContext from './globalContext';
import { updateObject, updateArray } from './utils';

/**
 * Dropdown for slecting and creating shopping items
 * 
 * @param shoppingItems useFetch result object containing a dict of all
 * shoppingItems with the form { id: { name, location, etc }, ... }
 * @param shoppingList useState data result containing an array of the
 * shoppingList part of a weekList in the form [{ id, checked }, ...]
 * @param setShoppingList useState data set function to set the shoppingList
 * @param index index of the shoppingItem in the shoppingList this input represents
*/
const ShoppingItemInput = ({ shoppingItems, shoppingList, setShoppingList, index }) => {
  const context = useContext(globalContext);
  const [createdItem, setCreatedItem] = useState("");
  const [selectedItem, setSelectedItem] = useState(shoppingList[index].id);
  
  // select option from dropdown
  useEffect(() => {
    if (selectedItem == "") {
      return;
    }

    setShoppingList(
      updateArray(
        shoppingList,
        index,
        { id: selectedItem, checked: false }
      )
    )
  }, [selectedItem])

  // create new option from dropdown
  useEffect(() => {
    if (createdItem == "") {
      return;
    }

    // add new item to the DB
    fetch(
      config.DATA_SERVER_URL + "/shoppingItems",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + context["token"]
        },
        body: JSON.stringify({
          name: createdItem
        })
      }
    ).then(res => { return res.json(); }
    ).then(json => {
      // add to list of all shopping items
      shoppingItems.setData(updateObject(
        shoppingItems.data,
        json.id,
        { name: createdItem }
      ))
    })
  }, [createdItem])
  
  // when the shoppingList updates (for ex. when order of items changes) the
  // selected item should also needs to be updated to reflect the new shoppingList
  useEffect(() => {
    setSelectedItem(shoppingList[index].id);
  }, [shoppingList])

  function filterShoppingItems() {
    if (!shoppingItems.data) {
      return []
    } else {
      return Object.entries(shoppingItems.data).map((item) => {
        // item = [id, { name, location, etc... }]
        return { value: item[0], label: item[1].name }
      })
    }
  }

  function handleSelection(event) {
    if (event) {
      setSelectedItem(event.value);
    } else {
      setSelectedItem("");
    }
  }

  function handleCreation(value) {
    setCreatedItem(value);
  }

  return <div>
    {/* <div>Created item: {createdItem}</div>
    <div>Selected item: {selectedItem} 
    <br />
    Which means: {shoppingItems.data && JSON.stringify(shoppingItems.data[selectedItem])}</div> */}
    <CreatableSelect
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
      options={filterShoppingItems()}
      isLoading={shoppingItems.isLoading}
      onChange={handleSelection}
      onCreateOption={handleCreation}
      value={
        shoppingItems.data && 
        selectedItem &&
        { value: selectedItem, label: shoppingItems.data[selectedItem]?.name }
      }
    ></CreatableSelect>
    {/* <div>ShoppingList: {JSON.stringify(shoppingList, null, 4)}</div> */}
  </div>
}

export default ShoppingItemInput;