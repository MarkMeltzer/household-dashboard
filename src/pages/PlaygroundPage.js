import { useState } from "react";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";
import Modal from "../components/Modal";
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
    <Modal activator={<button>Open Modal</button>}>
      <p>This is a child This is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a childThis is a child</p>
      <input placeholder="Some input"></input>
    </Modal>
    <button>test2</button>
    <br />
    <br />
    <pre>
      {JSON.stringify(tempObj, null, 2)}
    </pre>
    <br />
    <br />
  </div>
}

export default PlaygroundPage;