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
    <details className="shopOrder">
      <summary className='settingShopTitle'><span>{shop.name}</span></summary>
      <ReactSortable
        list={settings.shopOrder[shop.id]}
        setList={setShopOrder}
        handle='.shopDragHandle'
        animation={150}
        onChange={() => setChangedSettings(true)}
        disabled={disabled}
      >
        {settings.shopOrder[shop.id].map((locationId) => (
          <div className='locationContainer' key={locationId}>
            <div className="shopDragHandleContainer"><div className="shopDragHandle"></div></div>
            <span className='locationLabel'>{shop.locations[locationId].name}</span>
          </div>
        ))}
      </ReactSortable>
    </details>
  )
}

export default ShopSortOrder