import { useState } from "react";
import "./css/EditableTextField.css";

const EditableTextField = (props) => {
    const [text, setText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <div className="EditableTextField">
            {isEditing && 
            <input
                id={props.id + "-input"}
                type="text"
                placeholder="Enter text here!"
                onChange={(e) => { setText(e.target.value) }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setIsEditing(!isEditing);
                    }
                }}
                value={text}
            />}
            {!isEditing && <p>{text === ""? "Enter text here!" : text}</p>}
            <button
                id={props.id + "-button"} 
                onClick={(e) => { setIsEditing(!isEditing) }}
            >{ !isEditing? "Edit" : "Finish" }</button>
        </div>
     );
}
 
export default EditableTextField;