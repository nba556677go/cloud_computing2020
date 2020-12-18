import React from 'react'
import axios from 'axios'
import MyChart, {MyDistrictChart} from '../components/MyChart'


class MyDBSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = { station: 'stationA', show: false, districtData: null,  refresh: true }
    //set all stations
    this.stations = null
    
    //make sure total station list loaded first before rendering the first time
    axios({
      method: 'get',
      url: `http://140.112.28.115:5000/getallChID`
    })
    .then(response => this.stations = response.data.chineseID )
    .then(() => {  this.setState({ refresh: true }) })//nees to call setstate to render page!!!
  }

  // fetch data from our data base
  handleSelect = (e) => {
    axios({
      method: 'get',
      url: `http://140.112.28.115:5000/getdata?id=${e.target.value}`
    })
    .then(response => this.stationData = response.data )
    .then(() => { console.log(this.stationData) })
    .then(() => this.setState({ station: e.target.value, stationData : this.staionData}) )
    .then(() => {
      axios({
        method: 'get',
        url: `http://140.112.28.115:5000/getdistrict?district=${this.stationData.district}`
      })
      .then(response => this.state.districtData = response.data )
      .then(() => { console.log(this.state.districtData) })
      .then(() => this.setState({show: true }) )
    })
   /*
    axios({
      method: 'get',
      url: `http://140.112.28.115:5000/getdistrict?district=${this.state.stationData.district}`
    })
    .then(response => this.districtData = response.data )
    .then(() => { console.log(this.districtData) })
    .then(() => this.setState({show: true }) )
*/


    
  }



  render() {
    let display = null 
    let selectStations = null
    
    if (this.state.show) {
      let props = {
                    district: this.stationData.district,
                    data : this.state.districtData
                  }
      display = (
        <div>
         
          <MyChart info={this.stationData}/>
          
          <MyDistrictChart data={props}/>
         
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