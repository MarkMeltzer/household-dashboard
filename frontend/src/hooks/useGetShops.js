import useGet from "./useGet";
import config from "../config.json"

/**
 * Uses the household-dashboard API to get all shops
 * 
 * @returns {import("./useGet").Result}
 */
const useGetShops = () => {
  const result = useGet(config.DATA_SERVER_URL + "/shops");

  return result; 
}

export default useGetShops;
