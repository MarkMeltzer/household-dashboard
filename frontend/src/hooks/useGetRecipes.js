import useGet from "./useGet";
import config from "../config.json"

/**
 * Uses the household-dashboard API to get all recipes
 * 
 * @returns {import("./useGet").Result}
 */
const useGetRecipes = () => {
  const result = useGet(config.DATA_SERVER_URL + "/recipes");

  return result; 
}

export default useGetRecipes;