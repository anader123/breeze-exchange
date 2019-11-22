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

module.exports = {
    ether,
    tokens,
    ETHER_ADDRESS,
    GREEN,
    RED
};