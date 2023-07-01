import { useState, useContext } from "react";
import globalContext from "../globalContext";

/**
 * @typedef {Object} Result
 * @property {string|null} data Data returned from API
 * @property {function} setData function to modify data property
 * @property {boolean} isLoading whether waiting for response from API
 * @property {string|null} error Error message, if there is any
 * @property {() => void} sendRequest
 *            function to initiate request to API
 */

/**
 * Send a GET request to an API endpoint
 * 
 * @param {string} resourceUrl URL of the resource to get
 * @param {boolean} [authorize=True]
 *        whether to send a token to authorize request
 * @returns {Result}
 */
const useGet = (resourceUrl, authorize=true) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const context = useContext(globalContext);

  const sendRequest = () => {
    // reset defaults for subsequent requests
    setIsLoading(true);
    setData(null);
    setError(null);

    const headers = {}
    if (authorize) {
      headers["Authorization"] = "Bearer " + context["token"];
    }

    fetch(
      resourceUrl,
      { method: "GET", headers: headers }
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
  
  return { data, setData, isLoading, error, sendRequest };
}

export default useGet;