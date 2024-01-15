import React, {useState} from 'react'
import { ReactSortable } from "react-sortablejs";
import { updateObject } from '../../utils';

function ShopSortOrder({ 
  shop,
  settings,
  setSettings,
  setChangedSettings,
  disabled
 }) {
  function setShopOrder(newOrder) {
    setSettings(
      updateObject(
        settings,
        'shopOrder',
        updateObject(settings.shopOrder, shop.id, newOrder)
      )
    )
  }

  return (
    <div className="shopOrder">
      <label className='settingLabel'>{shop.name}:</label>
      <ReactSortable
        list={settings.shopOrder[shop.id]}
        setList={setShopOrder}
        handle='.dragHandle'
        animation={150}
        onChange={() => setChangedSettings(true)}
        disabled={disabled}
      >
        {settings.shopOrder[shop.id].map((locationId) => (
          <div className='locationContainer' key={locationId}>
            <div className="dragHandleContainer"><div className="dragHandle"></div></div>
            <span className='locationLabel'>{shop.locations[locationId].name}</span>
          </div>
        ))}
      </ReactSortable>
    </div>
  )
}

export default ShopSortOrder