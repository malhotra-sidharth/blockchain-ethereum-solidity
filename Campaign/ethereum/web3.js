import Web3 from 'web3';

// get web3 provider from Metamask extension
// This will generate error 'window not defined'
// because this gets executed on next server where
// window is not defined as window is defined inside the
// browser
// const web3 = new Web3(window.web3.currentProvider);

let web3;

if (typeof window !== 'undefined' &&
    typeof window.web3 !== 'undefined') {
    // inside the browser and metamask is available
    web3 = new Web3(window.web3.currentProvider);
}
else {
    // we are on the server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        // NETWORK URL FROM INFURA
        
    );

    web3 = new Web3(provider);
}


export default web3;