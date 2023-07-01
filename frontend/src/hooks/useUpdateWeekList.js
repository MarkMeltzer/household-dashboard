import usePut from "./usePut";
import config from "../config.json"

/**
 * Uses the household-dashboard API to update an existing weekList
 * 
 * @param {string} weekListId ID of the weekList
 * @returns {import("./usePut").Result}
 */
const useUpdateWeekList = (weekListId) => {
  const result = usePut(
    config.DATA_SERVER_URL + "/weekLists/" + weekListId
  );
  
  return result; 
}

export default useUpdateWeekList;