import SearchableInput from "./SearchableInput";
import ShoppingItemInput from "./ShoppingItemInput";
import useFetch from "./hooks/useFetch";
import config from "./config.json";
import "./css/PlaygroundPage.css"
import { useState } from "react";
import globalContext from "./globalContext";

const PlaygroundPage = () => {
  const testStr = "this is a cool string";
  const dateArray = [
    "Friday 4 Feb 2022 - 18:13",
    "Wednesday 29 Sep 2021 - 12:13",
    "Sunday  3 Oct 2021 - 13:13",
    "Thursday 3 Feb 2022 - 22:00",
    "Friday 4 Feb 2022 - 18:10",
    "Friday 4 Feb 2022 - 18:15",
    "Friday 4 Feb 2022 - 18:00",
  ]

  const sortedDateArray = [...dateArray].sort((a, b) => new Date(a) - new Date(b)).reverse();
  


  return <div className="playground" className="whitetext">
    <br />
    <br />
    <br />
    {dateArray.map(item => {
      return <div key={item}>{
        item
      }</div>
    })}
    <br />
    Sorted:
    <br />
    {sortedDateArray.map(item => {
      return <div key={item}>{
        item
      }</div>
    })}
    <br />
  </div>
}

export default PlaygroundPage;