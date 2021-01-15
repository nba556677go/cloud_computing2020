import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import NavBar from './components/NavBar'
import MySelect from './components/MySelect'
import MyButton from './containers/MyButton'
import MyDBSelect from './containers/MyDBSelect'
import { Home } from "./containers/Home";
import { Son } from "./containers/Son";
import ChartButton from "./containers/ChartButton";
import MapButton from "./containers/MapButton";
import { Chart } from "./containers/Chart";

let myData = {
  name: 'vincent',
  gender: 'male'
}

function App() {
  return (
    <div>
      {/*
      <NavBar />
      <MyButton data={myData} />
      <MyDBSelect />
      */}
      <MapButton/> 
      <ChartButton/>
      <BrowserRouter>
        <Switch>
          <Route exact path="/son" component={Son}/>
          <Route exact path="/" component={Home}/>
          <Route exact path="/chart" component={Chart}/>
          <Redirect from="*" to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
