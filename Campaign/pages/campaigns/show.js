import React, {Component} from 'react';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';

class CampaignShow extends Component{
    static async getInitialProps(props) {
       const campaign = Campaign(props.query.address);
       const summary = await campaign.methods.getSummary.call();
       
       return {
           minimumContribution: summary[0],
           balance: summary[1],
           requestCount: summary[2],
           approversCount: summary[3],
           manager: summary[4]
       };
    }

    render() {
        return (
            <Layout>
                <h1>CampaignShow!</h1>
            </Layout>
        );
    }
}

export default CampaignShow;