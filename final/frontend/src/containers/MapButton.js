import React from 'react'

class MapButton extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick= () => {
    /*if (this.state.myColor === 'white') {
      this.setState({ myColor: 'black' })
    } else {
      this.setState({ myColor: 'white' })
    }*/
    window.location.replace("/");
  }

  render() {
    return (
      <div className='map-button'>
        <div>
          <button type='button' onClick={this.handleClick}>Go To Map</button>
        </div>
      </div>
    )
  }
}

export default MapButton