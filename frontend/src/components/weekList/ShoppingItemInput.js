import { useState, useEffect, useContext } from "react";
import { useRef } from "react";
import CreatableSelect from 'react-select/creatable';
import { updateObject, updateArray } from '../../utils';
import '../../css/components/ShoppingItemInput.css';
import useCreateShoppingItem from "../../hooks/useCreateShoppingItem";

/**
 * Dropdown for slecting and creating shopping items
 * 
 * @param shoppingItems useGet result object containing a dict of all
 *        shoppingItems with the form { id: { name, location, etc }, ... }
 * @param shoppingList useState data result containing an array of the
 *        shoppingList part of a weekList in the form [{ id, checked }, ...]
 * @param setShoppingList 
 *        useState data set function to set the shoppingList
 * @param index
 *        index of the shoppingItem in the shoppingList this input represents
*/
const ShoppingItemInput = ({ shoppingItems, shoppingList, setShoppingList, index }) => {
  const ref = useRef(null);
  const createShoppingItem = useCreateShoppingItem();
  const [selectedItem, setSelectedItem] = useState(shoppingList[index].id);

  // select option from dropdown
  useEffect(() => {

    if (selectedItem == "") {
      return;
    }

    if (selectedItem == "newItem") {
      ref.current.focus()
    }

    setShoppingList(
      updateArray(
        shoppingList,
        index,
        { ...shoppingList[index], id: selectedItem }
      )
    )
  }, [selectedItem])

  // when the shoppingList updates (for ex. when order of items changes) the
  // selected item should also needs to be updated to reflect the new shoppingList
  useEffect(() => {
    setSelectedItem(shoppingList[index].id);
  }, [shoppingList])

  function isInShoppingList(itemId) {
    return shoppingList.find(shoppingListItem => 
      shoppingListItem.id === itemId
    );
  }

  function filterShoppingItems() {
    if (!shoppingItems.data) {
      return []
    } else {
      // collect all shoppingItems in the correct format
      return Object.entries(shoppingItems.data).map((item) => {
        // item = [id, { name, location, etc... }]
        const inShoppingList = isInShoppingList(item[0])
        
        var label = item[1].name
        if (inShoppingList) {
          label += " - Already in shopping list"
        }

        return {
          value: item[0],
          label: label,
          isDisabled: inShoppingList
        }
      });
    }
  }

  function changeAmount(e) {
    const value = e.target.value;

    setShoppingList(
      updateArray(
        shoppingList,
        index,
        { ...shoppingList[index], amount: parseInt(value) }
      )
    )
  }

  function handleSelection(event) {
    if (event) {
      setSelectedItem(event.value);
    } else {
      setSelectedItem("");
    }
  }

  function handleCreation(item) {
    if (item == "") {
      return;
    }

    // add new item to the DB
    createShoppingItem.sendRequest(
      JSON.stringify({ name: item }),
      (res) => {
        shoppingItems.setData(updateObject(
          shoppingItems.data,
          res.id,
          { name: item }
        ))

        setSelectedItem(res.id);
      },
      () => {}
    )
  }

  return <div className='ShoppingItemInputContainer'>
    <input type="number"
      id='amount'
      className='shoppingItemInputNumber'
      value={shoppingList[index].amount ? shoppingList[index].amount : 1}
      onChange={changeAmount}
      disabled={createShoppingItem.isLoading}
    />
    <CreatableSelect
      className="react-select-container"
      classNamePrefix="react-select"
      options={filterShoppingItems()}
      isLoading={shoppingItems.isLoading}
      onChange={handleSelection}
      onCreateOption={handleCreation}
      ref={ref}
      isDisabled={createShoppingItem.isLoading}
      value={
        shoppingItems.data && 
        selectedItem &&
        { value: selectedItem, label: shoppingItems.data[selectedItem]?.name }
      }
      openMenuOnFocus={true}
    ></CreatableSelect>
  </div>
}

export default ShoppingItemInput;