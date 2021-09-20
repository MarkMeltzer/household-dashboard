import './css/App.css';
import WeekList from './WeekList';

function App() {

  return (
    <div className="App">
      <div className="content">
        <WeekList isEditing={false} />
      </div>
    </div>
  );
}

export default App;
