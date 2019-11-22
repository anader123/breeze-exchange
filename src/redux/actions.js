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

module.exports = {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded
}