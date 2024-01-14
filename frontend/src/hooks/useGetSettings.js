import useGet from "./useGet";
import config from "../config.json"

/**
 * Uses the household-dashboard API to get all settings for the current user
 * 
 * @returns {import("./useGet").Result}
 */
const useGetSettings = () => {
  const result = useGet(config.DATA_SERVER_URL + "/users/me/settings");

  return result; 
}

export default useGetSettings;
