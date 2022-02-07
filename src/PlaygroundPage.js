import SearchableInput from "./SearchableInput";
import AsyncCreatableSelect from 'react-select/async-creatable';
import useFetch from "./hooks/useFetch";
import config from "./config.json";
import "./css/PlaygroundPage.css"
import { useState } from "react";

const PlaygroundPage = () => {
    const { data, isLoading, error } = useFetch("https://catfact.ninja/fact");
    const [temp, setTemp] = useState("temp");
    const { data: shoppingItems } = useFetch(
        config.DATA_SERVER_URL + "/shoppingItems/all/onlyNames"
    );
    function handleCreation(value) {
        setTemp(value);
    }

    function loadShoppingItems(value) {
        return shoppingItems ? shoppingItems.filter(value) : [];
    }

    return <div className="playground">
        {data && <div className="whitetext">
            {JSON.stringify(
                shoppingItems,
                null,
                "\t"
            )}
        </div>}

        <div>{temp}</div>

        <br />
        <SearchableInput />
        <br />
        <AsyncCreatableSelect
            isClearable
            onChange={e=>console.log("test: " + e.value)}
            defaultOptions={true}
            loadOptions={loadShoppingItems}
            onCreateOption={handleCreation}
        ></AsyncCreatableSelect>
    </div>
}

export default PlaygroundPage;