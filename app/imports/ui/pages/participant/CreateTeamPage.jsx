import React from 'react';

import { Container } from 'react-bootstrap';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import CreateTeamWidget from '../../components/participant/CreateTeamWidget';

const CreateTeamPage = () => {
  return (
    <Container id="create-team-page">
      <CreateTeamWidget />
    </Container>
  );
};

export default withAllSubscriptions(CreateTeamPage);
