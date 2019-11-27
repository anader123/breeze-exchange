import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from './Spinner';
import {
    orderBookSelector,
    orderBookLoadedSelector,
    exchangeContractSelector,
    accountSelector,
    orderFillingSelector
} from '../redux/selectors';
import { fillOrder } from '../redux/interactions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderOrder = (order, props) => {
    const { dispatch, exchangeContract, account } = props;
    return(
        <OverlayTrigger
            key={order.id}
            placement='auto'
            overlay={
                <Tooltip id={order.id}>
                    {`Click here to ${order.orderFillAction}`}
                </Tooltip>
            }
        >
            <tr 
                key={order.id}
                className='order-book-order'
                onClick={e => fillOrder(dispatch, exchangeContract, order, account)}
            >
                <td>{order.tokenAmount}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td>{order.etherAmount}</td>
            </tr>
        </OverlayTrigger>
    )
}

const showOrderBook = (props) => {
    const { orderBook } = props;
    return(
        <tbody>
            {orderBook.sellOrders.map(order => renderOrder(order, props))}
            <tr>
                <th>MEME</th>
                <th>MEME/ETH</th>
                <th>ETH</th>
            </tr>
            {orderBook.buyOrders.map(order => renderOrder(order, props))}
        </tbody>
    )
};

class OrderBook extends Component {
    render() {
        const { orderBookLoaded } = this.props;
        return (
            <div className="vertical">
                <div className="card bg-dark text-white">
                <div className="card-header">
                    Order Book
                </div>
                <div className="card-body order-book">
                    <table className='table table-dark table-sm small'>
                        {orderBookLoaded ? showOrderBook(this.props) : <Spinner type='table' />}
                    </table>
                </div>
                </div>
            </div>
        )
    };
};

function mapStateToProps(state) {
    const orderBookLoad = orderBookLoadedSelector(state);
    const orderFilling = orderFillingSelector(state);
    return {
        orderBook: orderBookSelector(state),
        orderBookLoaded: orderBookLoad && !orderFilling,
        exchangeContract: exchangeContractSelector(state),
        account: accountSelector(state)
    }
};

export default connect(mapStateToProps)(OrderBook);
