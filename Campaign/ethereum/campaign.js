import web3 from './web3';
import Campaign from './build/Campaign';

// This file will get the details of
// a Campaign contract from its address
export default address => {
  return new web3.eth.Contract(
    JSON.parse(Campaign.interface),
      address
  );
};