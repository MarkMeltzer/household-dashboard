import SearchableInput from "./SearchableInput";
import ShoppingItemInput from "./ShoppingItemInput";
import useFetch from "./hooks/useFetch";
import config from "./config.json";
import "./css/PlaygroundPage.css"
import { useState } from "react";
import globalContext from "./globalContext";
import { ReactSortable } from "react-sortablejs";

const TestCompontent = ({ text }) => {
  return <>
    <hr />
    <div className="handle" style={{backgroundColor: "rgb(255,0,0)", width: "50px", height: "50px"}}></div>
    <div style={{padding: "5px"}}>
      Text: {text && text}
    </div>
    <hr />
  </>
}

const PlaygroundPage = () => {
  const items = [
    { id: 1, name: "item1", word: "hello" },
    { id: 2, name: "item2", word: "world" },
    { id: 3, name: "item3", word: "mr" },
    { id: 4, name: "item4", word: "robot" },
  ]
  const [list, setList] = useState(items)

  return <div className="playground whitetext">
    <br />
    <br />
    <ReactSortable list={list} setList={setList} handle=".handle" animation={150}>
      {
        list.map(item => (
          <div key={item.id}>
            <TestCompontent text={item.word}/>
          </div>
        ))
      }
    </ReactSortable>
    <br />
    <br />
    <pre>
      {JSON.stringify(list, null, 2)}
    </pre>
  </div>
}

export default PlaygroundPage;