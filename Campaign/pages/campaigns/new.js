import React, {Component} from 'react';
import Layout from '../../components/layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component{
    state = {
        minimumContribution: '',
        errorMsg: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true, errorMsg: ''});

        // use metamask to calculate the gas amount
        // metamask will automatically calculate the gas amount
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
        }
        catch (e) {
            this.setState({errorMsg: e.message});
        }

        this.setState({loading: false});
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label="Wei"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({minimumContribution: event.target.value})}
                        />
                    </Form.Field>
                    <Button loading={this.state.loading} primary>Create!</Button>

                    <Message
                        error
                        header="Oops!"
                        content={this.state.errorMsg}
                    />
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;