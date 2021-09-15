import './css/WeekList.css';
import EditableTextField from './EditableTextField';

const WeekList = () => {
  const days = ["Ma", "Di", "Wo", "Do", "Vrij", "Za", "Zo"];
  const mealList = days.map((day) => (
    <div className="dayItem" key={day}>
      <p className="day">{day}</p>
      <p className="meal">{"Meal of " + day}</p>
    </div>
  ));

  const shoppingItems = ["bread", "cheese", "3x paprika", "3L milk", "coke", "more bread", "brocolli", "pasta", "avocado", "salami", "toilet paper"];
  const shoppingList = shoppingItems.map((item) => 
    <p key={item}>{item}</p>
  )

  return (
    <div className="weekList">
      <div className="topSection">
        {mealList}
      </div>
      <div className="bottomSection">
       {shoppingList}
      </div>
    </div>
  );
}
 
export default WeekList;