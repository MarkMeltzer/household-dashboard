import SettingToggle from '../components/settingsPage/SettingToggle'
import ShopSortOrder from '../components/settingsPage/ShopSortOrder'
import '../css/pages/SettingsPage.css'
import React, { useEffect, useState } from 'react'
import useGetSettings from '../hooks/useGetSettings'
import useUpdateSettings from '../hooks/useUpdateSettings'
import useGetShops from '../hooks/useGetShops'
import { DebugRenderObject, updateObject } from '../utils'


function SettingsPage() {
  // have any settings been changed?
  const [changedSettings, setChangedSettings] = useState(false)

  const { data: settings, setData: setSettings, ...getSettings} = useGetSettings()
  const { data: shops, ...getShops} = useGetShops()
  const updateSettings = useUpdateSettings()

  useEffect(() => {
    getSettings.sendRequest()
    getShops.sendRequest()
  }, [])

  function setSortOnSubmit(newValue) {
    setSettings(
      updateObject(settings, 'sortOnSubmit', newValue)
    )
  }

  function submitSettings() {
    updateSettings.sendRequest(
      JSON.stringify(settings),
      () => {
        setChangedSettings(false)
      },
      (err) => {
        alert("Error submitting list: \n" + err);
      }
    )
  }

  return <div>
    <div className="detailDisplayContainer">
      {settings && 
        <div className="detailDisplay">
          <button 
            className="submitSettingsButton"
            disabled={!changedSettings || getSettings.isLoading || updateSettings.isLoading}
            onClick={submitSettings}
          >
            {updateSettings.isLoading ? 'Submitting...' : 'Save settings'}
          </button>

          <p className="itemName">Settings</p>

          <p className="sectionHeader">Weeklist shoppinglist sorting</p>
          <SettingToggle
            label={'Auto sort on submit'}
            summary={'Automatically sort shoppinglist on when submitting the week list according to the order specified below.'}
            value={settings.sortOnSubmit}
            setValue={setSortOnSubmit}
            setChangedSettings={setChangedSettings}
            disabled={getSettings.isLoading || updateSettings.isLoading}
          />

          <p className='subsectionHeader'>Shop sorting order</p>

          {shops && Object.entries(shops).map((shop => (
              <ShopSortOrder
                key={shop[0]}
                shop={{'id': shop[0], ...shop[1]}}
                settings={settings}
                setSettings={setSettings}
                setChangedSettings={setChangedSettings}
                disabled={getSettings.isLoading || updateSettings.isLoading}
            />
          )))}
        </div>}
    </div>
  </div>
}

export default SettingsPage
