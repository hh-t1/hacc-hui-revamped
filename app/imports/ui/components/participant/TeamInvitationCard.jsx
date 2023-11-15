import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { FaUsers, FaPlus } from 'react-icons/fa';
import { Card, Col, Modal, Row, Image, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import {
  defineMethod,
  removeItMethod,
} from '../../../api/base/BaseCollection.methods';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

const TeamInvitationCard = ({
  teams,
  skills,
  tools,
  challenges,
  participants,
}) => {
  const [show, setShow] = useState(false);

  const handleDecline = (tID) => {
    const thisTeamID = tID;
    const collectionName2 = TeamInvitations.getCollectionName();
    const intID = TeamInvitations.findDoc({
      teamID: thisTeamID,
      participantID: Participants.findDoc({ userID: Meteor.userId() })._id,
    });
    removeItMethod.call(
      { collectionName: collectionName2, instance: intID },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Removed Team Invitation', 'success');
        }
      },
    );
  };

  const handleAccept = (tID) => {
    const thisTeam = tID;
    const devID = Participants.findDoc({ userID: Meteor.userId() })._id;
    const definitionData = { team: thisTeam, participant: devID };
    const collectionName = TeamParticipants.getCollectionName();
    if (
      TeamParticipants.find({ teamID: thisTeam, participantID: devID }).fetch()
        .length === 0
    ) {
      defineMethod.call(
        { collectionName: collectionName, definitionData: definitionData },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Team Invitation Accepted', 'success');
          }
        },
      );
    }
    const collectionName2 = TeamInvitations.getCollectionName();
    const intID = TeamInvitations.findDoc({
      teamID: thisTeam,
      participantID: Participants.findDoc({ userID: Meteor.userId() })._id,
    });
    removeItMethod.call(
      { collectionName: collectionName2, instance: intID },
      (error) => {
        if (error) {
          console.error('Failed to remove', error);
        }
      },
    );
  };

  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card
        onMouseEnter={changeBackground}
        onMouseLeave={onLeave}
        onClick={handleShow}
        style={{ padding: '0rem 2rem 0rem 2rem' }}
      >
        <Card.Body>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaUsers size={36} />
            {teams.name}
          </h3>

          <Row>
            <Col>
              <Image src={teams.image} rounded size="small" />
            </Col>
            <Col>
              {challenges.slice(0, 3).map((challenge) => (
                <p style={{ color: 'rgb(89, 119, 199)' }} key={challenge}>
                  {challenge}
                </p>
              ))}
            </Col>
            <Col>
              <h4>Skills</h4>
              {skills.slice(0, 3).map((skill) => (
                <p key={skill}>{skill}</p>
              ))}
            </Col>
            <Col>
              <h4>Tools</h4>
              {tools.slice(0, 3).map((tool) => (
                <p key={tool}>{tool}</p>
              ))}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{teams.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={teams.image} />
          <hr />
          <h4>Description</h4>
          <p>{teams.description}</p>
          <hr />
          <h4>Challenges</h4>
          {challenges.map((challenge) => (
            <p key={challenge}>{challenge}</p>
          ))}
          <hr />
          <h4>Skills</h4>
          {skills.map((skill) => (
            <p key={skill}>{skill}</p>
          ))}
          <hr />
          <h4>Tools</h4>
          {tools.map((tool) => (
            <p key={tool}>{tool}</p>
          ))}
          <hr />
          <h4>Members</h4>
          {participants.map((participant) => (
            <p key={participant}>
              {participant.firstName} {participant.lastName}
            </p>
          ))}
          <hr />
          <Row>
            <Col>
              <Button
                id={teams._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: '100%',
                }}
                onClick={() => handleAccept(teams._id)}
              >
                <FaPlus />
                Accept Request
              </Button>
            </Col>
            <Col>
              <Button
                id={teams._id}
                variant="danger"
                style={{ width: '100%' }}
                onClick={() => handleDecline(teams._id)}
              >
                Decline Request
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

TeamInvitationCard.propTypes = {
  teams: PropTypes.object.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default TeamInvitationCard;
