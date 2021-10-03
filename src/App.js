import './css/App.css';
import WeekListPage from './WeekListPage';
import NewWeekListPage from './NewWeekListPage';
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

function App() {
  // look for login tokin in localstorage
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
    <Router>
    <div className="App">
      <globalContext.Provider value={{"token" : token}}>
        <div className="content">
          <Nav />
          <Switch>
            <Route exact path="/"><Home /></Route>
            <Route path="/week/:id"><WeekListPage /></Route>
            <Route path="/newweek"><NewWeekListPage /></Route>
            <Route render={() => <h1>Page not found :(</h1>} />
          </Switch>
        </div>
      </globalContext.Provider>
    </div>
    </Router>
  );
}

export default App;
