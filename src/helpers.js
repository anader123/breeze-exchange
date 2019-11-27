const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const DECIMALS = (10 ** 18);

const ether = (wei) => {
    if(wei) {
        return(wei/DECIMALS)
    }
};

const tokens = ether;

const GREEN = 'success';
const RED = 'danger';

const formatBalance = (balance) => {
    balance = ether(balance);
    balance = Math.round(balance * 100) / 100;
    return balance;
};

module.exports = {
    ether,
    tokens,
    ETHER_ADDRESS,
    GREEN,
    RED,
    formatBalance
};