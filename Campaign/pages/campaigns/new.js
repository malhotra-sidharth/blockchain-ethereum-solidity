import React, {Component} from 'react';
import Layout from '../../components/layout';
import { Form, Button, Input } from 'semantic-ui-react';

class CampaignNew extends Component{
    state = {
        minimumContribution: ''
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>

                <Form>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label="Wei"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({minimunComtribution: event.target.value})}
                        />
                    </Form.Field>

                    <Button primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;