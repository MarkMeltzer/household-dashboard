import { useState } from "react";
import "../css/components/ConfirmDeleteButton.css"

/**
 * A button to delete an item but requires client-side confirmation.
 * 
 * @param {function} deleteFunc the delete function to be called if confirmed
 * @param {boolean} disabled whether the button is disabled or not
 */
const ConfirmDeleteButton = ({ deleteFunc, disabled }) => {
  const [open, setOpen] = useState(false);

  const switchOpen = () => {
    setOpen((prevState) => !prevState);
  }

  const onDelete = () => {
    switchOpen();
    deleteFunc();
  }

  return <div className="confirmDeleteButton">
    {!open && <button
      className="deleteButton"
      onClick={switchOpen}
      disabled={disabled}
    >
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