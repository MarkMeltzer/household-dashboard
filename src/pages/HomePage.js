import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import config from "../config.json";
import '../css/pages/HomePage.css';

const HomePage = () => {
  const { data: weekLists, isLoading, error } = useFetch(config.DATA_SERVER_URL + "/weekLists");
  
  function sortWeekLists(weekListsEntries) {
    return [...weekListsEntries].sort((weekList1, weekList2) => {
      return new Date(weekList2[1].creationDate) - new Date(weekList1[1].creationDate);
    })
  }

  return (
    <div className="WeekListList">
      {error && <p className='error'>Error: {error.message}</p>}
      {!error && isLoading && <p className='loading'>Loading....</p>}
      {weekLists &&
        sortWeekLists(Object.entries(weekLists)).map((el) => 
          // el = [id, { creationDate, meals{}, shoppingList{} }]
          <Link to={`/week/${el[0]}`} className="weekListItem" key={el[0]}>
            {el[1].creationDate}
          </Link>
        )
      }
    </div>  
  );
}

export default HomePage;