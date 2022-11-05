import { useRef, useState } from "react";
import '../css/components/SearchableInput.css';

const SearchableInput = () => {
    const textInput = useRef(null);
    const [text, setText] = useState("");
    const [results, setResults] = useState([]);

    const items = ["item 1", "item 2", "item 3", "item 4", "item 5", "itemm", "banana", "banana yellow", "banana red", "nana"];

    function handleKeyPress(e) {
        if (e.key == "Enter") {
            console.log("Submitting " + text)
        } else {
            console.log(e.keyCode)
        }
    }

    function handleInputChange(e) {

        const value = e.target.value;
        setText(value);

        setResults(items.filter(item => item.includes(value) && value != ""));
        console.log(e.target.value);
    }
    
    return <div className="searchableInputWrapper">
        <input 
            className="searchInput"
            type="text"
            ref={textInput}
            onKeyPress={handleKeyPress}
            onChange={handleInputChange}
        />
        <div className="searchResults">
            {results.length != 0 && 
                results.map((item) =>
                    <div key={item} className="searchResult">
                        <input type="radio" id={item} name="result"></input>
                        <label htmlFor={item}>{item}</label>
                    </div>
            )}
        </div>

    </div>
}

export default SearchableInput;