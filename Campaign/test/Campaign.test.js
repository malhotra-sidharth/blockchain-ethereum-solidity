const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory');
const compiledCampaign = require('../ethereum/build/Campaign');

let accounts;
let factory; // deployed instance of factory instance
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await  web3.eth.getAccounts();

    factory = await  new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // get deployed contracts
    // Assigns the first element from the array of addresses to
    // campaignAddress
    // just like campaignAddress = addresses[0]
    [campaignAddress] = await factory.methods.getDeployedContracts().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});
