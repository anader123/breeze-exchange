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

module.exports = {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded
}