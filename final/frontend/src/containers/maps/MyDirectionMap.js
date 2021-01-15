/*global google*/
import React, { Component } from "react";
import { FaBeer } from 'react-icons/fa';


import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    DirectionsRenderer,
    InfoWindow
} from "react-google-maps";
import axios from 'axios';
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { compose, withProps, withStateHandlers } = require("recompose");


/********************************************************************************************************************/
/********************************HELPER FUNCTIONS ******************************************************************/
async function getMarkers () {
  //get live data
  let res = await axios({
    method: 'get',
    url: `http://140.112.28.115:8800/bikeapi/getmapMarkers?latitude=25.021644799999997&&longtitude=121.5463424`
  })
  
  let stations, near_cord, maxDistance = await parseMarkerLocations(res.data)
  console.log(stations)
  return stations, near_cord, maxDistance
}

async function parseMarkerLocations(data) {
  //store max distance of nearest 10 bikes
  
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
  return cordinates, near_cords, data.MaxDistance
  //this.setState({stations: cordinates, showNearStations: true, near_cords: near_cords})
}


function showMarkers (stations){
  
  return stations.map((store, index) => {
    return <Marker key={index} id={index} position={{
      lat: store.lat,
      lng: store.lng
      }}
      onClick={this.onMarkerClick({store})}
      name={store.stationName} data={store} availBike={store.availBike} distance={store.distance}
     >

     </Marker> 
    
  })
}
/********************************************************************************************************************/
//let [stations, near_cord, maxDistance] = getMarkers()
//https://github.com/tomchentw/react-google-maps/issues/220

const CreateMap = (props) => {  
  console.log(props)
  return (
    <GoogleMap
        ref={props.onMapLoad}
        onClick={props.onMapClick}
        defaultZoom={13}
        deaultCenter={{lat: 25.021644799999997, lng: 121.5463424}}>
     
    </GoogleMap >
  )
}
const WrappedMap =  withScriptjs(withGoogleMap(props =>  { 
                          console.log(props.markerClicked);
                          console.log(props);
                          if (props.stations.length)
                          return (
                          <GoogleMap
                              defaultCenter={props.LiveLatLng}
                              zoom={13}
                              center={{lat: 25.021644799999997, lng: 121.5463424}}
                              >
                              {Map.showMarkers(props.stations, props.markerClicked)}
                              
                            </GoogleMap >
                          );
                        }
                     )
                    )


class Map extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
          showingInfoWindow: false,
          activeMarker: {},
          selectedPlace: {},
    
          liveLat: null,
          liveLng: null, 
          stations: [//init station
            {lat: 25.96233, lng: 112.80404, 
            stationID: -1, stationName: "init",
            totalBike: 0, availBike: 0,
            near: 0, distance: -1, 
            empty: false},
          ],
    
          showDirection: false,
          directionInstructions: null,
          directions: null,
    
          showNearStations: false,
          near_cords: [],

        }
    }
    startDirections = (dstLat, dstLng) => {
     
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
  
  //shouldComponentUpdate(nextProps,nextState) {
  //  return false;
  //}
    componentDidMount() {
        

        console.log("run didmount")
        //this.startDirections(25.021644799999997, 121.5463424)
        //const : method, not variable!(more like function)
        const getMarkers = async () => {
            //get live data
            let res = await axios({
              method: 'get',
              url: `http://140.112.28.115:8800/bikeapi/getmapMarkers?latitude=${this.state.liveLat}&&longtitude=${this.state.liveLng}`
            })
            
            //this.stations = res.data
            console.log("live latitude:", this.state.liveLat,"longtitude:",  this.state.liveLng)
            try{
              await this.parseMarkerLocations(res.data)
            }
            catch (err){
              console.log("parseMarker error" + err)
            }
            finally{
              console.log(this.state.stations)
            }
            
            
         
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
            this.setState({liveLat: 25.021644799999997, liveLng: 121.5463424}, () => {getMarkers()})
            console.log("Latitude manually set to :", this.state.liveLat);
            console.log("Longitude manually set to :", this.state.liveLng);
              
          }
          
    }
    shouldComponentUpdate(nextProps, nextState) {
      //console.log(nextState)
      if(this.state.stations === nextState.stations && this.state.selectedPlace === nextState.selectedPlace){
        return false
      }else{
        return true
      }
      // If shouldComponentUpdate returns false, 
      // then render() will be completely skipped until the next state change.
      // In addition, componentWillUpdate and componentDidUpdate will not be called. 
      
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
        this.MaxDistance = data.MaxDistance
        this.setState({stations: cordinates, showNearStations: true, near_cords: near_cords})
    }

    // map display helper functions
    static showMarkers = (markers, handleClick) => {
        console.log(handleClick)
        return markers.map((store, index) => {
          //console.log(store)
          return <Marker key={index} id={index} position={{
            lat: store.lat,
            lng: store.lng
            }}
            onClick={handleClick(store)}
            name={store.stationName} data={store} availBike={store.availBike} distance={store.distance}
           >

           </Marker> 
          
        })
    }

    showInfo = () => {
        const content = this.state.selectedPlace.data.map((key, index) =>
          <div key={index}>
            <h3>Key Name: {key}</h3>
          </div>
        )
        return content;
      }

    handleMapLoad(map) {
        this._map = map;
    }

    handleMapClick(event) {
        console.log(event);
    }

    onMarkerClick = (currentMarker) => {
      //console.log(props)
      //console.log(currentMarker)
      //console.log(props.store.lat, props.store.lng)
      this.setState({
        activeMarker: currentMarker,  
        selectedPlace: currentMarker,
        showingInfoWindow: true
      });
      console.log(this.state.selectedPlace)
      //this.startDirections(props.store.lat, props.store.lng);
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

    render() {
              //console.log(this.props)
              
              const MapWithAMakredInfoWindow = compose(
                withStateHandlers(() => ({
                  isOpen: false,
                }), {
                  onToggleOpen: ({ isOpen }) => () => ({
                    isOpen: !isOpen,
                  })
                }),
                withScriptjs,
                withGoogleMap
              )(props =>
                { 
                  console.log(this);
                  return (
                    <GoogleMap
                      defaultZoom={8}
                      defaultCenter={{ lat: 25.021644799999997, lng: 121.5463424}}
                    >
                      {this.showMarkers(props)}
                  

                      <DirectionsRenderer
                              directions={this.state.directions}
                      />
                    </GoogleMap>
                  )
                }
              );
              
              
              
              return (
                  <div id="map">
                      <WrappedMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCu6EE4kF1ad_hh5pJUU_MW5qjteMLOTy0"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `1200px`, width: "1500px" }} />}
                        mapElement={<div id="mapElement" style={{ height: `100%` }} />}
                        stations={this.state.stations}
                        markerClicked={this.onMarkerClick}
                        LiveLatLng={{ lat: this.state.liveLat, lng: this.state.liveLng}}
                        
                      />
                  </div>


              );
            
    }
}

export default Map;