import { useState, useEffect, useContext } from "react";
import globalContext from "../globalContext";


const useFetch = (apiEndpoint) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const context = useContext(globalContext);

  useEffect(() => {
    // send GET request and handle response
    fetch(apiEndpoint, { headers: { "Authorization": "Bearer " + context["token"]}})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error("HTTP error code " + res.status + " " + res.statusText);
        }
      })
      .then(json => {
        setIsLoading(false);
        setData(json);
      }).catch(err => {
          setIsLoading(false);
          setData(null);
          setError(err)
        })
  }, [apiEndpoint, context])

  return { data, isLoading, error }; 
}

export default useFetch;