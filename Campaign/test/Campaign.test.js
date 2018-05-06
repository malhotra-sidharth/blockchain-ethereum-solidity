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
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});


describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });

        // check if accounts[1] exists in approvers or not
        const isContributor = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });

            // the above code should throw error
            // and this line of code will always fail the test
            // if this line of code is executed
            assert(false);
        }
        catch (e) {
            assert(e);
        }
    });

    it('allows a manager to make a payment request', async () => {
       // create a request
       await campaign.methods
           .createRequest('Buy Batteries', '100', accounts[1])
           .send({
               from: accounts[0], // manager address
               gas: '1000000'
           });

       // get the request that was created by above code block
        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy Batteries', request.description);
    });


    it('processes requests', async () => {
        // contribute
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        // create request
        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        // vote for the request
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // finalize the request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // get balance
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance); // string to float

        assert(balance > 104);
    });
});
