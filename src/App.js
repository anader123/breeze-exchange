import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { loadWeb3, loadAccount, loadToken, loadExchange } from './redux/interactions';
import { contractsLoadedSelector } from './redux/selectors';

// Components 
import Navbar from './Componenets/Navbar';
import Dashboard from './Componenets/Dashboard';

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch);
  }; 

  async loadBlockchainData(dispatch) {
    await window.ethereum.enable();
    const web3 = loadWeb3(dispatch);
    const account = loadAccount(web3, dispatch);
    const networkId = await web3.eth.net.getId();

    // Initialzing Contracts
    const tokenContract = await loadToken(web3, networkId, dispatch);
    const exchangeContract = await loadExchange(web3, networkId, dispatch);

    if(!tokenContract) {
      window.alert('Token smart not detected on the current network')
    };
    if(!exchangeContract) {
      window.alert('Token smart not detected on the current network')
    };
    
  };

  render() {
    const { contractsLoaded } = this.props;
    return (
      <div>
        <Navbar/>
        {contractsLoaded ? <Dashboard/> : <div className="content" />}
      </div>
    );
  }
};

function mapStateToProps(state) {
  console.log(contractsLoadedSelector(state))
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
};

export default connect(mapStateToProps)(App);