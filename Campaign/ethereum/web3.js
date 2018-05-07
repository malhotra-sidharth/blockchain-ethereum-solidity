import Web3 from 'web3';

// get web3 provider from Metamask extension
const web3 = new Web3(window.web3.currentProvider);

export default web3;