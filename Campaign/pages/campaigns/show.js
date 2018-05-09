import React, {Component} from 'react';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import {Card} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';

class CampaignShow extends Component{
    static async getInitialProps(props) {
       const campaign = Campaign(props.query.address);
       const summary = await campaign.methods.getSummary().call();

       return {
           minimumContribution: summary[0],
           balance: summary[1],
           requestsCount: summary[2],
           approversCount: summary[3],
           manager: summary[4]
       };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;


        const items = [
            // manager
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money.',
                style: {overflowWrap: 'break-word'}
            },
            //  minimum contribution
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (Wei)',
                description: 'You must contribute at least this much wei to become an approver.'
            },
            // request count
            {
                header: requestsCount,
                meta: 'Number of Request',
                description: 'A request tries to withdraw money from contract. Request must be approved' +
                ' by the approvers.'
            },
            // approvers count
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already contributed to this campaign.'
            },
            // balance
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'Money left in this campaign to spend'
            }
        ];




        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <h3>CampaignShow!</h3>
                {this.renderCards()}
            </Layout>
        );
    }
}

export default CampaignShow;