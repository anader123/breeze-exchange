import React, { Component } from 'react';
import { accountSelector } from '../redux/selectors';
import { connect } from 'react-redux';

class Navbar extends Component {
    render() {
        const { account } = this.props;
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <a className="navbar-brand" href="/#">Breeze Exchange</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link small" 
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {account}
                            </a>
                        </li>
                        {/* <li className="nav-item">
                            <a className="nav-link" href="/#">Link 2</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/#">Link 3</a>
                        </li> */}
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
