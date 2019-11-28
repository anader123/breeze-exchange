import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import {
    userFilledOrdersLoadedSelector,
    userFilledOrdersSelector,
    userOpenOrdersLoadedSelector,
    userOpenOrdersSelector,
    exchangeContractSelector,
    accountSelector,
    orderCancellingSelector
} from '../redux/selectors';
import { cancelOrder } from '../redux/interactions';
import Spinner from './Spinner';

const showUserFilledOrders = (props) => {
    const { userFilledOrders } = props;
    return(
        <tbody>
            { userFilledOrders.map(order => {
                return(
                    <tr key={order.id}>
                        <td className='text-muted'>{order.formattedTimestamp}</td>
                        <td className={`text-${order.orderTypeClass}`} >{order.orderSign}{order.tokenAmount}</td>
                        <td className={`text-${order.orderTypeClass}`} >{order.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>
    )
};

const showUserOpenOrders = (props) => {
    const { userOpenOrders, dispatch, exchangeContract, account } = props;
    return(
        <tbody>
            { userOpenOrders.map(order => {
                return(
                    <tr key={order.id}>
                        <td className={`text-${order.orderTypeClass}`} >{order.orderSign}{order.tokenAmount}</td>
                        <td className={`text-${order.orderTypeClass}`} >{order.orderSign}{order.tokenPrice}</td>
                        <td 
                            className='text-muted cancel-order'
                            onClick={(e) => {
                                cancelOrder(dispatch, exchangeContract, order, account)
                            }}
                        >X</td>
                    </tr>
                )
            })}
        </tbody>
    )
};

class UserTransactions extends Component {
    render() {
        const { userFilledOrdersLoaded, showingOpenOrdersLoaded } = this.props;
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                    My Transactions
                </div>
                <div className="card-body">
                    <Tabs defaultActiveKey='trades' className='bg-dark text-white'>
                        <Tab eventKey='trades' title='Trades' className='bg-dark'>
                            <table className='table table-dark table-sm small'>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>MEME</th>
                                        <th>MEME/ETH</th>
                                    </tr>
                                </thead>
                                {userFilledOrdersLoaded ? showUserFilledOrders(this.props) : <Spinner type='table' />}
                            </table>
                        </Tab>
                        <Tab eventKey='orders' title='Orders'>
                            <table className='table table-dark table-sm small'>
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>MEME/ETH</th>
                                        <th>Cancel</th>
                                    </tr>
                                </thead>
                                {showingOpenOrdersLoaded ? showUserOpenOrders(this.props) : <Spinner type='table' />}
                            </table>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    };
};

function mapStateToProps(state) {
    const userOpenOrdersLoaded = userOpenOrdersLoadedSelector(state);
    const orderCancelling = orderCancellingSelector(state);
    
    return {
        userFilledOrders: userFilledOrdersSelector(state),
        userFilledOrdersLoaded: userFilledOrdersLoadedSelector(state),
        userOpenOrders: userOpenOrdersSelector(state),
        showingOpenOrdersLoaded: userOpenOrdersLoaded && !orderCancelling,
        exchangeContract: exchangeContractSelector(state),
        account: accountSelector(state)
    }
};

export default connect(mapStateToProps)(UserTransactions);
