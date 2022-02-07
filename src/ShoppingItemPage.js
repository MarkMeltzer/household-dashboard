import { useParams } from "react-router";
import useFetch from "./hooks/useFetch";
import config from "./config.json";
import "./css/ShoppingItemPage.css"
import { useState } from "react";

const ShoppingItemPage = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useFetch(config.DATA_SERVER_URL + "/shoppingItems/" + id);
    const [isEditing, setIsEditing] = useState(false);
    const isSubmitting = false;

    const dataDisplay = data &&
        <div className="shoppingItemDisplay">
            <p className="shoppingItemTitle">Shopping Item</p>
            <p className="shoppingItemName">{data.name}</p>
            <div className="price">
                <span className="priceTitle">Price: </span>
                <span className="priceValue">{data.price ? "€ " + data.price.toFixed(2) : "Not specified"}</span>
            </div>
            <div className="location">
                <span className="locationTitle">Location: </span>
                <span className="locationValue">{data.location ? data.location : "Not specified"}</span>
            </div>
        </div>

    return <div className="shoppingItemDisplayContainer">
        {error && <p className="error">Error: {error.message}</p>}
        {!error && isLoading && <p className='loading'>Loading....</p>}
        {!error && !isLoading && dataDisplay}
    </div>
}

export default ShoppingItemPage;