import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ListSuggestionsWidget from '../../components/administrator/ListSuggestionsWidget';

function ListSuggestions() {
    return <ListSuggestionsWidget />;
  }

export default withAllSubscriptions(ListSuggestions);
