import { tokens, EVM_REVERT } from './helpers';

const Token = artifacts.require('./Token');
require('chai')
.use(require('chai-as-promised'))
.should();


contract('Token', ([deployer, receiver, exchange]) => {
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
            it('rejects insufficient balances', async () => {
                let invalidAmount;
                invalidAmount = tokens(100000000); // Greater than the total supply of tokens
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)

                invalidAmount = tokens(10); // user doesn't have any tokens
                await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
            });
        });
    });

    describe('approving tokens', async () => {
        let result;
        let amount;

        beforeEach(async () => {
            amount = tokens(100);
            result = await token.approve(exchange, amount, { from: deployer });
        })

        it('allocated an allowance for delegated token spending on an exchange', async () => {
            const allowance = await token.allowance(deployer, exchange);
            allowance.toString().should.equal(amount.toString());
        });

        it('emits a transfer event', async () => {
            const log = result.logs[0];
            log.event.should.equal('Approval');
            const event = log.args;
            event.owner.toString().should.equal(deployer, "owner is correct");
            event.spender.toString().should.equal(exchange, "value is correct");
            event.value.toString().should.equal(amount.toString(), "value is corret");
        });
    });

    describe('delegated token transfers', () => {
        let amount; 
        let result; 

        beforeEach(async () => {
            amount = tokens(100)
            await token.approve(exchange, amount, { from: deployer });
        });

        describe('success', async () => {
            beforeEach(async () => {
                result = await token.transferFrom(deployer, receiver, tokens(100), { from: exchange });
            });
            
            it('transfers tokens', async () => {
                let balanceOf;
                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokens(9900).toString());
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokens(100).toString());
            });

            it('resets the allowance', async () => {
                const allowance = await token.allowance(deployer, exchange);
                allowance.toString().should.equal('0');
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
            it('rejects insufficient allowances', async () => {
                let invalidAmount;
                invalidAmount = tokens(100000000); // Greater than the allowance
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)
            });

            it('rejects invalid recipients', async () => {
                await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected;
            });
        });
    });
});