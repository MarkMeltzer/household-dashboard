import { useEffect } from "react";
import useGetRecipes  from "../hooks/useGetRecipes";
import { Link } from "react-router-dom";

const RecipeListPage = () => {
  const {
    data: recipes, _, isLoading, error, sendRequest
  } = useGetRecipes();

  useEffect(() => {
    sendRequest();
  }, [])

  return <div className="recipesList">
    {error && <p className='error'>Error: {error.message}</p>}
    {!error && isLoading && <p className='loading'>Loading....</p>}
    {
      recipes &&
      Object.entries(recipes).map((recipe) => {
        // recipe = [id, {...}]
        return <Link
          to={`/recipe/${recipe[0]}`}
          key={recipe[0]}
        >
          {recipe[1]?.name}
        </Link>
      })
    }
  </div>
}

export default RecipeListPage;