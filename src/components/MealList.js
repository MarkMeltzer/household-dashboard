import { useRef } from "react";
import { updateArray, updateObject } from "../utils";

const MealList = ({
  isEditing,
  setMeals,
  meals
}) => {
  const inputEl = useRef(null);

  const dayLabelMap = {
    0 : "Zo",
    1 : "Ma",
    2 : "Di",
    3 : "Wo",
    4 : "Do",
    5 : "Vrij",
    6 : "Za"
  }

  function changeMeal(e, index) {
    const newMealObject = updateObject(meals[index], "meal", e.target.value);
    const newMealArray = updateArray(meals, index, newMealObject);
    setMeals(newMealArray);
  }

  return (
    <div className="topSection">{
      meals.map((meal, index) => {
        const date = new Date(meal.date);
        const dayLabel = dayLabelMap[date.getDay()] + " " + date.getDate();

        return <div className="dayItem" key={meal.date}>
          {<p className="day">{dayLabel}</p>}
    
          {!isEditing && <p className="meal">{meal.meal}</p>}
          {isEditing && <input 
            ref={inputEl}
            type="text"
            value={meal.meal}
            onChange={e => changeMeal(e, index)}
          />}
        </div>}
    )}</div>)
}

export default MealList;