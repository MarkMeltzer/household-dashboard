import useGet from "./useGet";
import config from "../config.json"


/**
 * Uses the household-dashboard API to check an item in a shoppingList
 * 
 * @param {string} weekListId ID of the weekList
 * @returns {import("./useGet").Result}
 */
const useGetWeekList = (weekListId) => {
  const result = useGet(config.DATA_SERVER_URL + `/weekLists/${weekListId}`);

  return result; 
}

export default useGetWeekList;