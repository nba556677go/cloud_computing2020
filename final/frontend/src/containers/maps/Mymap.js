import React from 'react';
import { Map, GoogleApiWrapper, Marker, Circle } from 'google-maps-react';
import axios from 'axios';
import InfoWindow from './InfoWindow';
import { FaBeer, FaCalculator } from 'react-icons/fa';
import {
  DirectionsRenderer
} from "react-google-maps";

import StationCards from '../../components/StationCards'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'



const mapStyles = {
  height: `1200px`, width: "60vw"
};

export class MapContainer extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},

      liveLat: null,
      liveLng: null, 
      stations: [
        {lat: 25.96233, lng: 112.80404},
      ],

      showDirection: false,
      directionInstructions: null,
      directions: null,

      showNearStations: false,
      near_cords: [],
      
      
    }
  }

  //const getMarker = () =>{}
  componentDidMount() {

    const getMarkers = async () => {
      //get live data
      let res = await axios({
        method: 'get',
        url: `http://140.112.28.115:8800/bikeapi/getmapMarkers?latitude=${this.state.liveLat}&&longtitude=${this.state.liveLng}`
      })
      
      //this.stations = res.data
      console.log("latitude:", this.state.liveLat, this.state.liveLng)
      await this.parseMarkerLocations(res.data)
      console.log(this.state.stations)
      
   
    }
    //get live location
    if ("geolocation" in navigator) {
      console.log("location data available");

      const success = async position => {
        this.setState({liveLat: position.coords.latitude, liveLng: position.coords.longitude}, () => {getMarkers()})
        //await getMarkers();
      }
      const error = () => {
        console.log("get location error, returning to manual setting...");
        this.setState({liveLat: 25.021644799999997, liveLng: 121.5463424}, () => {getMarkers()})
      }
      navigator.geolocation.getCurrentPosition(success, error);
      
    } else {
      console.log("Unable to retrieve your location");
      //using default location
      this.setState({liveLat: 25.021644799999997, liveLng: 121.5463424})
      console.log("Latitude manually set to :", this.state.liveLat);
      console.log("Longitude manually set to :", this.state.liveLng);  
    }

     
  }

  parseMarkerLocations = async (data) => {
    //store max distance of nearest 10 bikes
    this.MaxDistance = data.MaxDistance
    let cordinates = []
    let near_cords = []
    for(let i = 0 ; i < data.latitude.length ; i++){
      let isempty = false
      if(data.availBike[i] == 0 ){
        isempty = true 
      }
      //console.log({"lat" : data.latitude[i], "lng":data.longtitude[i]})
      //x.push(info.info.availBike[i].time)
      cordinates.push({"lat" : data.latitude[i], "lng":data.longtitude[i],
                       "stationID" : data.stationID[i], "stationName": data.stationName[i],
                       "availBike": data.availBike[i], "totalBike": data.totalBike[i],
                       "near" : data.near[i].near, "distance": parseInt(data.near[i].distance), "empty": isempty
                      });
      if (data.near[i].near == 1){
        near_cords.push({"lat" : data.latitude[i], "lng":data.longtitude[i],
                         "stationID" : data.stationID[i], "stationName": data.stationName[i],
                         "availBike": data.availBike[i], "totalBike": data.totalBike[i],
                         "near" : data.near[i].near, "distance": parseInt(data.near[i].distance), "empty": isempty
                        })
      } 
      //console.log(data.near[i].distance)
    }
    
    this.setState({stations: cordinates, showNearStations: true, near_cords: near_cords})
  }
  // map display helper functions
  
  showInfo = () => {
    const content = this.state.selectedPlace.data.map((key, index) =>
      <div key={index}>
        <h3>Key Name: {key}</h3>
      </div>
    )
    return content;
  }

  onMarkerClick = (props, marker) => {
    console.log(props)
    console.log(marker)
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true
    });
    console.log(props.data.lat);
    this.startDirections(props.data.lat, props.data.lng);
    //this.getDirections()
  }

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      });
  };

  //direction mapping 
  parseDirections = (data) => {
    
    console.log(data)
    let display = { start_address : data.routes[0].legs[0].start_address,
               destination :  data.routes[0].legs[0].end_address,
               total_distance : data.routes[0].legs[0].distance.text,
               total_duration : data.routes[0].legs[0].duration.text,
               instructions : []
              }

      
    //console.log(display)
    data.routes[0].legs[0].steps.map((store, index) => {  
        let tmp = document.createElement("DIV");
        tmp.innerHTML = store.instructions;
        let stripped_text = tmp.textContent || tmp.innerText || ""
        //console.log(tmp.textContent || tmp.innerText || "");
        display.instructions.push(`Keep going for ${store.duration.text} (${store.distance.text}), then ${stripped_text}`);
        //display.instructions.push(store.instructions)
      }
    )
    
    console.log(display)
    console.log(data)
    this.setState({showDirection: true, directionInstructions: display, directions: data})
  


  }

  startDirections = (dstLat, dstLng) => {
    const google = this.props.google;
    const directionsService = new google.maps.DirectionsService();
    
    const origin = { lat: this.state.liveLat, lng:  this.state.liveLng};
    const destination = { lat: dstLat, lng:  dstLng};
    
    directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING
        },
        (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                console.log(result)
                this.parseDirections(result);
               
            } else {
                console.error(`error fetching directions ${result}`);
            }
        }
    );
  }
  //directions helpers
  getDirections = async (dstLat, dstLng) => {
    
    //get live data
  
    const res = await axios({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.liveLat},${this.state.liveLng}&destination=${dstLat},${dstLng}&mode=walking&key=AIzaSyCu6EE4kF1ad_hh5pJUU_MW5qjteMLOTy0`
    });
    console.log(res);
    this.parseDirections(res);
  }

//show functions
  
  showMarkers = () => {
  
    return this.state.stations.map((store, index) => {
      
      return <Marker icon={{ url: "./icons/parking_lot_maps.png", origin: {x: 0, y: 0}}} 
        key={index} id={index} position={{
       lat: store.lat,
       lng: store.lng
     }}
     onClick={this.onMarkerClick} name={store.stationName} data={store} availBike={store.availBike} distance={store.distance} lat={store.lat} lng={store.lng}  
     label={{text: String(store.availBike), color: "#F00", fontFamily: "Arial"}} labelOrigin={(0,0)} 
      />
    })
  }
  showDirectionRenderer = () => {
    if (this.state.showDirection){
      return <DirectionsRenderer
              directions={this.state.directions}
             />
    }
  }

  render() {
    //console.log(this.state.directions)

    let directionDisplay = null;
    if (this.state.showDirection){
      /*
      directionDisplay = (
        <div id="footer" class="direction_instruction" style={{ width: '100%'}}>

          <Card>
            <ListGroup variant="flush">
            {this.state.directionInstructions.instructions.map((item, index) => {
                    return <ListGroup.Item style={{textAlign: "center"}}>{item}</ListGroup.Item>;
             })}
            </ListGroup>
          </Card>
        </div>
      );
      */
     directionDisplay = <StationCards data={this.state.directionInstructions.instructions} show={this.state.showDirection}/>;
    }
    //console.log(directions)
    return (
          <div style={{display: 'flex', flexDirection: "row", flexWrap: 'wrap', alignItems: 'stretch'}}>
            <div style={mapStyles}>
            <Map
              google={this.props.google}
              zoom={16}
              style={mapStyles}
              onClick={this.onMapClicked}
              center={{ 
                lat: this.state.liveLat, 
                lng: this.state.liveLng
            }}>
             
              
              <Circle
                radius={this.MaxDistance}
                center={{ 
                  lat: this.state.liveLat, 
                  lng: this.state.liveLng
                }}
            
                strokeColor='transparent'
                strokeOpacity={0}
                strokeWeight={5}
                fillColor='#FFFF00'
                fillOpacity={0.2}
              />

                {this.showMarkers()}
                <Marker icon={"./icons/library_maps.png"} 
                  position={{
                    lat: this.state.liveLat,
                    lng: this.state.liveLng
                  }}
                  onClick={this.onMarkerClick} name="Current" availBike={0} distance={0} lat={this.state.liveLat} lng={this.state.liveLng}
                 
                />
                <InfoWindow
                  marker={this.state.activeMarker}
                  visible={this.state.showingInfoWindow}>
                    <div>
                      {/*{this.showInfo()}*/}
                      <h3>{this.state.selectedPlace.name}</h3>
                      
                      <h5>Available bikes: {this.state.selectedPlace.availBike}</h5>
                      <h5>Distance from you: {this.state.selectedPlace.distance}m</h5>
                      <h6>cordinates:({this.state.selectedPlace.lat}, {this.state.selectedPlace.lng}) </h6>
                      
                      
                    </div>
                </InfoWindow>

                {this.showDirectionRenderer()}
            </Map>
            </div>
            
            {/*<StationCards data={this.state.near_cords} show={this.state.showNearStations}/>*/}

            {directionDisplay}
           
            
        </div>
        
      
    );
  }
}

export default GoogleApiWrapper({
  //enter your api key here
  apiKey: 'AIzaSyCu6EE4kF1ad_hh5pJUU_MW5qjteMLOTy0'
})(MapContainer);


