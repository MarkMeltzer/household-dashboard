import { useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import { updateArray, updateObject } from "../../utils";
import React from "react";

const MealList = ({ isEditing, setMeals, meals, mealDates }) => {
  const inputEl = useRef(null);

  const dayLabelMap = {
    0: "Zo",
    1: "Ma",
    2: "Di",
    3: "Wo",
    4: "Do",
    5: "Vrij",
    6: "Za",
  };

  function getDayLabel(date) {
    const dateObj = new Date(date);
    return dayLabelMap[dateObj.getDay()] + " " + dateObj.getDate();
  }

  function changeMeal(e, index) {
    const newMealObject = updateObject(meals[index], "meal", e.target.value);
    const newMealArray = updateArray(meals, index, newMealObject);
    setMeals(newMealArray);
  }

  return (
    <div className="topSection">
      {/* View mode */}
      {!isEditing &&
        mealDates.map((date, index) => {
          const dayLabel = getDayLabel(date);
          const meal = meals[index];

          return (
            <React.Fragment key={date}>
              <p className="day" key={date}>
                {dayLabel}
              </p>
              <p className="meal" key={"mealOf" + mealDates[index]}>
                {meal.meal}
              </p>
            </React.Fragment>
          );
        })}

      {/* Edit mode */}
      {isEditing && (
        <>
          <div className="editModeDays">
            {mealDates.map((date) => {
              return <p className="day" key={date}>{getDayLabel(date)}</p>;
            })}
          </div>
          <ReactSortable
            list={meals}
            setList={setMeals}
            handle=".dragHandle"
            animation={150}
            className="editModeMeals"
          >
            {meals.map((meal, index) => {
              return (
                <div key={mealDates[index]} className="mealEditMode">
                  <div className="dragHandleContainer">
                    <div className="dragHandle"></div>
                  </div>
                  <input
                    ref={inputEl}
                    type="text"
                    value={meal.meal}
                    onChange={(e) => changeMeal(e, index)}
                  />
                </div>
              );
            })}
          </ReactSortable>
        </>
      )}
    </div>
  );
};

export default MealList;
