import { useEffect } from "react";
import { useState, useContext } from "react";
import globalContext from "../globalContext";

/**
 * @typedef {Object} Result
 * @property {string|null} data Data returned from API
 * @property {boolean} isLoading whether waiting for response from API
 * @property {string|null} error Error message, if there is any
 * @property {(body:string, onSucces:successCb, onFail:failCb) => void} sendRequest
 *            function to initiate request to API
 */

/**
 * @callback successCb
 * @param {object} res result in json format
 * @returns void

 * @callback failCb
 * @param {string} err error code and error message
 * @returns void
 */

/**
 * Send a POST request to an API endpoint
 * 
 * @param {string} resourceUrl URL of the resource to get
 * @param {boolean} [authorize=True]
 *        whether to send a token to authorize request
 * @returns {Result}
 */
const usePost = (resourceUrl, authorize=true) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const context = useContext(globalContext);

  const sendRequest = (body, onSucces, onFail) => {
    // reset defaults for subsequent requests
    setIsLoading(true);
    setData(null);
    setError(null);

    const headers = {
      "Content-Type": "application/json"
    }
    if (authorize) {
      headers["Authorization"] = "Bearer " + context["token"];
    }

    fetch(
      resourceUrl,
      {
        method: "POST",
        headers: headers,
        body: body
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
      onSucces(json);
    }).catch(err => {
      // fail
      setData(null);
      setError(err)
      setIsLoading(false);
      onFail(err);
    })
  }
  
  return { data, isLoading, error, sendRequest };
}

export default usePost;