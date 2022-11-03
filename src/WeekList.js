import { useState, useEffect, useContext } from 'react';
import { useHistory} from 'react-router-dom';
import config from "./config.json"
import globalContext from "./globalContext";
import useFetch from './hooks/useFetch';
import useGetWeekList from './hooks/useGetWeekList';
import MealList from './MealList';
import ShoppingList from './ShoppingList';
import './css/WeekList.css';

const WeekList = (props) => {
  const hist = useHistory();
  const context = useContext(globalContext);
  const newWeekList = !props.weekListId && props.startingDate;
  
  /*=======================================================================
  ================================= State =================================
  =========================================================================*/
  const getWeekList = useGetWeekList(props.weekListId);

  // initialize mealList
  let initialMeals = [];
  if (newWeekList) {
    // if this is a new week being created, create an empty mealList
    initialMeals = [ {}, {}, {}, {}, {}, {}, {} ].map((_, index) => {
      const newDate = new Date(props.startingDate);
      newDate.setDate(newDate.getDate() + index);
      return  { date: newDate.toDateString(), meal: ""};
    })
  }
  const [meals, setMeals] = useState(initialMeals);

  // initialize shoppingList
  const [shoppingList, setShoppingList] = useState([]);
  
  // initalize shoppingItems list
  const shoppingItems = useFetch(config.DATA_SERVER_URL + "/shoppingItems");

  const [isEditing, setIsEditing] = useState(props.isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // request weekList data when component mounts
    if (!newWeekList && !getWeekList.isLoading && !getWeekList.data) {
      getWeekList.sendRequest();
    }

    // set local data once it arrives
    if (!newWeekList && !getWeekList.error && getWeekList.data) {
      setMeals(getWeekList.data["meals"])
      setShoppingList(getWeekList.data["shoppingList"])
    }
  }, [getWeekList.data, getWeekList.error])
  // TODO: do useEffect cleanup

  /*=======================================================================
  ============================== Top section ==============================
  =========================================================================*/
  let title;
  if (!newWeekList) {
    title = <div className="title">{getWeekList.data ? getWeekList.data["creationDate"] : "Loading..."}</div>
  } else {
    title = <div className="title">New Week List</div>
  }

  const topSection = <MealList
    isEditing={isEditing}
    setMeals={setMeals}
    meals={meals}
  />
  
  /*=======================================================================
  ============================= Bottom section ============================
  =========================================================================*/   
  const bottomSection = <ShoppingList 
    isEditing={isEditing}
    shoppingItems={shoppingItems}
    shoppingList={shoppingList}
    setShoppingList={setShoppingList}
    weekListId={props.weekListId}
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
    if (!newWeekList) {
      // weekList record already exists, update it with new data
      objToSend["creationDate"] = getWeekList.data["creationDate"]; // TODO: this date should be noted server-side

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
      // new weekList record needs to be created
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

  if (getWeekList.error) return <div className="weekList"><p className="error">Error: {getWeekList.error.message}</p></div>
  if (getWeekList.isLoading) return <div className="weekList"><p className="loading">Loading...</p></div>
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