const asset = require('assert');
const ganache = require('ganache-cli');

// we are importing a constructor, therefore `Web3` and not `web3`
const Web3 = require('web3');
const web3 = new Web3(ganache.provider()); // change when you want to change the network
