import { Link } from 'react-router-dom';
import useFetch from './hooks/useFetch';
import './css/Home.css';
import config from "./config.json";

const Home = () => {
  const { data: weekLists, isLoading, error } = useFetch(config.DATA_SERVER_URL + "/weekLists");
  
  return (
    <div className="WeekListList">
      {error && <p className='error'>Error: {error.message}</p>}
      {!error && isLoading && <p className='loading'>Loading....</p>}
      {weekLists &&
        Object.entries(weekLists).map((el) => 
          <Link to={`/week/${el[0]}`} className="weekListItem" key={el[0]}>
            {el[1].creationDate}
          </Link>
        )
      }
    </div>  
  );
}

export default Home;