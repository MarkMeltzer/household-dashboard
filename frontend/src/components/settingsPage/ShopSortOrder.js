import React from 'react'
import { ReactSortable } from "react-sortablejs";

function ShopSortOrder({ 
  label,
  list,
  setList,
  setChangedSettings,
 }) {
  return (
    <div className="shopOrder">
      <label className='settingLabel'>{label}:</label>
      <ReactSortable
      list={list}
      setList={setList}
      handle='.dragHandle'
      animation={150}
      onChange={() => setChangedSettings(true)}
      >
        {list.map((item) => (
          <div className='locationContainer' key={label + item}>
            <div className="dragHandleContainer"><div className="dragHandle"></div></div>
            <span className='locationLabel'>{item}</span>
          </div>
        ))}
      </ReactSortable>
    </div>
  )
}

export default ShopSortOrder