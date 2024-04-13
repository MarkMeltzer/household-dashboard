import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import SettingsPage from "./pages/SettingsPage";

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
    <div className="App">
      <globalContext.Provider value={{"token" : token}}>
        <div className="content">
          <Router>
            <Nav setLoginToken={setToken}/>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/week/:id" element={<WeekListPage />} />
              <Route path="/newweek" element={<NewWeekListPage />} />
              <Route path="/shoppingItems" element={<ShoppingItemsPage />} />
              <Route path="/shoppingItem/:id" element={<ShoppingItemPage />} />
              <Route path="/recipes" element={<RecipeListPage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/newrecipe" element={<RecipePage newRecipe />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route render={() => <h1>Page not found :(</h1>} />
            </Routes>
          </Router>
        </div>
      </globalContext.Provider>
    </div>
  );
}

export default App;
