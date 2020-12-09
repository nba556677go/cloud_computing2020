import React from 'react'
import axios from 'axios'
import MyChart from '../components/MyChart'

class MyDBSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = { station: 'stationA', show: false, stationData: null, refresh: true }
    //set all stations
    this.stations = null
    
    //make sure total station list loaded first before rendering the first time
    axios({
      method: 'get',
      url: `http://localhost:5000/getallChID`
    })
    .then(response => this.stations = response.data.chineseID )
    .then(() => {  this.setState({ refresh: true }) })//nees to call setstate to render page!!!
  }

  // fetch data from our data base
  handleSelect = (e) => {
    axios({
      method: 'get',
      url: `http://localhost:5000/getdata?id=${e.target.value}`
    })
    .then(response => this.stationData = response.data )
    .then(() => { console.log(this.stationData) })
    .then(() => this.setState({ station: e.target.value, show: true }) )

    
  }



  render() {
    let display = null 
    let selectStations = null
    
    if (this.state.show) {
      display = (
        <div>
         
          <MyChart info={this.stationData}/>
         
        </div>
      )
    }

    if (this.stations) {
      selectStations = (
        <select onChange={this.handleSelect}>
          {this.stations.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>  
      )
    }

    return (
      <div>
        <h2>Please choose a Youbike station</h2>    
        {selectStations}  
          <div>{display}</div>
          
      </div>
    )
  }
}

export default MyDBSelect