import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
  };

  async componentDidMount() {
    // No need to specify 'from' in call as inside react
    // by default it is the selected account in meta mask
    const manager = await lottery.methods.manager().call();

    const players = await lottery.methods.getPlayers().call();

    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager: manager, players: players, balance: balance});
  }

  render() {
    return (
      <div>
          <h2>Lottery Contract</h2>
          <p>This contract is managed by {this.state.manager}</p>
          <p>There are {this.state.players.length} people entered,
              competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>

          <hr/>

          <form>
              <h4>Want to try your luck?</h4>
              <div>
                  <label>
                      Amout of ether to enter
                  </label>
                  <input
                    value={this.state.value}
                    onChange={event => this.setState({value: event.target.value})}
                  />
              </div>
              <button>Enter</button>
          </form>
      </div>
    );
  }
}

export default App;
