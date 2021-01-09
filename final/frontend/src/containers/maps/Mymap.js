import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '70%',
  height: '40%'
};

export class MapContainer extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      cords: [
        {lat: 9.96233, lng: 49.80404},
        {lat: 6.11499, lng: 50.76891},
        {lat: 6.80592, lng: 51.53548},
        {lat: 9.50523, lng: 51.31991},
        {lat: 9.66089, lng: 48.70158}
      ]
    }
  }

  showMarkers = () => {
    return this.state.cords.map((store, index) => {
      return <Marker key={index} id={index} position={{
       lat: store.lat,
       lng: store.lng
     }}
     onClick={() => console.log("Clicked")} />
    })
  }

  render() {
    return (
        <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ 
            lat: 9.96233, 
            lng: 49.80404
        }}>
          {this.showMarkers()}
        </Map>
    );
  }
}

export default GoogleApiWrapper({
  //enter your api key here
  apiKey: //enter your api key
})(MapContainer);