import SearchableInput from "./SearchableInput";
import AsyncCreatableSelect from 'react-select/async-creatable';

const PlaygroundPage = () => {
    return <div className="playground">
        <br />
        <SearchableInput />
        <br />
        <AsyncCreatableSelect
            isClearable
            onChange={e=>console.log(e.value)}
            defaultOptions={
                [
                    { value: "item 1", label: "item 1" },
                    { value: "item 2", label: "item 2" },
                    { value: "item 3", label: "item 3" },
                    { value: "item 4", label: "item 4" },
                    { value: "item 5", label: "item 5" },
                ]
            }
        ></AsyncCreatableSelect>
    </div>
}

export default PlaygroundPage;