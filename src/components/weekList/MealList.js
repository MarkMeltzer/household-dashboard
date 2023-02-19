import { useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import { updateArray, updateObject } from "../../utils";

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

  function changeMeal(e, index) {
    const newMealObject = updateObject(meals[index], "meal", e.target.value);
    const newMealArray = updateArray(meals, index, newMealObject);
    setMeals(newMealArray);
  }

  return (
    <div className="topSection">
      <div className="days">
        {mealDates.map((date) => {
          const dateObj = new Date(date);
          const dayLabel = dayLabelMap[dateObj.getDay()] + " " + dateObj.getDate();

          return (
            <p className="day" key={date}>
              {dayLabel}
            </p>
          );
        })}
      </div>
      {!isEditing && (
        <div className="meals">
          {!isEditing &&
            meals.map((meal, index) => {
              return (
                <p className="meal" key={mealDates[index]}>
                  {meal.meal}
                </p>
              );
            })}
        </div>
      )}

      {isEditing && (
        <ReactSortable
          list={meals}
          setList={setMeals}
          handle=".dragHandle"
          animation={150}
          className="meals"
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
      )}
    </div>
  );
};

export default MealList;
