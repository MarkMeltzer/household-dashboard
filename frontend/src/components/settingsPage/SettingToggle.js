import React from 'react'

function SettingToggle({ label, summary, value, setValue, setChangedSettings }) {
  function toggleValue(e) {
    setChangedSettings(true)
    setValue(e.target.checked)
  }

  return (
    <div className="settingLine">
      <label className='settingLabel' htmlFor="toggle">{label}:</label>
      <input 
        type='checkBox'
        id='toggle'
        checked={value}
        onChange={toggleValue}
        className="settingCheckbox"
      ></input>
      <p className="settingSummary">{summary}</p>
    </div>
  )
}

export default SettingToggle