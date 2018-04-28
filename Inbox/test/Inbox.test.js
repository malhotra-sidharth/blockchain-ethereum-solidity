const assert = require('assert');
const ganache = require('ganache-cli');

// we are importing a constructor, therefore `Web3` and not `web3`
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider); // change when you want to change the network
const {interface, bytecode} = require('../compile');

let accounts;
let inbox;
const INIT_STRING = "Hi there!";

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();


    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INIT_STRING]})
        .send({from: accounts[0], gas: '1000000'});

    inbox.setProvider(provider);
});

describe('Inbox', () => {
   it('deploys a contract', () => {
       // check if address exists i.e is the contract was successfully
       // deployed
       assert.ok(inbox.options.address);
   });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INIT_STRING);
    });

    it('can change the message', async () => {
        // returns transaction hash
        await inbox.methods.setMessage("Bye!")
            .send({ from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye!');
    });
});