import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { loadWeb3, loadAccount, loadToken, loadExchange } from './redux/interactions';
import { contractsLoadedSelector } from './redux/selectors';

// Components 
import Navbar from './Componenets/Navbar';
import Dashboard from './Componenets/Dashboard';

class App extends Component {
  constructor() {
    super();

    this.state = {
      walletConnected: false
    }
  }
  loadBlockchainData = async (dispatch) => {
    await window.ethereum.enable();
    const web3 = loadWeb3(dispatch);
    const account = loadAccount(web3, dispatch);
    const networkId = await web3.eth.net.getId();
    this.setState({walletConnected: true});

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
    const { walletConnected } = this.state;
    return (
      <div>
        <Navbar walletConnected={walletConnected} loadBlockchainData={this.loadBlockchainData}/>
        {contractsLoaded ? <Dashboard/> : 
          <div className="content">
            <div className='connect-wallet'>Please connect your wallet to use the exchange.</div>
          </div>}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
};

export default connect(mapStateToProps)(App);