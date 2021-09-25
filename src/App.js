import { BrowserRouter as Router } from "react-router-dom";

import Search from "components/Search/Search";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Search />
      </div>
    </Router>
  );
}

export default App;
