import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useGetRecipe from '../hooks/useGetRecipe';
import useUpdateRecipe from '../hooks/useUpdateRecipe';
import { updateObject } from '../utils';
import "../css/shared/detailPage.css"

function RecipePage() {
  const { id } = useParams();
  const { data: recipe, setData: setRecipe, isLoading, error, sendRequest } = useGetRecipe(id)
  const updateRecipe = useUpdateRecipe(id)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    sendRequest()
  }, [])

  function handleEditClick() {
    if (isEditing) {
      updateRecipe.sendRequest(
        JSON.stringify(recipe),
        () => { setIsEditing(false) },
        () => { setIsEditing(false) },
      )

      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const dataDisplay = recipe &&
    <div className="detailDisplay">
      <button 
        className="detailEditButton"
        onClick={handleEditClick}
        disabled={updateRecipe.isLoading}>
        {(() => {
          if (updateRecipe.isLoading) {
              return "Submitting..."
            } else if (isEditing) {
              return "Submit!"
            } else {
              return "Edit"
          }
        })()}
      </button>

      <p className="itemType">Recipe</p>
      <p className="itemName">
        {!isEditing && recipe.name}
        {isEditing &&
          <input type="text"
            value={recipe.name}
            disabled={updateRecipe.isLoading}
            onChange={(e)=>(
              setRecipe(updateObject(recipe, "name", e.target.value)))}
          />}
      </p>

      <div className="recipeUrl">
        <span className="attributeLabel">Recipe link: </span>
        <span className="attributeValue">
          {!isEditing && (
            recipe.sourceUrl ? 
              <a href={recipe.sourceUrl}>{recipe.sourceUrl}</a> : 
              "No link specified"
          ) }
          {isEditing && 
            <input
              type="text"
              value={recipe.sourceUrl ? recipe.sourceUrl : ""}
              disabled={updateRecipe.isLoading}
              onChange={(e)=>(
                setRecipe(updateObject(recipe, "sourceUrl", e.target.value)))}
            />}
        </span>
      </div>

      <div className="recipeText">
        <span className="attributeLabel">Recipe text: </span>
        <div className="textAreaValue">
          {!isEditing && (recipe.recipeText ? recipe.recipeText : "No recipe specified") }
          {isEditing && 
            <textarea
              value={recipe.recipeText ? recipe.recipeText : ""}
              disabled={updateRecipe.isLoading}
              onChange={(e)=>(
                setRecipe(updateObject(recipe, "recipeText", e.target.value)))}
              rows={30}
            />}
        </div>
      </div>
    </div>

  return <div>
    {error && <p className="error">Error: {error.message}</p>}
    {!error && isLoading && <p className='loading'>Loading....</p>}
    {!error && !isLoading && dataDisplay}
  </div>
}

export default RecipePage