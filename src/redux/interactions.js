import Web3 from 'web3';
import { 
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded
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