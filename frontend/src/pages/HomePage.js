import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useGetWeekLists from '../hooks/useGetWeekLists';
import useDeleteWeekList from '../hooks/useDeleteWeekList';
import { removeItemFromObject } from '../utils';
import '../css/pages/HomePage.css';
import ConfirmDeleteButton from '../components/ConfirmDeleteButton';
import { weekListDateTimeFormat } from '../consts';
const WeekListItem = ({ weekList, setWeekLists }) => {
  const deleteWeekList = useDeleteWeekList(weekList.id);

  const onDelete = () => {
    deleteWeekList.sendRequest(
      () => setWeekLists(prev => removeItemFromObject(prev, weekList.id))
    );
  }
  
  return <div className='weekListItemContainer' >
    {!deleteWeekList.isLoading &&
    <Link to={`/week/${weekList.id}`} className="weekListItem">
      {new Date(weekList.creationDate).toLocaleString('en-NL', weekListDateTimeFormat)}
    </Link>}
    {deleteWeekList.isLoading &&
    <p className="weekListItem">
      Deleting... {weekList.creationDate}
    </p>}
    <ConfirmDeleteButton 
      deleteFunc={onDelete}
      disabled={deleteWeekList.isLoading}
    />
  </div>
}

const HomePage = () => {
  const {
    data: weekLists,
    setData: setWeekLists,
    isLoading,
    error,
    sendRequest 
  } = useGetWeekLists();

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
        <Link to="/newweek" className='newWeekButton'>
          New Week
        </Link>
      }
      {weekLists &&
        sortWeekLists(Object.entries(weekLists)).map((weekList) => 
          // weekList = [id, { creationDate, meals{}, shoppingList{} }]
          <WeekListItem
            weekList={{...weekList[1], id: weekList[0]}}
            setWeekLists={setWeekLists}
            key={weekList[0]}
          />
        )
      }
    </div>  
  );
}

export default HomePage;