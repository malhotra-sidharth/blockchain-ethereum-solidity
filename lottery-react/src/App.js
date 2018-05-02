import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {manager: ''};
  }
  async componentDidMount() {
    // No need to specify 'from' in call as inside react
    // by default it is the selected account in meta mask
    const manager = await lottery.methods.manager().call();

    this.setState({manager: manager});
  }

  render() {
    return (
      <div>
          <h2>Lottery Contract</h2>
          <p>This contract is managed by {this.state.manager}</p>
      </div>
    );
  }
}

export default App;
