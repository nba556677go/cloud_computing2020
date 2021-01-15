import React from 'react'
import "../styles/Button.css"
class ChartButton extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick= () => {
    /*if (this.state.myColor === 'white') {
      this.setState({ myColor: 'black' })
    } else {
      this.setState({ myColor: 'white' })
    }*/
    window.location.replace("/chart");
  }

  render() {
    return (
      
        <div>
          <button color="primary" type='button' onClick={this.handleClick}>Go To Chart Site</button>
        </div>
    
    )
  }
}

export default ChartButton