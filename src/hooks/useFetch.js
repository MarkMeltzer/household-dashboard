import { useState, useEffect, useContext } from "react";
import globalContext from "../globalContext";


const useFetch = (
  apiEndpoint,
  extraDependencies=[],
  requestOpts={ method: "GET", headers: {} },
  authorize=true
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const context = useContext(globalContext);

  if (requestOpts.headers === undefined) {
    requestOpts.headers = {};
  }

  if (authorize) {
    requestOpts.headers["Authorization"] = "Bearer " + context["token"];
  }

  useEffect(() => {
    // reset defaults for subsequent requests
    setData(null);
    setIsLoading(true);
    setError(null);

    // send request and handle response
    fetch(
      apiEndpoint,
      requestOpts
    ).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error("HTTP error code " + res.status + " " + res.statusText);
        }
      }).then(json => {
        // success
        setIsLoading(false);
        setData(json);
      }).catch(err => {
          // fail
          setIsLoading(false);
          setData(null);
          setError(err)
      })
  }, [apiEndpoint, context, ...extraDependencies]) // eslint-disable-line react-hooks/exhaustive-deps
  
  return { data, setData, isLoading, error }; 
}

export default useFetch;