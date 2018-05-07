import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

// get already deployed CampaignFactory contract
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x69F9e65dEaeFCc2fDAbBBFddf313b24caE79717F');

export default instance;
