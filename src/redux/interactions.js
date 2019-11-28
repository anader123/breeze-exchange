import Web3 from 'web3';
import { 
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded,
    orderCancelling,
    orderCancelled,
    orderFilling,
    orderFilled,
    etherBalanceLoaded,
    tokenBalanceLoaded,
    exchangeEtherBalanceLoaded,
    exchangeTokenBalanceLoaded,
    balancesLoaded,
    balancesLoading,
    buyOrderMaking,
    sellOrderMaking,
    orderMade
} from './actions';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import { ETHER_ADDRESS } from '../helpers';

export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    dispatch(web3Loaded(web3));
    return web3;
};

export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(web3AccountLoaded(account));
    return account;
};

export const loadToken = async (web3, networkId, dispatch) => {
    try {
        const tokenContract = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
        dispatch(tokenLoaded(tokenContract));
        return tokenContract;
    } catch(error) {
        console.log('Contract not deployed to the current nework.');
        return null;
    }
};

export const loadExchange = async (web3, networkId, dispatch) => {
    try {
        const exchangeContract = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
        dispatch(exchangeLoaded(exchangeContract));
        return exchangeContract;
    } catch(error) {
        console.log('Contract not deployed to the current nework.');
        return null;
    }
};

export const loadAllOrders = async (exchangeContract, dispatch) => {
    // Cancelled Orders
    const cancelStream = await exchangeContract.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' });
    const cancelledOrders = cancelStream.map(event => event.returnValues);
    dispatch(cancelledOrdersLoaded(cancelledOrders));

    // Filled Orders
    const tradeStream = await exchangeContract.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' });
    const filledOrders = tradeStream.map(event => event.returnValues);
    dispatch(filledOrdersLoaded(filledOrders));

    // All Orders
    const orderStream = await exchangeContract.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest'});
    const allOrders = orderStream.map(event => event.returnValues);
    console.log(allOrders, 'allOrders')
    dispatch(allOrdersLoaded(allOrders));
};

export const subscribeToEvents = async (exchangeContract, dispatch) => {
    exchangeContract.events.Cancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues));
    });
    exchangeContract.events.Trade({}, (error, event) => {
        dispatch(orderFilled(event.returnValues));
    });
    exchangeContract.events.Deposit({}, (error, event) => {
        dispatch(balancesLoaded());
    });
    exchangeContract.events.Withdraw({}, (error, event) => {
        dispatch(balancesLoaded());
    });
    exchangeContract.events.Order({}, (error, event) => {
        dispatch(orderMade(event.returnValues));
    });
};

export const cancelOrder = (dispatch, exchangeContract, order, account) => {
    exchangeContract.methods.cancelOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(orderCancelling())
    })
    .on('error', (error => {
        console.log(error);
        window.alert('There was an error!')
    }))
};

export const fillOrder = (dispatch, exchangeContract, order, account) => {
    exchangeContract.methods.fillOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(orderFilling())
    })
    .on('error', (error => {
        console.log(error);
        window.alert('There was an error!')
    }))
};

export const loadBalances = async (dispatch, web3, exchangeContract, tokenContract, account) => {
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance));

    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(tokenBalance));

    const exchangeEtherBalance = await exchangeContract.methods.balanceOf(ETHER_ADDRESS, account).call();
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance));

    const exchangeTokenBalance = await exchangeContract.methods.balanceOf(tokenContract.options.address, account).call();
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance));

    dispatch(balancesLoaded());
};

export const depositEther = (dispatch, exchangeContract, web3, amount, account ) => {
    const weiAmount = web3.utils.toWei(amount, 'ether');
    exchangeContract.methods.depositEther.send({ from: account, value: weiAmount })
    .on('transactionHash', (hash) => {
        dispatch(balancesLoading());
    })
    .on('error', error => {
        console.log(error);
        window.alert('There was an error');
    })
};

export const withdrawEther = (dispatch, exchangeContract, web3, amount, account ) => {
    const weiAmount = web3.utils.toWei(amount, 'ether');
    exchangeContract.methods.withdrawEther(weiAmount).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(balancesLoading());
    })
    .on('error', error => {
        console.log(error);
        window.alert('There was an error');
    })
};

export const depositToken = (dispatch, exchangeContract, web3, tokenContract, amount, account ) => {
    const weiAmount = web3.utils.toWei(amount, 'ether');
    tokenContract.methods.approve(exchangeContract.options.address, weiAmount).send({ from: account })
    .on('transactionHash', (hash) => {
        exchangeContract.methods.depositToken(tokenContract.options.address, weiAmount).send({ from: account })
        .on('transactionHash', (hash) => {
            dispatch(balancesLoading());
        })
    })
    .on('error', error => {
        console.log(error);
        window.alert('There was an error');
    })
};

export const withdrawToken = (dispatch, exchangeContract, web3, tokenContract, amount, account ) => {
    const tokenContractAddress = tokenContract.options.address;
    const weiAmount = web3.utils.toWei(amount, 'ether');
    exchangeContract.methods.withdrawToken(tokenContractAddress, weiAmount).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(balancesLoading());
    })
    .on('error', error => {
        console.log(error);
        window.alert('There was an error');
    })
};

export const makeBuyOrder = (dispatch, exchangeContract, tokenContract, web3, order, account) => {
    console.log(order)
    const tokenGet = tokenContract.options.address;
    const amountGet = web3.utils.toWei(order.amount, 'ether');
    const tokenGive = ETHER_ADDRESS;
    const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether');

    exchangeContract.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(buyOrderMaking())
    })
    .on('error', (error) => {
        console.log(error);
        window.alert('There was an error')
    })
};

export const makeSellOrder = (dispatch, exchangeContract, tokenContract, web3, order, account) => {
    const tokenGet = ETHER_ADDRESS;
    const amountGet = web3.utils.toWei((order.amount * order.price).toString(), 'ether');
    const tokenGive = tokenContract.options.address;
    const amountGive = web3.utils.toWei(order.amount, 'ether');

    exchangeContract.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
    .on('transactionHash', (hash) => {
        dispatch(sellOrderMaking())
    })
    .on('error', (error) => {
        console.log(error);
        window.alert('There was an error')
    })
};