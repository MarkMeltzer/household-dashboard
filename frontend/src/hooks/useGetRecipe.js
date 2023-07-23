import useGet from "./useGet";
import config from "../config.json"

/**
 * Uses the household-dashboard API to get a specific recipe
 * 
 * @param {string} recipeId ID of the recipe
 * @returns {import("./useGet").Result}
 */
const useGetRecipe = (recipeId) => {
  const result = useGet(
    config.DATA_SERVER_URL + "/recipes/" + recipeId
  );

  return result;
}

export default useGetRecipe;