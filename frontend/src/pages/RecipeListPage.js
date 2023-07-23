import { useEffect, useState } from "react";
import useGetRecipes  from "../hooks/useGetRecipes";
import { Link } from "react-router-dom";
import "../css/shared/listPage.css"

const RecipeListPage = () => {
  const [filter, setFilter] = useState("")

  const {
    data: recipes, _, isLoading, error, sendRequest
  } = useGetRecipes();

  useEffect(() => {
    sendRequest();
  }, [])

  return <div className="listContainer">
    {error && <p className='error'>Error: {error.message}</p>}
    {!error && isLoading && <p className='loading'>Loading....</p>}
    {recipes && <>
      <div className="filterAndNewItemButtonContainer">
        <input
          type="text"
          className="listFilter"
          placeholder="Type here to filter recipe name..."
          onChange={e => setFilter(e.target.value)}
          value={filter}
        />
        <Link to="/newrecipe" className='newItemButton'>
          New Recipe
        </Link>
      </div>
      {Object.entries(recipes).map((recipe) => {
        // recipe = [id, {...}]
        if (recipe[1].name.toLowerCase().includes(filter.toLowerCase())) {
          return <div className="listItemContainer" key={recipe[0]}>
            <Link
              className='listItem'
              to={`/recipe/${recipe[0]}`}
            >
              {recipe[1]?.name}
            </Link>
          </div>}
      })}
    </>
    }
  </div>
}

export default RecipeListPage;