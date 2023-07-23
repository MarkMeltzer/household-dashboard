import usePut from "./usePut";
import config from "../config.json"

/**
 * Uses the household-dashboard API to update an existing recipe
 * 
 * @param {string} recipeId ID of the shoppingItem
 * @returns {import("./usePut").Result}
 */
const useUpdateRecipe = (recipeId) => {
  const result = usePut(
    config.DATA_SERVER_URL + "/recipes/" + recipeId
  );
  
  return result; 
}

export default useUpdateRecipe;