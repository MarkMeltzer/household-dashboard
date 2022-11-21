import { useState } from "react";
import "../css/components/ConfirmDeleteButton.css"

/**
 * A button to delete an item but requires client-side confirmation.
 * 
 * @param {function} deleteFunc the delete function to be called if confirmed
 */
const ConfirmDeleteButton = ({ deleteFunc }) => {
  const [open, setOpen] = useState(false);

  const switchOpen = () => {
    setOpen((prevState) => !prevState);
  }

  const onDelete = () => {
    switchOpen();
    deleteFunc();
  }

  return <div className="confirmDeleteButton">
    {!open && <button className="deleteButton" onClick={switchOpen}>
      🗑️
    </button>}
    {open && <>
      <button 
        className="confirmButton"
        onClick={onDelete}
      >✔️</button>
      <button 
        className="cancelButton"
        onClick={switchOpen}
      >❌</button>
    </>}
  </div>
}

export default ConfirmDeleteButton;