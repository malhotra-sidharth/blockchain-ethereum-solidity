import React from 'react';
import {Container} from 'semantic-ui-react';
import Header from './header';

export default (props) => {
  return (
      <Container>
          <Header/>
          {props.children}
      </Container>
  );
};