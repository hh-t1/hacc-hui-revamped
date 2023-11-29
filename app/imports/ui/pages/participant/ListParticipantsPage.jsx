import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListDevelopersWidget from '../../components/participant/ListParticipantsWidget';

const ListParticipantsPage = () => {
    return <ListDevelopersWidget />;
}

export default withAllSubscriptions(ListParticipantsPage);
