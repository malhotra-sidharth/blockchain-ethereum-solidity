const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();

   lottery = await new web3.eth.Contract(JSON.parse(interface))
       .deploy({data: bytecode})
       .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    // checks for single account
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        // get all players in the list
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    // check for multiple accounts
    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        // get all players in the list
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });

            assert(false);
        }
        catch (e) {
            assert(e);
        }
    });

    it('only manager can call pickWinner', async () => {
        try{
            await lottery.methods.pickWinner.send({
                from: accounts[1]
            });

            assert(false);
        }
        catch (e) {
            assert(e);
        }
    });

    it('sends money to the winner and resets the player array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        // get initial balance in Wei of account[0]
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        // pick a winner
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        // get the final balance of account[0]
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        // difference between final and initial balance should be
        // a little less than 2 as we have spent some ether on gas
        // for transactions. Therefore, we use 1.8 ether in assert
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
});