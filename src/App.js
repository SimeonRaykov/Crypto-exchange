import { BrowserRouter, Switch, Route } from "react-router-dom";

import Search from "components/Search/Search";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Search} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
