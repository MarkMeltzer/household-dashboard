import React from 'react'

function SettingToggle({ label, summary, value, setValue, setChangedSettings }) {
  function toggleValue() {
    setChangedSettings(true)
    setValue(oldValue => !oldValue)
  }

  return (
    <div className="settingLine">
      <label className='settingLabel' htmlFor="toggle">{label}:</label>
      <input 
        type='checkBox'
        id='toggle'
        value={value}
        onChange={toggleValue}
        className="settingCheckbox"
      ></input>
      <p className="settingSummary">{summary}</p>
    </div>
  )
}

export default SettingToggle