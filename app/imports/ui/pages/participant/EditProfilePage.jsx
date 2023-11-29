import React from 'react';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import EditProfileWidget from '../../components/participant/EditProfileWidget';

const EditProfilePage = () => {
    return <EditProfileWidget />;
}

export default withAllSubscriptions(EditProfilePage);
