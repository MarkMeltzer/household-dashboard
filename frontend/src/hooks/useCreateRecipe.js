import config from "../config.json"
import usePost from "./usePost";

/**
 * Uses the household-dashboard API to create a new recipe
 * 
 * @returns {import("./usePost").Result}
 */
const useCreateRecipe = () => {
  const result = usePost(
    config.DATA_SERVER_URL + "/recipes"
  );
  
  return result; 
}

export default useCreateRecipe;