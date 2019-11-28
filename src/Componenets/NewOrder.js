import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from "react-bootstrap";
import Spinner from './Spinner';
import {
    exchangeContractSelector,
    tokenContractSelector,
    accountSelector,
    web3Selector,
    buyOrderSelector,
    sellOrderSelector
} from '../redux/selectors';
import {
    buyOrderAmountChanged,
    buyOrderPriceChanged,
    sellOrderAmountChanged,
    sellOrderPriceChanged
} from '../redux/actions';
import {
    makeBuyOrder,
    makeSellOrder
} from '../redux/interactions'

const showForm = (props) => {
    const { dispatch, buyOrder, exchangeContract, tokenContract, web3, account, sellOrder, showBuyTotal, showSellTotal } = props;
    return(
        <Tabs defaultActiveKey='buy' className='bg-dark text-white'>
            <Tab eventKey='buy' title='Buy' className='bg-dark'>
                
            <form onSubmit={event => {
                event.preventDefault();
                makeBuyOrder(dispatch, exchangeContract, tokenContract, web3, buyOrder, account)
            }}>
                <div className='form-group small'>
                    <label>Buy Amount (MEME)</label>
                    <div className='input-group'>
                        <input 
                        type='text'
                        placeholder="Buy Amount"
                        onChange={e => dispatch(buyOrderAmountChanged(e.target.value))}
                        className='form-control form-control-sm bg-dark text-white'
                        required
                        />
                    </div>
                </div>
                <div className='form-group small'>
                    <label>Buy Price</label>
                    <div className='input-group'>
                        <input 
                        type='text'
                        placeholder="Buy Price"
                        onChange={e => {dispatch(buyOrderPriceChanged(e.target.value))}}
                        className='form-control form-control-sm bg-dark text-white'
                        required
                        />
                    </div>
                </div>
                <button type='submit' className='btn btn-primary btn-block btn-sm' >Buy Order</button>
                <small>Total: {showBuyTotal ? buyOrder.price * buyOrder.amount : 0 } ETH</small>
            </form>

            </Tab>

            <Tab eventKey='sell' title='Sell' className='bg-dark'>
                <form onSubmit={event => {
                    event.preventDefault();
                    makeSellOrder(dispatch, exchangeContract, tokenContract, web3, sellOrder, account)
                }}>
                    <div className='form-group small'>
                        <label>Sell Amount (MEME)</label>
                        <div className='input-group'>
                            <input 
                            type='text'
                            placeholder="Sell Amount"
                            onChange={e => dispatch(sellOrderAmountChanged(e.target.value))}
                            className='form-control form-control-sm bg-dark text-white'
                            required
                            />
                        </div>
                    </div>
                    <div className='form-group small'>
                        <label>Sell Price</label>
                        <div className='input-group'>
                            <input 
                            type='text'
                            placeholder="Sell Price"
                            onChange={e => {dispatch(sellOrderPriceChanged(e.target.value))}}
                            className='form-control form-control-sm bg-dark text-white'
                            required
                            />
                        </div>
                    </div>
                    <button type='submit' className='btn btn-primary btn-block btn-sm' >Sell Order</button>
                    <small>Total: {showSellTotal ? sellOrder.price * sellOrder.amount : 0 } ETH</small>
                </form>

            </Tab>
        </Tabs>
    );
};

class NewOrder extends Component {
    render() {
        const { showFormBool } = this.props;
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                    New Order
                </div>
                <div className="card-body">
                    {showFormBool ? showForm(this.props) : <Spinner />}
                </div>
            </div>
        )
    };
};

function mapStateToProps(state) {
    const buyOrder = buyOrderSelector(state);
    const sellOrder = sellOrderSelector(state);
    console.log(buyOrder)
    console.log(sellOrder)
    return {
        web3: web3Selector(state),
        exchangeContract: exchangeContractSelector(state),
        tokenContract: tokenContractSelector(state),
        account: accountSelector(state),
        buyOrder,
        sellOrder,
        showFormBool: !buyOrder.making && !sellOrder.making,
        showBuyTotal: buyOrder.amount && buyOrder.price,
        showSellTotal: sellOrder.amount && sellOrder.price
    }
};

export default connect(mapStateToProps)(NewOrder);
