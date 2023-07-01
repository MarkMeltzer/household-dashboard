import config from "../config.json"
import usePost from "./usePost";

/**
 * Uses the household-dashboard API to create a new shoppingItem
 * 
 * @returns {import("./usePost").Result}
 */
const useGetLoginToken = () => {
  const result = usePost(
    config.DATA_SERVER_URL + "/getLoginToken"
  );
  
  return result; 
}

export default useGetLoginToken;