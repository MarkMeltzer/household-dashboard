import { useState, useEffect, useContext } from 'react';
import './css/WeekList.css';
import { updateObject, updateArray, swapArrayElements, removeItemFromArray } from './utils';
import { useHistory, Link } from 'react-router-dom';
import config from "./config.json"
import globalContext from "./globalContext";
import AsyncCreatableSelect from 'react-select/async-creatable';
import ShoppingItemInput from './ShoppingItemInput';
import useFetch from './hooks/useFetch';


const WeekList = (props) => {
  const hist = useHistory();
  const context = useContext(globalContext);
  
  /*=======================================================================
  ================================= State =================================
  =========================================================================*/
  const days = ["Ma", "Di", "Wo", "Do", "Vrij", "Za", "Zo"];
  const [meals, setMeals] = useState(Object.fromEntries(days.map(day => [day, ""])));

  const [shoppingList, setShoppingList] = useState([]);
  const shoppingItems = useFetch(config.DATA_SERVER_URL + "/shoppingItems/all");

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

  const bottomSection = 
    <div className="bottomSection" style={bottomStyle}>
      {!shoppingItems.data && <p className='loading'>Loading....</p>}

      {shoppingItems.data && shoppingList.map((item, index) => 
        // item = { id, checked, amount }
        <div className="shoppingItem" key={index}>
          {!isEditing &&
          shoppingItems.data[item.id] && <div>
            {item.amount > 1 && item.amount + "x  "}
            <Link to={"/shoppingItem/" + item.id}>{shoppingItems.data[item.id].name}</Link>
          </div>}
          
          {isEditing && <>
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
      )}

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

    // filter out the empty new items
    const filteredShoppingList = shoppingList.filter(item => item.id != "newItem");
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
      objToSend["id"] = props.weekListId;
      objToSend["creationDate"] = data["creationDate"];

      apiURL = config.DATA_SERVER_URL + "/weekLists"
      requestOpts = {
        method: "POST",
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
      <div className="editButtonContainer">
        <button className="editButton" onClick={clickEditButton}>
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