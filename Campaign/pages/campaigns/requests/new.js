import React, {Component} from 'react';
import {Button, Form, Message, Input} from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link, Router} from '../../../routes';
import Layout from '../../../components/layout';

class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errorMsg: ''
    };

    static async getInitialProps(props) {
        const {address} = props.query;

        return {address};
    }

    onSubmit = async event => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const {description, value, recipient} = this.state;

        this.setState({loading: true, errorMsg: ''});
        
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        }
        catch (e) {
            this.setState({errorMsg: e.message});
        }

        this.setState({loading: false});
    }

    render(){
        return (
            <Layout>
                <h3>Create a new Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMsg}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => {this.setState({description: event.target.value})}}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            label="Ether"
                            labelPosition="right"
                            value={this.state.value}
                            onChange={event => {this.setState({value: event.target.value})}}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => {this.setState({recipient: event.target.value})}}
                        />
                    </Form.Field>

                    <Button primary loading={this.state.loading}>
                        Create!
                    </Button>

                    <Message error header="Oops!" content={this.state.errorMsg}/>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;