import SearchableInput from "./SearchableInput";
import ShoppingItemInput from "./ShoppingItemInput";
import useFetch from "./hooks/useFetch";
import config from "./config.json";
import "./css/PlaygroundPage.css"
import { useState } from "react";
import globalContext from "./globalContext";

const PlaygroundPage = () => {
    const [shoppingList, setShoppingList] = useState([
        { id: "333da0503ff54ab0be488a72d1eef35c", checked: false },
        { id: "4ae6f00f693f42d8bb31c51dd87b6ade", checked: false },
        { id: "0e9afcb998f745bb998d8c5132b22be3", checked: false }
    ])
    const shoppingItems = useFetch(
        config.DATA_SERVER_URL + "/shoppingItems/all",
        []
    );


    return <div className="playground">
        {shoppingItems && <div className="whitetext">
            {JSON.stringify(
                shoppingItems,
                null,
                "\t"
            )}
        </div>}
        <br />
        <SearchableInput />
        <br />
       <ShoppingItemInput 
            shoppingItems={shoppingItems}
            shoppingList={shoppingList}
            setShoppingList={setShoppingList}
            index={2}
       />
        <br />
        <br />
        <br />
    </div>
}

export default PlaygroundPage;

// const PlaygroundPage = () => {
//     const context = useContext(globalContext);
//     const [createdItem, setCreatedItem] = useState("");
//     const [selectedItem, setSelectedItem] = useState("");
//     const { data : shoppingItems, isLoading, error } = useFetch(
//         config.DATA_SERVER_URL + "/shoppingItems/all",
//         [createdItem]
//     );
//     function handleCreation(value) {
//         console.log("Creating item...")
//         fetch(
//             config.DATA_SERVER_URL + "/shoppingItems",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": "Bearer " + context["token"]
//                 },
//                 body: JSON.stringify({
//                     name: value
//                 })
//             }
//         ).then(
            
//         )
//         setCreatedItem(value);
//     }
//     function handleSelection(event) {
//         if (event) {
//             console.log(event)
//             setSelectedItem(event.value);
//         } else {
//             setSelectedItem("");
//         }
//     }

//     function loadShoppingItems() {
//         console.log("Loading shoppingItems...")
//         if (!shoppingItems) {
//             return []
//         } else {
//             console.log(shoppingItems)
//             return Object.entries(shoppingItems).map((item)=>{
//                 return { value: item[0], label: item[1].name }
//             });
//         }
//     }

//     return <div className="playground">
//         {shoppingItems && <div className="whitetext">
//             {JSON.stringify(
//                 {},
//                 null,
//                 "\t"
//             )}
//         </div>}

//         <div>Created item: {createdItem}</div>
//         <div>Selected item: {shoppingItems && JSON.stringify(shoppingItems[selectedItem])}</div>

//         <br />
//         <SearchableInput />
//         <br />
//         <CreatableSelect
//             isClearable
//             options={loadShoppingItems()}
//             isLoading={isLoading}
//             onChange={handleSelection}
//             onCreateOption={handleCreation}
//         ></CreatableSelect>
//         <br />
//         <br />
//         <br />
//     </div>
// }

// export default PlaygroundPage;