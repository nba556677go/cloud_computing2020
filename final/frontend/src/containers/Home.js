import React from "react";

import { WindowOpener } from "./window-opener";
import NavBar from './../components/NavBar'
import MySelect from './../components/MySelect'
import MyButton from './MyButton'
import MyDBSelect from './MyDBSelect'

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
        return (
            <div>
                <NavBar />
                {/*<MySelect />*/}
                {/*<MyButton />*/}
                <MapContainer />
                <WindowOpener
                        url="http://140.112.28.115:5000"
                        bridge={this.sonResponse}
                    >
                        Login
                </WindowOpener>
                <MyDBSelect />

               
                
            </div>
        )
    }
}
