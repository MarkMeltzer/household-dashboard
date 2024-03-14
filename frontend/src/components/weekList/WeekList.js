import { useState, useEffect } from 'react';
import { useHistory} from 'react-router-dom';
import useGetWeekList from '../../hooks/useGetWeekList';
import useUpdateWeekList from '../../hooks/useUpdateWeekList';
import useCreateWeekList from '../../hooks/useCreateWeekList';
import useGetShoppingItems from '../../hooks/useGetShoppingItems';
import MealList from './MealList';
import ShoppingList from './ShoppingList';
import '../../css/components/WeekList.css';
import useGetSettings from '../../hooks/useGetSettings';
import useGetShops from '../../hooks/useGetShops';
import { weekListShopOrder, weekListDateTimeFormat } from '../../consts';

export function convertShopLookupTable(lookupTable, shops) {
  // convert lookup table with shop name keys to use shop id keys
  const lookupTableById = {}
  Object.entries(lookupTable).forEach(([shopName, value]) => {
    const matchedShops = Object.entries(shops).filter(([_, shop]) => shop.name === shopName)
    if (matchedShops.length) {
      lookupTableById[matchedShops[0][0]] = value
    } else {
      lookupTableById[shopName] = value
    }
  })

  return lookupTableById
}

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
  const { data: shops, ...getShops } = useGetShops();

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

    // get shop information
    getShops.sendRequest()
  }, [getWeekList.data, getWeekList.error])
  // TODO: do useEffect cleanup

  /*=======================================================================
  ============================== Top section ==============================
  =========================================================================*/
  let title;
  if (!newWeekList) {
    title = <div className="title">{getWeekList.data ? new Date(getWeekList.data["creationDate"]).toLocaleString('en-NL', weekListDateTimeFormat)  : "Loading..."}</div>
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
    shoppingItems={shoppingItems}
    shoppingList={shoppingList}
    setShoppingList={setShoppingList}
    shops={shops}
    manuallySortable={!settings?.sortOnSubmit}
    clickSortButton={() => {
      const filteredShoppingList = filterShoppingList(shoppingList)
      const sortedShoppingList = sortShoppingList(filteredShoppingList)
      setShoppingList(sortedShoppingList)
    }}
    submitWeekList={submitWeekList}
    weekListId={props.weekListId}
    isEditing={isEditing}
  />

  /**
   * Returns a copy of the shoppingList without the empty item
   */
  function filterShoppingList(shoppingList) {
    return shoppingList.filter(item => item.id != "newItem")
  }
  
  /**
   * Returns a sorted copy of the shoppingList
   */
  function sortShoppingList(shoppingList) {
    // since we handle shops by ID but shopOrder lookup table is based on shop name
    // we need to convert the shopOrder to have shop ids as key instead, this is jank
    // but should be fixed once we move the shopOrder to the backend in future
    const shopOrderById = convertShopLookupTable(weekListShopOrder, shops)

    const sortedShoppingList = [...shoppingList].sort(
      (a, b) => {
        // first order by shop
        const aShop = shoppingItems.data[a.id].shop
        const bShop = shoppingItems.data[b.id].shop
        if (shopOrderById[aShop] < shopOrderById[bShop]) {
          return -1;
        } else if (shopOrderById[bShop] < shopOrderById[aShop]) {
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

  function submitWeekList(sort = false) {
    // filter and sort the shopping list
    let filteredShoppingList = filterShoppingList(shoppingList)
    if (sort) {
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

  function clickEditButton() {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    setIsEditing(false);

    submitWeekList(settings.sortOnSubmit)
  }

  if (getWeekList.error) return <div className="weekList"><p className="error">Error: {getWeekList.error.message}</p></div>
  if (getWeekList.isLoading) return <div className="weekList"><p className="loading">Loading...</p></div>
  return (
    <div className="weekList">
      {title}
      <div className="weekListEditButtonContainer">
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