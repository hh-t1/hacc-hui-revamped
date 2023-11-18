import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { FaBirthdayCake } from 'react-icons/fa';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import UpdateMinorParticipantsWidget from '../../components/administrator/UpdateMinorParticipantsWidget';

const UpdateMinorParticipantsCompliant = () => {
  const getMinorParticipants = () => {
    return MinorParticipants._collection.find({}).fetch();
  };

  const getCFParticipants = () => {
    return Participants._collection.find({ isCompliant: false }).fetch();
  };

  const getMinorCFParticipants = () => {
    const CFParticipantsID = getCFParticipants().map(
      (participant) => participant._id,
    );
    const AllMinorParticipantsID = getMinorParticipants().map(
      (participant) => participant.participantID,
    );
    const CFParticipantsIDSet = new Set(CFParticipantsID);
    return AllMinorParticipantsID.filter((id) => CFParticipantsIDSet.has(id));
  };

  const renderMinorCFParticipants = () => {
    const MinorCFParticipantsID = getMinorCFParticipants();
    if (MinorCFParticipantsID.length === 0) {
      return (
        <Container align={'center'} id="update-minor-participants">
          <Row>
            <Col>
              {' '}
              <FaBirthdayCake size={200} />
            </Col>
          </Row>
          <Row>
            <Col as="h1">There are no minor participants yet.</Col>
          </Row>
          <Row>
            <Col as="h2">Please check back later.</Col>
          </Row>
        </Container>
      );
    }

    return (
      <div id="update-minor-participants">
        <UpdateMinorParticipantsWidget
          MinorParticipantsID={MinorCFParticipantsID}
        />
      </div>
    );
  };

  return (
    <Container id="update-minor-participants">
      {renderMinorCFParticipants()}
    </Container>
  );
};

export default UpdateMinorParticipantsCompliant;
