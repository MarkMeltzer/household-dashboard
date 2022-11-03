import { useState, useContext } from "react";
import globalContext from "../globalContext";
import config from "../config.json"


const useGetWeekList = (weekListId) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const context = useContext(globalContext);

  const sendRequest = () => {
    // reset defaults for subsequent requests
    setIsLoading(true);
    setData(null);
    setError(null);

    fetch(
      config.DATA_SERVER_URL + `/weekLists/${weekListId}`,
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + context["token"]
        }
      }
    ).then(res => {
      // check HTTP status code
      if (res.ok) {
        return res.json();
      } else {
        throw Error("HTTP error code " + res.status + " " + res.statusText);
      }
    }).then(json => {
      // success
      setData(json);
      setIsLoading(false);
    }).catch(err => {
      // fail
      setData(null);
      setError(err)
      setIsLoading(false);
    })


  }
  
  return { data, isLoading, error, sendRequest }; 
}

export default useGetWeekList;