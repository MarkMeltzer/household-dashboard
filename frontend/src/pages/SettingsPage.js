import SettingToggle from '../components/settingsPage/SettingToggle'
import ShopSortOrder from '../components/settingsPage/ShopSortOrder'
import '../css/pages/SettingsPage.css'
import React, { useEffect, useState } from 'react'


function SettingsPage() {
  // have any settings been changed?
  const [changedSettings, setChangedSettings] = useState(false)

  // Settings state
  const [sortOnSubmit, setSortOnSubmit] = useState(false)

  const [lidlOrder, setLidlOrder] = useState([
    'Ultra vers',
    'Fruit',
    'Broodjes',
    'Vega/vlees',
  ])

  const [alberHeijnOrder, setAlberHeijnOrder] = useState([
    'Fruit',
    'Vleesvervangers',
    'Broodjes',
  ])

  const [jumboOrder, setJumboOrder] = useState([
    'Fruit',
    'Vleesvervangers',
    'Broodjes',
  ])

  return <div>
    <div className="detailDisplayContainer">
      <div className="detailDisplay">
        <button 
          className="detailEditButton"
          disabled={!changedSettings}
        >
          Save settings
        </button>

        <p className="itemName">Settings</p>

        <p className="sectionHeader">Weeklist shoppinglist sorting</p>
        <SettingToggle
          label={'Auto sort on submit'}
          summary={'Automatically sort shoppinglist on when submitting the week list according to the order specified below.'}
          value={sortOnSubmit}
          setValue={setSortOnSubmit}
          setChangedSettings={setChangedSettings}
        />

        <p className='subsectionHeader'>Shop sorting order</p>

        <ShopSortOrder
          label={'Lidl'}
          list={lidlOrder}
          setList={setLidlOrder}
          setChangedSettings={setChangedSettings}
        />

        <ShopSortOrder
          label={'Jumbo'}
          list={jumboOrder}
          setList={setJumboOrder}
          setChangedSettings={setChangedSettings}
        />

        <ShopSortOrder
          label={'Albert Heijn'}
          list={alberHeijnOrder}
          setList={setAlberHeijnOrder}
          setChangedSettings={setChangedSettings}
        />
      </div>
    </div>
  </div>
}

export default SettingsPage