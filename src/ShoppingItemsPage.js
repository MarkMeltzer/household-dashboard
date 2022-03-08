import useFetch from "./hooks/useFetch";
import config from "./config.json";
import { Link } from "react-router-dom";
import "./css/ShoppingItemsPage.css";
import { useState } from "react";

const ShoppingItemsPage = () => {
    const { data: shoppingItems, isLoading, error } = useFetch(
        config.DATA_SERVER_URL + "/shoppingItems"
    );
    const [filter, setFilter] = useState("");

    return <div className="ShoppingItemsList">
      {error && <p className='error'>Error: {error.message}</p>}
      {!error && isLoading && <p className='loading'>Loading....</p>}
      {<div className="shoppingItemsFilterContainer">
        <input
          type="text"
          className="shoppingItemsFilter"
          placeholder="Type here to filter items..."
          onChange={e => setFilter(e.target.value)}
          value={filter}
        />
      </div>}
      {
        shoppingItems &&
        Object.entries(shoppingItems).map((item) => {
          // item = [id, { name, location, etc... }]
          if (item[1].name.toLowerCase().includes(filter.toLowerCase())) {
            return <Link 
                to={`/shoppingItem/${item[0]}`}
                key={item[0]} 
                className="ShoppingItemsListItem"
              >{item[1].name}</Link>
          }
        }
          )
      }
    </div>
}

export default ShoppingItemsPage;