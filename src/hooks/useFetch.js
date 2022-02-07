import { useState, useEffect, useContext } from "react";
import globalContext from "../globalContext";


const useFetch = (
  apiEndpoint,
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
  }, [apiEndpoint, context]) // eslint-disable-line react-hooks/exhaustive-deps
  
  return { data, isLoading, error }; 
}

export default useFetch;