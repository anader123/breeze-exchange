import { get } from 'lodash';
import { createSelector } from 'reselect';
import { ETHER_ADDRESS, tokens, ether, GREEN, RED } from '../helpers';
import moment from 'moment';

const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);

const tokenLoaded = state => get(state, 'token.loaded', false);
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl);

const exchangeLoaded = state => get(state, 'exchange.loaded', false);
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el);

const exchangeContract = state => get(state, 'exchange.contract');
export const exchangeContractSelector = createSelector(exchangeContract, ec => ec);

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
);

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false);
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);

const filledOrders = state => get(state, 'exchange.filledOrders.data', []);
export const filledOrdersSelector = createSelector(
    filledOrders,
    
    (orders) => {
        orders = orders.sort((a, b) => a.timestamp - b.timestamp);
        orders = decorateFilledOrders(orders);
        orders = orders.sort((a, b) => b.timestamp - a.timestamp);
        return orders;
    }
);

const decorateFilledOrders = (orders) => {
    let previousOrder = orders[0]; 

    return(
        orders.map(order => {
            order = decorateOrder(order);
            order = decorateFilledOrder(order, previousOrder);
            previousOrder = order;
            return order;
        })
    )
};

const decorateOrder = (order) => {
    let etherAmount;
    let tokenAmount;

    if(order.tokenGive === ETHER_ADDRESS) {
        etherAmount = order.amountGive;
        tokenAmount = order.amountGet;
    }
    else {
        etherAmount = order.amountGet;
        tokenAmount = order.amountGive;
    }

    let tokenPrice = (etherAmount / tokenAmount);
    const precision = 100000;
    tokenPrice = Math.round(tokenPrice * precision) / precision;

    return({
        ...order,
        etherAmount: ether(etherAmount),
        tokenAmount: tokens(tokenAmount),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ss a M/D')
    })
};

const decorateFilledOrder = (order, previousOrder) => {

    return({
        ...order,
        tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
    })
};

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
    if(previousOrder.id === orderId) {
        return GREEN;
    }

    if(previousOrder.tokenPrice <= tokenPrice) {
        return GREEN;
    }
    else {
        return RED;
    }
};