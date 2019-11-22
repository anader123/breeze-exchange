import Web3 from 'web3';
import { 
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded
} from './actions';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

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
    console.log('hit')
    dispatch(allOrdersLoaded(allOrders));
};
