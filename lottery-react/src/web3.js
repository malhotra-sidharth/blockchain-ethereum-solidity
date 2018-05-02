import Web3 from 'web3';

// get the provider from metamask
// provider will have access to all the public and
// private keys
const provider = window.web3.currentProvider;
const web3 = new Web3(provider);

export default web3;