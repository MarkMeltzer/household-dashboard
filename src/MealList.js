import { updateObject } from "./utils";

const MealList = ({
  isEditing,
  setMeals,
  meals,
  days
}) => {
  return (
    <div className="topSection">{
      days.map((day) => 
        <div className="dayItem" key={day}>
          {<p className="day">{day}</p>}
    
          {!isEditing && <p className="meal">{meals[day]}</p>}
          {isEditing && <input 
            type="text" 
            value={meals[day]} 
            onChange={(e) => { setMeals(updateObject(meals, day, e.target.value)) }}
          />}
        </div>
    )}</div>)
}

export default MealList;