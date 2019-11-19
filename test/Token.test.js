import { tokens, EVM_REVERT } from './helpers';

const Token = artifacts.require('./Token');
require('chai')
.use(require('chai-as-promised'))
.should();


contract('Token', ([deployer, receiver]) => {
    const name = 'Meme Token';
    const symbol = 'MEME'
    const decimals = '18';
    const totalSupply = tokens(10000); 
    let token; 

    beforeEach(async () => {
        token = await Token.new();
    });
    
    describe('deployment tests', () => {
        it('tracks the name', async () => {
            const result = await token.name();
            result.should.equal(name);
        });
        it('tracks the symbol', async () => {
            const result = await token.symbol();
            result.should.equal(symbol);
        });
        it('tracks the decimals', async () => {
            const result = await token.decimals();
            result.toString().should.equal(decimals);
        });
        it('tracks the totalSupply', async () => {
            const result = await token.totalSupply();
            result.toString().should.equal(totalSupply.toString());
        });
        it('tracks that the deployer gives totalSupply', async () => {
            const result = await token.balanceOf(deployer);
            result.toString().should.equal(totalSupply.toString());
        });
    });

    describe('sending tokens', () => {
        let amount; 
        let result; 

        describe('success', async () => {
            beforeEach(async () => {
                amount = tokens(100);
                result = await token.transfer(receiver, tokens(100), { from: deployer });
            });
            
            it('transfers tokens', async () => {
                let balanceOf;
                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokens(9900).toString());
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokens(100).toString());
            });
    
            it('emits a transfer event', async () => {
                const log = result.logs[0];
                log.event.should.equal('Transfer');
                const event = log.args;
                event.from.toString().should.equal(deployer, "from is correct");
                event.to.toString().should.equal(receiver, "to is correct");
                event.value.toString().should.equal(amount.toString(), "value is corret");
            });
        });

        describe('failure', async () => {
            it('rejects insufficient blanances', async () => {
                let invalidAmount;
                invalidAmount = tokens(100000000); // Greater than the total supply of tokens
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)

                invalidAmount = tokens(10); // user doesn't have any tokens
                await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
            });
        });
    })
});