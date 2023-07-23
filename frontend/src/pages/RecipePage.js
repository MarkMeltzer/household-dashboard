import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useGetRecipe from '../hooks/useGetRecipe';
import useUpdateRecipe from '../hooks/useUpdateRecipe';
import { updateObject } from '../utils';
import "../css/shared/detailPage.css"
import useCreateRecipe from '../hooks/useCreateRecipe';
import { useHistory} from 'react-router-dom';

function RecipePage({ newRecipe }) {
  const { id } = useParams();
  const history = useHistory()
  const [isEditing, setIsEditing] = useState(newRecipe)
  
  const { data: recipe, setData: setRecipe, isLoading, error, sendRequest: getRecipe } = useGetRecipe(id)
  const updateRecipe = useUpdateRecipe(id)
  const createRecipe = useCreateRecipe()

  useEffect(() => {
    if (!newRecipe) {
      getRecipe()
    } else {
      setRecipe({
        "name": "",
        "sourceUrl": "",
        "recipeText": "",
      })
    }
  }, [])

  function handleEditClick() {
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    setIsEditing(false)

    if (!newRecipe) {
      updateRecipe.sendRequest(JSON.stringify(recipe))
    } else {
      createRecipe.sendRequest(
        JSON.stringify(recipe),
        res => history.push(`/recipe/${res['id']}`),
        err => alert("Error submitting recipe: \n" + err) 
      )
    }
  }

  const dataDisplay = recipe && <div className='detailDisplayContainer'>
    {(recipe.imageUrl && !isEditing) &&
      <img
        src={recipe.imageUrl}
        alt="banner image"
        className='bannerImage'
      />
    }
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

      <div className="imageUrl">
        <span className="attributeLabel">Banner image link: </span>
        <span className="attributeValue">
          {!isEditing && (
            recipe.imageUrl ? 
              <a href={recipe.sourceUrl}>{recipe.imageUrl}</a> : 
              "No link specified"
          ) }
          {isEditing && 
            <input
              type="text"
              value={recipe.imageUrl ? recipe.imageUrl : ""}
              disabled={updateRecipe.isLoading}
              onChange={(e)=>(
                setRecipe(updateObject(recipe, "imageUrl", e.target.value)))}
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
  </div>

  return <div>
    {error && <p className="error">Error: {error.message}</p>}
    {!error && isLoading && <p className='loading'>Loading....</p>}
    {!error && !isLoading && dataDisplay}
  </div>
}

export default RecipePage