import React from "react";
import { withScriptjs } from "react-google-maps";
import { WindowOpener } from "./window-opener";
import NavBar from './../components/NavBar'
import MySelect from './../components/MySelect'
import MyButton from './MyButton'
import MyDBSelect from './MyDBSelect'
import Map from './maps/MyDirectionMap'

import MapContainer from "./maps/Mymap";

export class Home extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            message: "", islogin : false, login_data: null
        }
        this.sonResponse = this.sonResponse.bind(this);
    }


    sonResponse (err, res) {
        if (err) {
            this.setState({ message: res })
        }
        this.setState({ message: res })
        console.log(this.state.message)
    }
    
    
    
    render () {
        const {message} = this.state;
        //const MapLoader = withScriptjs(Map);
        
        //const MapLoader = withScriptjs(MapContainer);        
        return (
            <div>

                
                <NavBar />

                <MapContainer />  
                {/*<Map />*/}      
                    {/*      
                <MapLoader
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCu6EE4kF1ad_hh5pJUU_MW5qjteMLOTy0"
                    loadingElement={<div style={{ height: `100%` }} />}
                   
                    />  */} 
             
                

               
                
            </div>
        )
    }
}
