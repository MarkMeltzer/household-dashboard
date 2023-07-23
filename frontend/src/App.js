import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useState } from "react";
import WeekListPage from './pages/WeekListPage';
import NewWeekListPage from './pages/NewWeekListPage';
import PlaygroundPage from './pages/PlaygroundPage';
import HomePage from './pages/HomePage';
import LoginPage from "./pages/LoginPage";
import ShoppingItemPage from './pages/ShoppingItemPage';
import ShoppingItemsPage from './pages/ShoppingItemsPage';
import AboutPage from './pages/AboutPage'
import Nav from './components/Nav';
import globalContext from './globalContext';
import './css/App.css';
import RecipeListPage from "./pages/RecipeListPage";
import RecipePage from "./pages/RecipePage";

function App() {
  // look for login token in localstorage
  const loginToken = localStorage.getItem("loginToken");

  const [token, setToken] = useState(loginToken);

  // if there is nog login token, redirect to login page
  if (token === null) {
    return <div className="App">
      <div className="content">
        <LoginPage setLoginToken={setToken}></LoginPage>
      </div>
    </div>
  }

  return (
    <Router>
    <div className="App">
      <globalContext.Provider value={{"token" : token}}>
        <div className="content">
          <Nav setLoginToken={setToken}/>
          <Switch>
            <Route exact path="/"><HomePage /></Route>
            <Route path="/week/:id"><WeekListPage /></Route>
            <Route path="/newweek"><NewWeekListPage /></Route>
            <Route path="/shoppingItems"><ShoppingItemsPage /></Route>
            <Route path="/shoppingItem/:id"><ShoppingItemPage /></Route>
            <Route path="/recipes"><RecipeListPage /></Route>
            <Route path="/recipe/:id"><RecipePage /></Route>
            <Route path="/newrecipe"><RecipePage newRecipe /></Route>
            <Route path="/playground"><PlaygroundPage /></Route>
            <Route path="/about"><AboutPage /></Route>
            <Route render={() => <h1>Page not found :(</h1>} />
          </Switch>
        </div>
      </globalContext.Provider>
    </div>
    </Router>
  );
}

export default App;
