import React, { Component } from 'react';
import {
  Button,
  Icon,
  Segment,
  Grid,
  Header,
} from 'semantic-ui-react';
import styled from 'styled-components';

const FullHeightGrid = styled(Grid)`
  height: 620px;
  /* background-color: #f03e3e; */
`;

export default class LoginScreen extends Component {
  static defaultProps = {
    onGoogleLogin: () => { },
  }

  handleGoogleButtonClick = () => {
    this.props.onGoogleLogin();
  }

  render() {
    return (
      <FullHeightGrid centered verticalAlign="middle">
        <Grid.Column style={{ width: '320px' }}>
          <Segment textAlign="center" vertical>
            <Header as="h1" textAlign="center">PPOM</Header>
            <p>시간과 함께 일하는 습관</p>
            <Button color="google plus" onClick={this.handleGoogleButtonClick}>
              <Icon name="google plus" />Google 로그인
            </Button>
          </Segment>
        </Grid.Column>
      </FullHeightGrid>
    );
  }
}
