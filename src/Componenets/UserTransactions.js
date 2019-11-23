import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import {
    userFilledOrdersLoadedSelector,
    userFilledOrdersSelector,
    userOpenOrdersLoadedSelector,
    userOpenOrdersSelector
} from '../redux/selectors';
import Spinner from './Spinner';

const showUserFilledOrders = (userfilledOrders) => {
    return(
        <tbody>
            { userfilledOrders.map(order => {
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

const showUserOpenOrders = (userfilledOrders) => {
    return(
        <tbody>
            { userfilledOrders.map(order => {
                return(
                    <tr key={order.id}>
                        <td className='text-muted'>{order.formattedTimestamp}</td>
                        <td className={`text-${order.orderTypeClass}`} >{order.orderSign}{order.tokenAmount}</td>
                        <td className='text-muted' >x</td>
                    </tr>
                )
            })}
        </tbody>
    )
};

class UserTransactions extends Component {
    render() {
        const { userFilledOrdersLoaded, userOpenOrdersLoaded, userFilledOrders, userOpenOrders } = this.props;
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
                                {userFilledOrdersLoaded ? showUserFilledOrders(userFilledOrders) : <Spinner type='table' />}
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
                                {userOpenOrdersLoaded ? showUserOpenOrders(userOpenOrders) : <Spinner type='table' />}
                            </table>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    };
};

function mapStateToProps(state) {
    return {
        userFilledOrders: userFilledOrdersSelector(state),
        userFilledOrdersLoaded: userFilledOrdersLoadedSelector(state),
        userOpenOrders: userOpenOrdersSelector(state),
        userOpenOrdersLoaded: userOpenOrdersLoadedSelector(state)
    }
};

export default connect(mapStateToProps)(UserTransactions);
