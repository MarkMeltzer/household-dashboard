import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useGetWeekLists from '../hooks/useGetWeekLists';
import '../css/pages/HomePage.css';
import ConfirmDeleteButton from '../components/ConfirmDeleteButton';

const HomePage = () => {
  const { data: weekLists, isLoading, error, sendRequest } = useGetWeekLists();

  useEffect(() => {
    sendRequest();
  }, [])
  
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
          <div className='weekListItemContainer' key={el[0]}>
            <Link to={`/week/${el[0]}`} className="weekListItem">
              {el[1].creationDate}
            </Link>
            <ConfirmDeleteButton 
              deleteFunc={() => console.log("Deleted: " + el[0])}
            />
          </div>
        )
      }
    </div>  
  );
}

export default HomePage;