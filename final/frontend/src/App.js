import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import NavBar from './components/NavBar'
import MySelect from './components/MySelect'
import MyButton from './containers/MyButton'
import MyDBSelect from './containers/MyDBSelect'

let myData = {
  name: 'vincent',
  gender: 'male'
}

function App() {
  return (
    <div>
      <NavBar />
      {/*<MySelect />*/}
      {/*<MyButton data={myData} />*/}
      <MyDBSelect />
    </div>
  );
}

export default App;
