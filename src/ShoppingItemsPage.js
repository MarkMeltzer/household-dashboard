import useFetch from "./hooks/useFetch";
import config from "./config.json";
import { Link } from "react-router-dom";
import "./css/ShoppingItemsPage.css";

const ShoppingItemsPage = () => {
    const { data: shoppingItems, isLoading, error } = useFetch(
        config.DATA_SERVER_URL + "/shoppingItems"
    );

    return <div className="ShoppingItemsList">
      {error && <p className='error'>Error: {error.message}</p>}
      {!error && isLoading && <p className='loading'>Loading....</p>}
      {
        shoppingItems &&
        Object.entries(shoppingItems).map((item) => 
            <Link to={`/shoppingItem/${item[0]}`} key={item[0]} className="ShoppingItemsListItem">{item[1].name}</Link>
          )
      }
    </div>
}

export default ShoppingItemsPage;