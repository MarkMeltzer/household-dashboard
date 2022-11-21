import { useState } from "react";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";
import "../css/pages/PlaygroundPage.css"

const TestCompontent = ({ text }) => {
  console.log("RENDERED!")
  return <>
    <hr />
    <div style={{padding: "5px"}}>
      Text: {text && text}
    </div>
    <hr />
  </>
}

const PlaygroundPage = () => {
  const tempObj = {}

  return <div className="playground whitetext">
    <br />
    <br />
    <pre>
      {JSON.stringify(tempObj, null, 2)}
    </pre>
    <br />
    <br />
    <ConfirmDeleteButton deleteFunc={() => console.log("DELETED!")}/>
    <br />
    <br />
  </div>
}

export default PlaygroundPage;