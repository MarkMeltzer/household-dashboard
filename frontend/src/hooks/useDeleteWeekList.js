import useDelete from "./useDelete";
import config from "../config.json"


/**
 * Uses the household-dashboard API to delete a specific weekList
 * 
 * @param {string} weekListId ID of the weekList
 * @returns {import("./useDelete").Result}
 */
const useDeleteWeekList = (weekListId) => {
  const result = useDelete(config.DATA_SERVER_URL + `/weekLists/${weekListId}`);

  return result; 
}

export default useDeleteWeekList;