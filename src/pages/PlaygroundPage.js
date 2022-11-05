import { useState } from "react";
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
  const [date, setDate] = useState("");
  const [confirmedDate, setConfirmedDate] = useState(false);

  return <div className="playground whitetext">
    <br />
    <br />
    <pre>
      {JSON.stringify(date, null, 2)}
    </pre>
    {!confirmedDate &&
    <div>
      <label htmlFor="dateInput">Please select the starting date of the week you wish to create a list for:</label>
      <input type="date" name="date" id="dateInput" onChange={e => setDate(e.target.value)}/>
      <button
        disabled={date ? false : true} 
        onClick={e => { setConfirmedDate(true) }}
      >Create Weeklist</button>
    </div>}
    <br />
    <br />
    {date && confirmedDate && <TestCompontent text={date}/>}
  </div>
}

export default PlaygroundPage;