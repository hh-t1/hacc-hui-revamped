import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageMinorWidget from '../../components/administrator/ManageMinorWidget';

function ShowMinorPage() {
    return <ManageMinorWidget />;
  }

export default withAllSubscriptions(ShowMinorPage);
