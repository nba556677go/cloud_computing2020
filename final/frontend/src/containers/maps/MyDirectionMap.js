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




class Map extends Component {

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
          //directions
          directions: null,
        }
    }
    startDirection = () => {
        const directionsService = new google.maps.DirectionsService();

        const origin = { lat: 25.021644799999997, lng:  121.5463424 };
        const destination = { lat: 25.028679, lng:  121.55932};

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.WALKING
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    console.log(result)
                    this.setState({
                        directions: result
                    });
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }

    componentDidMount() {
        this.startDirection()
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
        console.log(this.MaxDistance)
        let cordinates = []
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
          //console.log(data.near[i].distance)
        }
        
        this.setState({stations: cordinates})
    }

    // map display helper functions
    showMarkers = (props) => {
        return this.state.stations.map((store, index) => {
          return <Marker key={index} id={index} position={{
            lat: store.lat,
            lng: store.lng
            }}
            onClick={props.onToggleOpen}
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
    
      onMarkerClick = (props, marker) => {
        this.setState({
          activeMarker: marker,
          selectedPlace: props,
          showingInfoWindow: true
        });
        console.log(this.state.selectedPlace)
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

              const MapWithAMakredInfoWindow = compose(
                withStateHandlers(() => ({
                  isOpen: false,
                }), {
                  onToggleOpen: ({ isOpen }) => () => ({
                    isOpen: !isOpen,
                  })
                }),
                
                withGoogleMap
              )(props =>
                <GoogleMap
                  defaultZoom={8}
                  defaultCenter={{ lat: 25.021644799999997, lng: 121.5463424}}
                >
                  {this.showMarkers(props)}
               

                  <DirectionsRenderer
                          directions={this.state.directions}
                  />
                </GoogleMap>
              );
      
              const GoogleMapExample = withGoogleMap(props => (
                  <GoogleMap
                      defaultCenter={{ lat: 25.021644799999997, lng:  121.5463424 }}
                      defaultZoom={13}
                  >
                      {this.showMarkers()}
                  

                      <DirectionsRenderer
                          directions={this.state.directions}
                      />
                  </GoogleMap>
              ));

              return (
                  <div>
                      <MapWithAMakredInfoWindow
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCu6EE4kF1ad_hh5pJUU_MW5qjteMLOTy0"
                        containerElement={<div style={{ height: `1200px`, width: "1500px" }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                      />
                  </div>


              );
    }
}

export default Map;