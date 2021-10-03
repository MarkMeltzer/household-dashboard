import { useState, useEffect, useContext } from "react";
import globalContext from "../globalContext";


const useFetch = (apiEndpoint) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const context = useContext(globalContext);


  // TODO: fix error handling, cant parse json if error thus useless json error
  // the onsucces and onerror should be on the first promise, the second promise
  // only for the parseJSON which I don't care about catching errors on
  useEffect(() => {
    // send GET request and handle response
    fetch(apiEndpoint, { headers: { "Authorization": "Bearer " + context["token"]}})
      .then(res => res.json())
      .then(res => {
        setIsLoading(false);
        setData(res);
      },
      err => {
        setIsLoading(false);
        setData(null);
        setError(err);
    })
  }, [apiEndpoint, context])

  return { data, isLoading, error }; 
}

export default useFetch;