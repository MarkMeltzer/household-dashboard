import { useState, useContext } from "react";
import globalContext from "../globalContext";

/**
 * @typedef {Object} Result
 * @property {boolean} isLoading whether waiting for response from API
 * @property {string|null} error Error message, if there is any
 * @property {() => void} sendRequest
 *            function to initiate request to API
 */

/**
 * Send a DELETE request to an API endpoint
 * 
 * @param {string} resourceUrl URL of the resource to delete
 * @param {boolean} [authorize=True]
 *        whether to send a token to authorize request
 * @returns {Result}
 */
const useDelete = (resourceUrl, authorize=true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const context = useContext(globalContext);

  const sendRequest = (onSucces = () => {}, onFail = () => {}) => {
    // reset defaults for subsequent requests
    setIsLoading(true);
    setError(null);

    const headers = {}
    if (authorize) {
      headers["Authorization"] = "Bearer " + context["token"];
    }

    fetch(
      resourceUrl,
      { method: "DELETE", headers: headers }
    ).then(res => {
      // check HTTP status code
      if (res.ok) {
        // success
        setIsLoading(false);
        onSucces();
      } else {
        throw Error("HTTP error code " + res.status + " " + res.statusText);
      }
    }).catch(err => {
      // fail
      setError(err)
      setIsLoading(false);
      onFail(err);
    })
  }
  
  return { isLoading, error, sendRequest };
}

export default useDelete;