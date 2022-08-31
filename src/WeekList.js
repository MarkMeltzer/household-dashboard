import { useState, useEffect, useContext } from 'react';
import './css/WeekList.css';
import { updateObject, updateArray, swapArrayElements, removeItemFromArray } from './utils';
import { useHistory, Link } from 'react-router-dom';
import config from "./config.json"
import globalContext from "./globalContext";
import AsyncCreatableSelect from 'react-select/async-creatable';
import ShoppingItemInput from './ShoppingItemInput';
import useFetch from './hooks/useFetch';
import { ReactSortable } from 'react-sortablejs';


const WeekList = (props) => {
  const hist = useHistory();
  const context = useContext(globalContext);
  
  /*=======================================================================
  ================================= State =================================
  =========================================================================*/
  const days = ["Ma", "Di", "Wo", "Do", "Vrij", "Za", "Zo"];
  const [meals, setMeals] = useState(Object.fromEntries(days.map(day => [day, ""])));

  const [shoppingList, setShoppingList] = useState([]);
  const shoppingItems = useFetch(config.DATA_SERVER_URL + "/shoppingItems");

  const [isEditing, setIsEditing] = useState(props.isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // get the data via a fetch from the parent
  // if no fetch result is passed create dummy data
  const { data, isLoading, error } = props.initialData ? props.initialData : {
    data : null, isLoading : false, error : null
  }

  // set the data once it arrives (and if a fetch result was passed)
  useEffect(() => {
    if (props.initialData && !error && data) {
      setMeals(data["meals"])
      setShoppingList(data["shoppingList"])
    }
  }, [data, error, props.initialData])

  // TODO: move both top and bottom sections into their own components
  // TODO: do useEffect cleanup

  /*=======================================================================
  ============================== Top section ==============================
  =========================================================================*/
  let title;
  if (props.initialData) {
    title = <div className="title">{data ? data["creationDate"] : "Loading..."}</div>
  } else {
    title = <div className="title">New Week List</div>
  }

  const topSection =
    <div className="topSection">{
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

  const bottomSection = 
    <div className="bottomSection" style={bottomStyle}>
      {!shoppingItems.data && <p className='loading'>Loading....</p>}
      
      {
        // Not editing
        shoppingItems.data && !isEditing && shoppingList.map((item, index) => 
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
          </div>)
      }

      {
        // In edit mode
        shoppingItems.data && isEditing && 
        <ReactSortable list={shoppingList} setList={setShoppingList} handle=".dragHandle" animation={150}>
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
                </div>)
            }
        </ReactSortable>
      }

      {/* {shoppingItems.data && !isEditing && shoppingList.map((item, index) => 
        // item = { id, checked, amount }
        <div
          className="shoppingItem"
          key={index}
          style={
            shoppingItems.data[item.id]?.shop ? 
              { backgroundColor: shopColors[shoppingItems.data[item.id].shop]} :
              {}
          }
        >
          {!isEditing &&
          shoppingItems.data[item.id] && <div>
            {item.amount > 1 && item.amount + "x  "}
            <Link to={"/shoppingItem/" + item.id}>{shoppingItems.data[item.id].name}</Link>
          </div>}
          {isEditing && <>
            <div className='dragHandle'>:::</div>
            <ShoppingItemInput 
              shoppingItems={shoppingItems}
              shoppingList={shoppingList}
              setShoppingList={setShoppingList}
              index={index}
            />
            {index > 0 &&
              <button onClick={e => moveShoppingItemUp(index)} >↑</button>}
            {index < shoppingList.length - 1 &&
              <button onClick={e => moveShoppingItemDown(index)}>↓</button>}
            <button
              className="deleteItemButton"
              onClick={e => {deleteShoppingItem(index)}}
            >X</button>
          </>}
        </div>
      )} */}

      {isEditing && shoppingItems.data && 
        <button 
            onClick={addShoppingItem}
            className="addNewButton"
          >Add new</button>}
    </div>

  function addShoppingItem() {
    setShoppingList([...shoppingList, { id: "newItem", checked: false }]);    
  }

  function deleteShoppingItem(index) {
    setShoppingList(removeItemFromArray(shoppingList, index));
  }

  function moveShoppingItemUp(index) {
    setShoppingList(swapArrayElements(shoppingList, index, index-1))
  }

  function moveShoppingItemDown(index) {
    setShoppingList(swapArrayElements(shoppingList, index, index+1))
  }

  function clickEditButton(e) {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // filter and sort the shopping list
    let filteredShoppingList = shoppingList.filter(item => item.id != "newItem");
    filteredShoppingList = [...filteredShoppingList].sort(
      (a, b) => {
        const shopOrder = {"Lidl": 0, "": 1, undefined: 1, "Jumbo": 2, "Albert Heijn": 3}
        
        const aShop = shoppingItems.data[a.id].shop
        const bShop = shoppingItems.data[b.id].shop
        if (shopOrder[aShop] < shopOrder[bShop]) {
          return -1;
        } else if (shopOrder[bShop] < shopOrder[aShop]) {
          return 1;
        } else {
          return 0;
        }
      }
    )
    setShoppingList(filteredShoppingList);

    e.target.disabled = true;
    setIsEditing(false);
    setIsSubmitting(true);

    // collect the data to send back to the server
    const objToSend = {
      "meals" : meals,
      "shoppingList": filteredShoppingList
    }

    let apiURL, requestOpts, onSucces;
    if (props.initialData) {
      // if record already exist, add information so it can be updated
      // by the server
      objToSend["creationDate"] = data["creationDate"]; // TODO: this date should be noted server-side

      apiURL = config.DATA_SERVER_URL + "/weekLists/" + props.weekListId
      requestOpts = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + context["token"]
        },
        body: JSON.stringify(objToSend)
      }
      onSucces = (res) => {
        setIsSubmitting(false);
        e.target.disabled = false;
      };
    } else {
      // if no initialData was passed, this weekList doesn't exist yet so we
      // need to create a new record on the server
      apiURL = config.DATA_SERVER_URL + "/weekLists"
      requestOpts = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + context["token"]
        },
        body: JSON.stringify(objToSend)
      }
      onSucces = (res) => {
        hist.push(`/week/${res["id"]}`)
      };
    }

    // send the request to the server
    fetch(apiURL, requestOpts)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error("HTTP error code " + res.status + " " + res.statusText);
        }
      }).then(json => {
        // success
        onSucces(json)
      }).catch(err => {
          // error
          setIsSubmitting(false);
          e.target.disabled = false;
          alert("Error submitting list: \n" + err)
      })
  }


  if (error) return <div className="weekList"><p className="error">Error: {error.message}</p></div>
  if (isLoading) return <div className="weekList"><p className="loading">Loading...</p></div>
  return (
    <div className="weekList">
      {title}
      <div className="weekListEditButtonContainer">
        <button className="weekListEditButton" onClick={clickEditButton}>
          {(() => {
            if (isSubmitting) {
              return "Submitting..."
            } else if (isEditing) {
              return "Submit!"
            } else {
              return "Edit"
            }
          })()}
        </button>
      </div>
      {topSection}
      {bottomSection}
    </div>
  );
}
 
export default WeekList;