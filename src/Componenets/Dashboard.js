import React, { Component } from 'react';
import { accountSelector, exchangeContractSelector } from '../redux/selectors';
import { connect } from 'react-redux';
import { loadAllOrders } from '../redux/interactions';

// Components
import Trades from './Trades';

class Dashboard extends Component {
    componentWillMount() {
        this.loadBlockchainData(this.props.dispatch);
    };

    async loadBlockchainData(dispatch) {
        await loadAllOrders(this.props.exchangeContract, dispatch);
    };

    render() {
        return (
            <div>
                <div className="content">
                    <div className="vertical-split">
                        <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                        </div>
                        <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                        </div>
                    </div>
                    <div className="vertical">
                        <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                        </div>
                    </div>
                    <div className="vertical-split">
                        <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                        </div>
                        <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                        </div>
                    </div>
                    <Trades />
                </div>
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        account: accountSelector(state),
        exchangeContract: exchangeContractSelector(state)
    }
};

export default connect(mapStateToProps)(Dashboard);
