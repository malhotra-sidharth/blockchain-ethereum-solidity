import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

// get already deployed CampaignFactory contract
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x9584F76Ac3A9236E7BfdcbD4E3ebc1484ea7AD30');

export default instance;
