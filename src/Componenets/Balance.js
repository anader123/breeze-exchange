import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    loadBalances,
    depositEther,
    withdrawEther,
    depositToken,
    withdrawToken
} from '../redux/interactions';
import {
    web3Selector,
    exchangeContractSelector,
    tokenContractSelector,
    accountSelector,
    etherBalanceSelector,
    tokenBalanceSelector,
    ExchangeEtherBalanceSelector,
    ExchangeTokenBalanceSelector,
    balancesLoadingSelector,
    etherDepositAmountSelector,
    etherWithdrawAmountSelector,
    tokenDepositAmountSelector,
    tokenWithdrawAmountSelector
} from '../redux/selectors';
import { etherDepositAmountChanged, etherWithdrawAmountChanged, tokenDepositAmountChanged, tokenWithdrawAmountChanged } from '../redux/actions';

// Components 
import Spinner from './Spinner';
import { Tabs, Tab } from 'react-bootstrap'; 

const showForm = (props) => {
    const { etherBalance, tokenBalance, exchangeEtherBalance, exchangeTokenBalance, dispatch, etherDepositAmount, web3, tokenContract, account, exchangeContract, etherWithdrawAmount, tokenWithdrawAmount, tokenDepositAmount } = props;
    return(
        <Tabs defaultActiveKey='deposit' className='db-dark text-white'>
            <Tab eventKey='deposit' title='Deposit' className='bg-dark'>
                <table className='table table-dark table-sm small'>
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>

                <form className='row' onSubmit={event => {
                    event.preventDefault();
                    depositEther(dispatch, exchangeContract, web3, etherDepositAmount, account)
                }}>
                    <div className='col-12 col-sm pr-sm-2'>
                        <input 
                        type='text'
                        placeholder="ETH Amount"
                        onChange={e => dispatch(etherDepositAmountChanged(e.target.value))}
                        className='form-control form-control-sm bg-dark text-white'
                        required
                        />
                    </div>
                    <div className='col-12 col-sm-auto pl-sm-0'>
                        <button type='submit' className='btn btn-primary btn-block btn-sm' >Deposit</button>
                    </div>
                </form>

                <table className='table table-dark table-sm small'>
                    <tbody>
                        <tr>
                            <td>MEME</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>

                <form className='row' onSubmit={event => {
                    event.preventDefault();
                    depositToken(dispatch, exchangeContract, web3, tokenContract, tokenDepositAmount, account)
                }}>
                    <div className='col-12 col-sm pr-sm-2'>
                        <input 
                        type='text'
                        placeholder="Token Amount"
                        onChange={e => dispatch(tokenDepositAmountChanged(e.target.value))}
                        className='form-control form-control-sm bg-dark text-white'
                        required
                        />
                    </div>
                    <div className='col-12 col-sm-auto pl-sm-0'>
                        <button type='submit' className='btn btn-primary btn-block btn-sm' >Deposit</button>
                    </div>
                </form>

            </Tab>
            <Tab eventKey='withdraw' title='Withdraw' className='bg-dark'>
            <table className='table table-dark table-sm small'>
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>

                <form className='row' onSubmit={event => {
                    event.preventDefault();
                    withdrawEther(dispatch, exchangeContract, web3, etherWithdrawAmount, account)
                }}>
                    <div className='col-12 col-sm pr-sm-2'>
                        <input 
                        type='text'
                        placeholder="ETH Amount"
                        onChange={e => dispatch(etherWithdrawAmountChanged(e.target.value))}
                        className='form-control form-control-sm bg-dark text-white'
                        required
                        />
                    </div>
                    <div className='col-12 col-sm-auto pl-sm-0'>
                        <button type='submit' className='btn btn-primary btn-block btn-sm' >Withdraw</button>
                    </div>
                </form>

                <table className='table table-dark table-sm small'>
                    <tbody>
                        <tr>
                            <td>MEME</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>

                <form className='row' onSubmit={event => {
                    event.preventDefault();
                    withdrawToken(dispatch, exchangeContract, web3, tokenContract, tokenWithdrawAmount, account)
                }}>
                    <div className='col-12 col-sm pr-sm-2'>
                        <input 
                        type='text'
                        placeholder="Token Amount"
                        onChange={e => dispatch(tokenWithdrawAmountChanged(e.target.value))}
                        className='form-control form-control-sm bg-dark text-white'
                        required
                        />
                    </div>
                    <div className='col-12 col-sm-auto pl-sm-0'>
                        <button type='submit' className='btn btn-primary btn-block btn-sm' >Withdraw</button>
                    </div>
                </form>

            </Tab>
        </Tabs>
    )
};

class Balance extends Component {
    componentWillMount() {
        this.loadBlockchainData();
    };

    async loadBlockchainData() {
        const { dispatch, web3, exchangeContract, tokenContract, account } = this.props;
        await loadBalances(dispatch, web3, exchangeContract, tokenContract, account)
    };

    render() {
        const { showFormBool } = this.props;
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Balance
                </div>
                <div className="card-body">
                    { showFormBool ? showForm(this.props) : <Spinner /> }
                </div>
            </div>
        )
    };
};

function mapStateToProps(state) {
    const balancesLoading = balancesLoadingSelector(state);

    return {
        web3: web3Selector(state),
        exchangeContract: exchangeContractSelector(state),
        tokenContract: tokenContractSelector(state),
        account: accountSelector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceSelector(state),
        exchangeEtherBalance: ExchangeEtherBalanceSelector(state),
        exchangeTokenBalance: ExchangeTokenBalanceSelector(state),
        balancesLoading,
        showFormBool: !balancesLoading,
        etherDepositAmount: etherDepositAmountSelector(state),
        etherWithdrawAmount: etherWithdrawAmountSelector(state),
        tokenDepositAmount: tokenDepositAmountSelector(state),
        tokenWithdrawAmount: tokenWithdrawAmountSelector(state),
    };
};

export default connect(mapStateToProps)(Balance);