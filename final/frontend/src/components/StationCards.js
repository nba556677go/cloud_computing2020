import React from 'react'
import '../styles/StationCards.css'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
export default (data, show) => {
    
    console.log(data);
    if (show){
        let display = (
            
            <Card style={{ width: '100%', marginLeft: ".5vw"}}>
            <Card.Header> <h3>How to go?</h3></Card.Header>
            <ListGroup variant="flush">
            {data.data.map((store, index) => (
                <ListGroup.Item>
                    <b>{store}</b>
                 
                </ListGroup.Item> 
            ))}
            </ListGroup>
            </Card>
            
        );

        return(
            <div className="StationCards">
                {display}
            </div>
        )
           
    
    }
   
}