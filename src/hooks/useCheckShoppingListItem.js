import { useState, useContext } from "react";
import globalContext from "../globalContext";
import config from "../config.json"
import { useEffect } from "react";
import { updateArray } from "../utils";

// This does work very well and will probably be removed soon.

// /**
//  * @typedef {Object} Result
//  * @property {(string|null)[]} data Data returned from API
//  * @property {boolean[]} isLoading whether waiting for response from API
//  * @property {(string|null)[]} error Error message, if there is any
//  * @property {(index:string) => void} sendRequest
//  *            function to initiate request to API
//  */

// /**
//  * Uses the household-dashboard API to check an item in a shoppingList
//  * 
//  * @param {string} weekListId
//  *        ID of the weekList which contains the shoppingList
//  * @param {array} shoppingList
//  *        number of items in the shoppingList
//  * @returns {Result}
//  */
// const useCheckShoppingListItem = (weekListId, shoppingList) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState([]);
//   const [error, setError] = useState([]);

//   const context = useContext(globalContext);

//   useEffect(() => {
//     // shoppingList changed so the state of checkItem API interactions makes no
//     // sense anymore.
//     // TODO: problem: this doesn't work because the shoppingList changes on
//     // each checkItem request in the checkbox callback in ShoppingList.js
//     // possible solution: have each item in view mode also be a component.
//     // This component can then use this hook, so each item gets its own hook
//     // honestly maybe I am over-engineering it at this point and should I stick
//     // to my old solution
//     setData(new Array(shoppingList.length).fill(null));
//     setIsLoading(new Array(shoppingList.length).fill(false));
//     setError(new Array(shoppingList.length).fill(null));
//   }, [shoppingList])

//   const sendRequest = (index, checked) => {
//     // reset defaults for subsequent requests
//     setIsLoading(updateArray(isLoading, index, true));
//     setData(updateArray(data, index, null));
//     setError(updateArray(error, index, null));

//     const apiURL = config.DATA_SERVER_URL +
//       "/weekLists/" + weekListId +
//       "/shoppingList/" + index;

//     const requestOpts = {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + context["token"]
//       },
//       body: JSON.stringify({ checked: checked })
//     }

//     fetch(apiURL, requestOpts)
//     .then(res => {
//       // check HTTP status code
//       if (res.ok) { 
//         // success     
//         setIsLoading(updateArray(isLoading, index, false));
//       } else {
//         throw Error("HTTP error code " + res.status + " " + res.statusText);
//       }
//     }).catch(err => {
//       // fail
//       console.warn(err);
//       setError(updateArray(error, index, err));
//       setIsLoading(updateArray(isLoading, index, false));
//     })
//   }
  
//   return { data, isLoading, error, sendRequest }; 
// }

// export default useCheckShoppingListItem;