import useGet from "./useGet";
import config from "../config.json"

/**
 * Uses the household-dashboard API to check an item in a shoppingList
 * 
 * @param {string} shoppingItemId ID of the shoppingItem
 * @returns {import("./useGet").Result}
 */
const useGetShoppingItem = (shoppingItemId) => {
  const result = useGet(
    config.DATA_SERVER_URL + "/shoppingItems/" + shoppingItemId
  );

  return result; 
}

export default useGetShoppingItem;