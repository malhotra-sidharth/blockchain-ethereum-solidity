const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    // MNEMONICS HERE,

    // NETWORK URL FROM INFURA
);

const web3 = new Web3(provider);

const INIT_MESSAGE = 'Hello World!';

// creating this function so that
// async - await syntax can be used
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account ', accounts[0]);

    // Always record the address where the contract gets deployed
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [INIT_MESSAGE]})
        .send({gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to ', result.options.address);
};

deploy();