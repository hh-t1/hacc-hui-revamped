import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import DeleteFormWidget from '../../components/participant/DeleteForm';

class DeleteForm extends React.Component {
  render() {
    return <DeleteFormWidget />;
  }
}

export default withAllSubscriptions(DeleteForm);
