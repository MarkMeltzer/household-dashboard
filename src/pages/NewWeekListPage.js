import { useState } from "react";
import WeekList from "../components/WeekList";
import "../css/pages/NewWeekListPage.css";

const NewWeekListPage = () => {
  const [date, setDate] = useState("");
  const [confirmedDate, setConfirmedDate] = useState(false);

  return <div className="weekListPage">
    {!confirmedDate &&
    <div className="dateInput">
      <label htmlFor="dateInput" className="dateInputLabel">Please select the starting date of the week you wish to create a list for:</label>
      <input type="date" name="date" id="dateInput" className="dateInputInput" onChange={e => setDate(e.target.value)}/>
      <button
        className="createWeekListButton"
        disabled={date ? false : true} 
        onClick={e => { setConfirmedDate(true) }}
      >Create Weeklist</button>
    </div>}
    {date && confirmedDate && <WeekList 
      isEditing={true}
      startingDate={date}
    />}
  </div>
}

export default NewWeekListPage;