import { useEffect } from "react";
import useGetRecipes  from "../hooks/useGetRecipes";
import { Link } from "react-router-dom";
import "../css/shared/listPage.css"

const RecipeListPage = () => {
  const {
    data: recipes, _, isLoading, error, sendRequest
  } = useGetRecipes();

  useEffect(() => {
    sendRequest();
  }, [])

  return <div className="listContainer">
    {error && <p className='error'>Error: {error.message}</p>}
    {!error && isLoading && <p className='loading'>Loading....</p>}
    {recipes &&
      <Link to="/newrecipe" className='newItemButton'>
        New Recipe
      </Link>
    }
    {recipes &&
      Object.entries(recipes).map((recipe) => {
        // recipe = [id, {...}]
        return <div className="listItemContainer" key={recipe[0]}>
          <Link
            className='listItem'
            to={`/recipe/${recipe[0]}`}
          >
            {recipe[1]?.name}
          </Link>
        </div>
      })
    }
  </div>
}

export default RecipeListPage;