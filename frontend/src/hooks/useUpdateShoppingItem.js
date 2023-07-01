import usePut from "./usePut";
import config from "../config.json"

/**
 * Uses the household-dashboard API to update an existing shoppingItem
 * 
 * @param {string} shoppingItemId ID of the shoppingItem
 * @returns {import("./usePut").Result}
 */
const useUpdateShoppingItem = (shoppingItemId) => {
  const result = usePut(
    config.DATA_SERVER_URL + "/shoppingItems/" + shoppingItemId
  );
  
  return result; 
}

export default useUpdateShoppingItem;