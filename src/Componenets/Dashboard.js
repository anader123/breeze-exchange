import React, { Component } from 'react';
import { accountSelector, exchangeContractSelector } from '../redux/selectors';
import { connect } from 'react-redux';
import { loadAllOrders, subscribeToEvents } from '../redux/interactions';

// Components
import Trades from './Trades';
import OrderBook from './OrderBook';
import UserTransactions from './UserTransactions';
import PriceChart from './PriceChart';
import Balance from './Balance';
import NewOrder from './NewOrder'

class Dashboard extends Component {
    componentWillMount() {
        this.loadBlockchainData();
    };

    async loadBlockchainData() {
        const { exchangeContract, dispatch } = this.props;
        await loadAllOrders(exchangeContract, dispatch);
        await subscribeToEvents(exchangeContract, dispatch)
    };

    render() {
        return (
            <div>
                <div className="content">
                    <div className="vertical-split">
                        <Balance />
                        <NewOrder />
                    </div>
                    <OrderBook />
                    <div className="vertical-split">
                        <PriceChart />
                        <UserTransactions />
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
