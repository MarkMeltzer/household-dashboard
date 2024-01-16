import { useState, useEffect, useContext } from 'react';
import { useHistory} from 'react-router-dom';
import useGetWeekList from '../../hooks/useGetWeekList';
import useUpdateWeekList from '../../hooks/useUpdateWeekList';
import useCreateWeekList from '../../hooks/useCreateWeekList';
import useGetShoppingItems from '../../hooks/useGetShoppingItems';
import MealList from './MealList';
import ShoppingList from './ShoppingList';
import '../../css/components/WeekList.css';
import { updateObject } from '../../utils';
import useGetSettings from '../../hooks/useGetSettings';
import { weekListShopOrder as shopOrder } from '../../consts';

const WeekList = (props) => {
  const hist = useHistory();
  const newWeekList = !props.weekListId && props.startingDate;
  
  /*=======================================================================
  ================================= State =================================
  =========================================================================*/
  const getWeekList = useGetWeekList(props.weekListId);
  const updateWeekList = useUpdateWeekList(props.weekListId);
  const createWeekList = useCreateWeekList(props.weekListId);
  const { data: settings, ...getSettings } = useGetSettings();

  // initialize mealList
  let initialMeals = [];
  let initialDates = [];
  if (newWeekList) {
    // if this is a new week being created, create empty meal- and dateLists
    initialMeals = [...Array(7)].map(_ => { return { meal: "" } });

    initialDates = [...Array(7)].map((_, index) => {
      const newDate = new Date(props.startingDate);
      newDate.setDate(newDate.getDate() + index);
      return newDate.toDateString()
    });
  }
  const [meals, setMeals] = useState(initialMeals);
  const [mealDates, setMealDates] = useState(initialDates);

  // initialize shoppingList
  const [shoppingList, setShoppingList] = useState([]);
  
  // initalize shoppingItems list
  const shoppingItems = useGetShoppingItems();

  const [isEditing, setIsEditing] = useState(props.isEditing);

  useEffect(() => {
    // request weekList data when component mounts
    if (!newWeekList && !getWeekList.isLoading && !getWeekList.data) {
      getWeekList.sendRequest();
    }

    // set local data once it arrives
    if (!newWeekList && !getWeekList.error && getWeekList.data) {
      // split mealObjects so we can reorder meals (and their attributes) independently of dates
      const mealData = getWeekList.data['meals']

      setMeals(mealData.map(mealObj => {
        const { date, ...meal } = mealObj;
        return meal;
      }))
      setMealDates(mealData.map(mealObj => mealObj.date))

      setShoppingList(getWeekList.data["shoppingList"])
    }

    // Get the shoppingItems data
    shoppingItems.sendRequest();

    // get user settings
    getSettings.sendRequest()
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
    mealDates={mealDates}
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

  function sortShoppingList(shoppingList) {
    const sortedShoppingList = [...shoppingList].sort(
      (a, b) => {
        // first order by shop
        const aShop = shoppingItems.data[a.id].shop
        const bShop = shoppingItems.data[b.id].shop
        if (shopOrder[aShop] < shopOrder[bShop]) {
          return -1;
        } else if (shopOrder[bShop] < shopOrder[aShop]) {
          return 1;
        }

        // then order by order from user settings
        const aIndex = settings.shopOrder[aShop].indexOf(shoppingItems.data[a.id].location)
        const bIndex = settings.shopOrder[bShop].indexOf(shoppingItems.data[b.id].location)
        if (aIndex < bIndex) {
          return -1;
        } else if (bIndex < aIndex) {
          return 1;
        } else {
          return 0;
        }
      }
    )

    return sortedShoppingList
  }

  function clickEditButton() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsEditing(false);

    // sort the shopping list
    let filteredShoppingList = shoppingList.filter(item => item.id != "newItem")
    if (settings.sortOnSubmit) {
      filteredShoppingList = sortShoppingList(filteredShoppingList)
      setShoppingList(filteredShoppingList)
    }

    // reassemble mealList
    meals.forEach((meal, index) => {
      meal.date = mealDates[index];
    });

    // collect the data to send back to the server
    const objToSend = {
      "meals" : meals,
      "shoppingList": filteredShoppingList
    }

    if (!newWeekList) {
      // weekList record already exists, update it with new data
      objToSend["creationDate"] = getWeekList.data["creationDate"];

      updateWeekList.sendRequest(
        JSON.stringify(objToSend),
        () => {},
        (err) => {
          alert("Error submitting list: \n" + err);
        }
      )
    } else {
      // new weekList record needs to be created
      createWeekList.sendRequest(
        JSON.stringify(objToSend),
        (res) => hist.push(`/week/${res["id"]}`),
        (err) => {
          alert("Error submitting list: \n" + err);
        }
      )
    }
  }

  function clickSortButton() {
    const filteredShoppingList = shoppingList.filter(item => item.id != "newItem")
    const sortedShoppingList = sortShoppingList(filteredShoppingList)
    setShoppingList(sortedShoppingList)
  }

  if (getWeekList.error) return <div className="weekList"><p className="error">Error: {getWeekList.error.message}</p></div>
  if (getWeekList.isLoading) return <div className="weekList"><p className="loading">Loading...</p></div>
  return (
    <div className="weekList">
      {title}
      <div className="weekListEditButtonContainer">
        <button 
          className="weekListSortButton"
          onClick={clickSortButton}
          disabled={updateWeekList.isLoading || createWeekList.isLoading}
        >
          Sort (PLACEHOLDER)
        </button>
        <button 
          className="weekListEditButton"
          onClick={clickEditButton}
          disabled={updateWeekList.isLoading || createWeekList.isLoading}
        >
          {(() => {
            if (updateWeekList.isLoading || createWeekList.isLoading) {
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