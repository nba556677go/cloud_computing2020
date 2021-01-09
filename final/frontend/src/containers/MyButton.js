import React from 'react'

class MyButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { myColor: 'white' }
  }

  handleClick= () => {
    window.location.assign('http://140.112.28.115:5000');
  }

  render() {
    return (
      <div className='my-button'>
        <div>
          <button type='button' onClick={this.handleClick.bind(this)}>Login</button>
        </div>
        <div>
        
          {/*{`${this.props.data.name} is a ${this.props.data.gender} person`}*/}
        </div>
      </div>
    )
  }
}

export default MyButton