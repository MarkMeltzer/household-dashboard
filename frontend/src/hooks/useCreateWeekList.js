import config from "../config.json"
import usePost from "./usePost";

/**
 * Uses the household-dashboard API to create a new weekList
 * 
 * @returns {import("./usePost").Result}
 */
const useCreateWeekList = () => {
  const result = usePost(
    config.DATA_SERVER_URL + "/weekLists"
  );
  
  return result; 
}

export default useCreateWeekList;