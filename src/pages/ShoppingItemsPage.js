import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import useGetShoppingItems from "../hooks/useGetShoppingItems";
import "../css/pages/ShoppingItemsPage.css";

const ShoppingItemsPage = () => {
    const {
      data: shoppingItems, _, isLoading, error, sendRequest
    } = useGetShoppingItems();
    const [filter, setFilter] = useState("");

    useEffect(() => {
      // get shoppingItems data when component mounts
      sendRequest();
    }, [])

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