import './css/App.css';
import WeekListPage from './WeekListPage';
import NewWeekListPage from './NewWeekListPage';
import PlaygroundPage from './PlaygroundPage';
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Nav from './Nav';
import Login from "./Login";
import { useState } from "react";
import globalContext from './globalContext';
import ShoppingItemPage from './ShoppingItemPage';
import ShoppingItemsPage from './ShoppingItemsPage';

function App() {
  // look for login token in localstorage
  const loginToken = localStorage.getItem("loginToken");

  const [token, setToken] = useState(loginToken);

  // if there is nog login token, redirect to login page
  if (token === null) {
    return <div className="App">
      <div className="content">
        <Login setLoginToken={setToken}></Login>
      </div>
    </div>
  }

  return (
    <Router basename={"/household-dashboard-demo"}>
    <div className="App">
      <globalContext.Provider value={{"token" : token}}>
        <div className="content">
          <Nav setLoginToken={setToken}/>
          <Switch>
            <Route exact path="/"><Home /></Route>
            <Route path="/week/:id"><WeekListPage /></Route>
            <Route path="/newweek"><NewWeekListPage /></Route>
            <Route path="/shoppingItems"><ShoppingItemsPage /></Route>
            <Route path="/shoppingItem/:id"><ShoppingItemPage /></Route>
            <Route path="/playground"><PlaygroundPage /></Route>
            <Route render={() => <h1>Page not found :(</h1>} />
          </Switch>
        </div>
      </globalContext.Provider>
    </div>
    </Router>
  );
}

export default App;
