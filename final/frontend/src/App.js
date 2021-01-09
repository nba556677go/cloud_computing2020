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


      <BrowserRouter>
        <Switch>
          <Route exact path="/son" component={Son}/>
          <Route exact path="/" component={Home}/>
          <Redirect from="*" to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
