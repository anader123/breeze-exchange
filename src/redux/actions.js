function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    };
};

function web3AccountLoaded(account) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    };
};

function tokenLoaded(contract) {
    return {
        type: 'TOKEN_LOADED',
        contract
    };
};

function exchangeLoaded(contract) {
    return {
        type: 'EXCHANGE_LOADED',
        contract
    };
};

function cancelledOrdersLoaded(cancelledOrders) {
    return {
        type: 'CANCELLED_ORDERS_LOADED',
        cancelledOrders
    };
};

function filledOrdersLoaded(filledOrders) {
    return {
        type: 'FILLED_ORDERS_LOADED',
        filledOrders
    };
};

function allOrdersLoaded(allOrders) {
    return {
        type: 'ALL_ORDERS_LOADED',
        allOrders
    };
};

function orderCancelling() {
    return {
        type: 'ORDER_CANCELLING'
    };
};

function orderCancelled(order) {
    return {
        type: 'ORDER_CANCELLED',
        order
    };
};

function orderFilling() {
    return {
        type: 'ORDER_FILLING'
    };
};

function orderFilled(order) {
    return {
        type: 'ORDER_FILLED',
        order
    };
};

function etherBalanceLoaded(balance) {
    return {
        type: "ETHER_BALANCE_LOADED",
        balance
    };
};

function tokenBalanceLoaded(balance) {
    return {
        type: "TOKEN_BALANCE_LOADED",
        balance
    };
};

function exchangeEtherBalanceLoaded(balance) {
    return {
        type: "EXCHANGE_ETHER_BALANCE_LOADED",
        balance
    };
};

function exchangeTokenBalanceLoaded(balance) {
    return {
        type: "EXCHANGE_TOKEN_BALANCE_LOADED",
        balance
    };
};

function balancesLoaded() {
    return {
        type: "BALANCES_LOADED",
    };
};

function balancesLoading() {
    return {
        type: "BALANCES_LOADING",
    };
};

function etherDepositAmountChanged(amount) {
    return {
        type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
        amount
    };
};

function etherWithdrawAmountChanged(amount) {
    return {
        type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
        amount
    };
};

function tokenDepositAmountChanged(amount) {
    return {
        type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
        amount
    };
};

function tokenWithdrawAmountChanged(amount) {
    return {
        type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
        amount
    };
};

// Buy Order 
function buyOrderAmountChanged(amount) {
    return {
        type: 'BUY_ORDER_AMOUNT_CHANGED',
        amount
    };
};

function buyOrderPriceChanged(price) {
    return {
        type: 'BUY_ORDER_PRICE_CHANGED',
        price
    };
};

function buyOrderMaking(price) {
    return {
        type: 'BUY_ORDER_MAKING'
    };
};

// Generic Order
function orderMade(order) {
    return {
        type: 'ORDER_MADE',
        order
    };
};

// Sell Order
function sellOrderAmountChanged(amount) {
    return {
        type: 'SELL_ORDER_AMOUNT_CHANGED',
        amount
    };
};

function sellOrderPriceChanged(price) {
    return {
        type: 'SELL_ORDER_PRICE_CHANGED',
        price
    };
};

function sellOrderMaking(price) {
    return {
        type: 'SELL_ORDER_MAKING'
    };
};

module.exports = {
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
    etherDepositAmountChanged,
    etherWithdrawAmountChanged,
    tokenDepositAmountChanged,
    tokenWithdrawAmountChanged,
    buyOrderAmountChanged,
    buyOrderPriceChanged,
    buyOrderMaking,
    orderMade,
    sellOrderAmountChanged,
    sellOrderPriceChanged,
    sellOrderMaking
};