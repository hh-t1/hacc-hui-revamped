import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';

/** Renders a single row in the table. See pages/Listmenuitemss.jsx. */
const ListMinor = (props) => {
  const removeItem = (docID) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this participant!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        removeItMethod.call(
          {
            collectionName: MinorParticipants.getCollectionName(),
            instance: MinorParticipants.getID(docID),
          },
          (error) =>
            error
              ? swal('Error', error.message, 'error')
              : swal('Success', 'Participant removed', 'success'),
        );
      } else {
        swal('You canceled the deletion!').then();
      }
    });
  };

  // const challengeInterestArray = this.findInterests();
  // console.log(challengeInterestArray);
  return (
    <tr>
      <th width={2}>{props.minorParticipants.username}</th>
      <th width={5}>{props.minorParticipants.parentFirstName}</th>
      <th width={5}>{props.minorParticipants.parentLastName}</th>
      <th width={5}>{props.minorParticipants.parentEmail}</th>
      {/* eslint-disable-next-line max-len */}
      <th width={2}>
        <Button>
          <Link
            to={`/edit-challenge/${props.minorParticipants._id}`}
            style={{ color: 'rgba(0, 0, 0, 0.6)' }}
          >
            Edit
          </Link>
        </Button>
      </th>
      {/* eslint-disable-next-line max-len */}
      <th width={2}>
        <Button
          negative
          onClick={() => removeItem(props.minorParticipants._id)}
        >
          Delete
        </Button>
      </th>
    </tr>
  );
};

/** Require a document to be passed to this component. */
ListMinor.propTypes = {
  minorParticipants: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */

export default ListMinor;
