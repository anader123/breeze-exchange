import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from './Spinner';
import {
    orderBookSelector,
    orderBookLoadedSelector
} from '../redux/selectors';

const renderOrder = (order) => {
    return(
        <tr key={order.id}>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td>{order.etherAmount}</td>
        </tr>
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
    return {
        orderBook: orderBookSelector(state),
        orderBookLoaded: orderBookLoadedSelector(state)
    }
};

export default connect(mapStateToProps)(OrderBook);
