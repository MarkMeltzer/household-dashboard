import { useState } from 'react';
import './css/WeekList.css';
import { updateObject, updateArray, swapArrayElements, removeItemFromArray } from './utils';

const WeekList = (props) => {
  /*=======================================================================
  ================================= State =================================
  =========================================================================*/
  const [meals, setMeals] = useState({
    "Ma" : "Pasta",
    "Di" : "Pizza",
    "Wo" : "Soup",
    "Do" : "Brocolli and something idk",
    "Vrij" : "Some cool meal",
    "Za" : "Wraps",
    "Zo" : "Boboti",
  });
  const [shoppingItems, setShoppingItems] = useState(
    ["bread", 
    "cheese", 
    "3x paprika", 
    "3L milk", 
    "coke", 
    "more bread", 
    "brocolli", 
    "pasta", 
    "avocado", 
    "salami", 
    "toilet paper"]
  );
  
  const [isEditing, setIsEditing] = useState(props.isEditing);

  /*=======================================================================
  ============================== Top section ==============================
  =========================================================================*/
  const days = ["Ma", "Di", "Wo", "Do", "Vrij", "Za", "Zo"];
  const topSection = <div className="topSection">{
    days.map((day) => 
      <div className="dayItem" key={day}>
        {<p className="day">{day}</p>}
  
        {!isEditing && <p className="meal">{meals[day]}</p>}
        {isEditing && <input 
          type="text" 
          value={meals[day]} 
          onChange={(e) => { setMeals(updateObject(meals, day, e.target.value)) }}
        />}
      </div>
  )}</div>
  

  /*=======================================================================
  ============================= Bottom section ============================
  =========================================================================*/   
  // extend the shoppinglist when it gets too big
  const nRows = (Math.floor(shoppingItems.length / 30) + 1) * 10;
  const bottomStyle = {
    gridTemplateRows: `repeat(${nRows}, auto)`
  }

  const bottomSection = <div className="bottomSection" style={bottomStyle}>{
    shoppingItems.map((item, index) => 
      <div className="shoppingItem" key={index}>
        {!isEditing && <p>{item}</p>}
        
        {isEditing && <>
          <input 
            type="text" 
            value={item}
            onChange={e => handleShoppingItemChange(e, index) }
          /> 
          {index > 0 &&
            <button onClick={e => moveShoppingItemUp(index)} >↑</button>}
          {index < shoppingItems.length - 1 &&
            <button onClick={e => moveShoppingItemDown(index)}>↓</button>}
          <button
            className="deleteItemButton"
            onClick={e => {deleteShoppingItem(index)}}
          >X</button>
        </>}
      </div>
    )}
    {isEditing && 
      <button 
          onClick={addShoppingItem}
          className="addNewButton"
        >Add new</button>}
  </div>
  
  function handleShoppingItemChange(e, index) {
    setShoppingItems(updateArray(shoppingItems, index, e.target.value));
  }

  function addShoppingItem() {
    setShoppingItems([...shoppingItems, "New item"]);    
  }

  function deleteShoppingItem(index) {
    setShoppingItems(removeItemFromArray(shoppingItems, index));
  }

  function moveShoppingItemUp(index) {
    setShoppingItems(swapArrayElements(shoppingItems, index, index-1))
  }

  function moveShoppingItemDown(index) {
    setShoppingItems(swapArrayElements(shoppingItems, index, index+1))
  }

  return (
    <div className="weekList">
      <button className="editButton" onClick={() => { setIsEditing(!isEditing); }}>Edit</button>
      {topSection}
      {bottomSection}
    </div>
  );
}
 
export default WeekList;