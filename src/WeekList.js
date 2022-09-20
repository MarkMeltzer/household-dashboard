import { useState, useEffect, useContext } from 'react';
import './css/WeekList.css';
import { useHistory} from 'react-router-dom';
import config from "./config.json"
import globalContext from "./globalContext";
import useFetch from './hooks/useFetch';
import MealList from './MealList';
import ShoppingList from './ShoppingList';

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

  const topSection = <MealList
    isEditing={isEditing}
    setMeals={setMeals}
    meals={meals}
    days={days}
  />
  
  /*=======================================================================
  ============================= Bottom section ============================
  =========================================================================*/   
  const bottomSection = <ShoppingList 
    isEditing={isEditing}
    shoppingItems={shoppingItems}
    shoppingList={shoppingList}
    setShoppingList={setShoppingList}
  />

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