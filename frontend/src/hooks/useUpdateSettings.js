import usePut from "./usePut";
import config from "../config.json"

/**
 * Uses the household-dashboard API to update the current users settings
 * 
 * @returns {import("./usePut").Result}
 */
const useUpdateSettings = () => {
  const result = usePut(config.DATA_SERVER_URL + "/users/me/settings");
  
  return result; 
}

export default useUpdateSettings;