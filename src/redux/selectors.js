import { get, reject, groupBy, maxBy, minBy } from 'lodash';
import { createSelector } from 'reselect';
import { ETHER_ADDRESS, tokens, ether, GREEN, RED, formatBalance } from '../helpers';
import moment from 'moment';

const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);

const web3 = state => get(state, 'web3.connection');
export const web3Selector = createSelector(web3, w => w);

const tokenLoaded = state => get(state, 'token.loaded', false);
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl);

const tokenContract = state => get(state, 'token.contract');
export const tokenContractSelector = createSelector(tokenContract, tc => tc);

const exchangeLoaded = state => get(state, 'exchange.loaded', false);
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el);

const exchangeContract = state => get(state, 'exchange.contract');
export const exchangeContractSelector = createSelector(exchangeContract, ec => ec);

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
);

// All Orders
const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false);
const allOrders = state => get(state, 'exchange.allOrders.data', []);

// Cancelled Orders
const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false);
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded);
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
export const cancelledOrdersSelector = createSelector(cancelledOrders, o => o);

// Filled Orders
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

const openOrders = state => {
    const all = allOrders(state);
    const cancelled = cancelledOrders(state);
    const filled = filledOrders(state);

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some( o => o.id === order.id);
        const orderCancelled = cancelled.some( o => o.id === order.id);
        return(orderFilled || orderCancelled);
    });

    return openOrders;
};

const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state);
export const orderBookLoadedSelector = createSelector(orderBookLoaded, loaded => loaded);

// Create order book
export const orderBookSelector = createSelector(
    openOrders,
    (orders) => {
        orders = decorateOrderBookOrders(orders);
        orders = groupBy(orders, 'orderType');
        // Buy Orders
        const buyOrders = get(orders, 'buy', []);
        orders = {
            ...orders,
            buyOrders: buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }

        // Sell Orders
        const sellOrders = get(orders, 'sell', []);
        orders = {
            ...orders,
            sellOrders: sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }
        return orders;
    }
);

const decorateOrderBookOrders = (orders) => {
    return(
        orders.map(order => {
            order = decorateOrder(order);
            order = decorateOrderBookOrder(order);
            return(order);
        })
    );
};

const decorateOrderBookOrder = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillAction: orderType === 'buy' ? 'sell' : 'buy'
    });
};

export const userFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);

export const userFilledOrdersSelector = createSelector(
    account,
    filledOrders,
    (account, orders) => {
        orders = orders.filter(o => o.user === account || o.userFill === account);
        orders = orders.sort((a, b) => a.timestamp - b.timestamp);
        orders = decorateUserFilledOrders(orders, account);
        return orders;
    }
);

const decorateUserFilledOrders = (orders, account) => {
    return(
        orders.map(order => {
            order = decorateOrder(order);
            order = decorateUserFilledOrder(order, account);
            return(order);
        })
    );
};

const decorateUserFilledOrder = (order, account) => {
    const userOrder = order.user === account;

    let orderType;
    if(userOrder) {
        orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    } else {
        orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy';
    }

    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderSign: (orderType === 'buy' ? '+' : '-')
    })
};

export const userOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded);

export const userOpenOrdersSelector = createSelector(
    account,
    openOrders,
    (account, orders) => {
        orders = orders.filter(o => o.user === account);
        orders = decorateUserOpenOrders(orders);
        orders = orders.sort((a, b) => b.timestamp - a.timestamp);
        return orders;
    }
);

const decorateUserOpenOrders = (orders, account) => {
    return(
        orders.map(order => {
            order = decorateOrder(order);
            order = decorateUserOpenOrder(order, account);
            return order;
        })
    );
};

const decorateUserOpenOrder = (order, account) => {
    let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';

    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    })
};

export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);

export const priceChartSelector = createSelector(
    filledOrders,
    (orders) => {
        // Set orders by date ascending
        orders = orders.sort((a, b) => a.timestamp - b.timestamp);
        orders = orders.map(o => decorateOrder(o));
        let secondLastOrder , lastOrder;
        [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length);
        const lastPrice = get(lastOrder, 'tokenPrice', 0);
        const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0);

        return({
            lastPrice,
            lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
            series: [{
                data: buildGraphData(orders)
            }]
        })
    }
);

const buildGraphData = (orders) => {
    // Group the orders by hour for the graph
    orders = groupBy(orders, o => moment.unix(o.timestamp).startOf('hour').format());
    // Get each hour where data exists
    const hours = Object.keys(orders);
    const graphData = hours.map(hour => {
        const group = orders[hour];
        const open = group[0];
        const close = group[group.length - 1];
        const high = maxBy(group, 'tokenPrice');
        const low = minBy(group, 'tokenPrice');
        return({
            x: new Date(hour),
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        })
    })
    return graphData;
};

const orderCancelling = state => get(state, 'exchange.orderCancelling', false);
export const orderCancellingSelector = createSelector(orderCancelling, status => status);

const orderFilling = state => get(state, 'exchange.orderFilling', false);
export const orderFillingSelector = createSelector(orderFilling, status => status);

const balancesLoading = state => get(state, 'exchangeBalances.balancesLoading', true);
export const balancesLoadingSelector = createSelector(balancesLoading, status => status);

const etherBalance = state => get(state, 'web3.ethBalance', 0);
export const etherBalanceSelector = createSelector(
    etherBalance,
    (balance) => {
        return formatBalance(balance);
    }
);

const tokenBalance = state => get(state, 'token.tokenBalance', 0);
export const tokenBalanceSelector = createSelector(
    tokenBalance,
    (balance) => {
        return formatBalance(balance);
    }
);

const exchangeEtherBalance = state => get(state, 'exchangeBalances.etherBalance', 0);
export const ExchangeEtherBalanceSelector = createSelector(
    exchangeEtherBalance,
    (balance) => {
        return formatBalance(balance);
    }
);

const exchangeTokenBalance = state => get(state, 'exchangeBalances.tokenBalance', 0);
export const ExchangeTokenBalanceSelector = createSelector(
    exchangeTokenBalance,
    (balance) => {
        return formatBalance(balance);
    }
);

const etherDepositAmount = state => get(state, 'exchange.etherDepositAmount', null);
export const etherDepositAmountSelector = createSelector(etherDepositAmount, amount => amount);

const etherWithdrawAmount = state => get(state, 'exchange.etherWithdrawAmount', null);
export const etherWithdrawAmountSelector = createSelector(etherWithdrawAmount, amount => amount);

const tokenDepositAmount = state => get(state, 'exchange.tokenDepositAmount', null);
export const tokenDepositAmountSelector = createSelector(tokenDepositAmount, amount => amount);

const tokenWithdrawAmount = state => get(state, 'exchange.tokenWithdrawAmount', null);
export const tokenWithdrawAmountSelector = createSelector(tokenWithdrawAmount, amount => amount);

const buyOrder = state => get(state, 'exchange.buyOrder', {});
export const buyOrderSelector = createSelector(buyOrder, order => order);

const sellOrder = state => get(state, 'exchange.sellOrder', {});
export const sellOrderSelector = createSelector(sellOrder, order => order);