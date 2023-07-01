import useGet from "./useGet";
import config from "../config.json"

/**
 * Uses the household-dashboard API to get all weekLists
 * 
 * @returns {import("./useGet").Result}
 */
const useGetWeekLists = () => {
  const result = useGet(config.DATA_SERVER_URL + "/weekLists");

  return result; 
}

export default useGetWeekLists;