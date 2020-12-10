import React from 'react'

class MyButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { myColor: 'white' }
  }

  handleClick= () => {
    if (this.state.myColor === 'white') {
      this.setState({ myColor: 'black' })
    } else {
      this.setState({ myColor: 'white' })
    }
  }

  render() {
    return (
      <div className='my-button'>
        <div>
          <button type='button' onClick={this.handleClick}>Click Me</button>
        </div>
        <div>
          {this.state.myColor}<br />
          {`${this.props.data.name} is a ${this.props.data.gender} person`}
        </div>
      </div>
    )
  }
}

export default MyButton