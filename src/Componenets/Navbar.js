import React, { Component } from 'react';
import { accountSelector } from '../redux/selectors';
import { connect } from 'react-redux';
import windPhoto from '../../src/wind-icon.png';

class Navbar extends Component {
    render() {
        const { account, loadBlockchainData, dispatch, walletConnected } = this.props;
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <a className="navbar-brand" 
                        href="https://github.com/anader123/breeze-exchange" 
                        target="_blank" 
                        rel="noopener noreferrer">Breeze Exchange</a>
                    <img className='wind-img' alt='wind' src={windPhoto} />
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ml-auto">
                        {!walletConnected 
                        ? 
                        <button className="btn btn-primary" type="button" onClick={() => loadBlockchainData(dispatch)}>Connect Wallet</button>
                        :
                        <li className="nav-item">
                            <a className="nav-link small" 
                                href={`https://ropsten.etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {account}
                            </a>
                        </li>
                        }
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        account: accountSelector(state)
    }
};

export default connect(mapStateToProps)(Navbar);
