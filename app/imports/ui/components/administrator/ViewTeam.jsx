import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ListGroup, Col, Row, Container, Button } from 'react-bootstrap';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { CiCircleCheck } from 'react-icons/ci';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';

const ViewTeam = ({
  isCompliant,
  participants,
  teamChallenges,
  team,
  teamMembers,
}) => {
  const [showModal, setShowModal] = useState(false);
  const allParticipants = participants;
  const captain = allParticipants.filter((p) => team.owner === p._id)[0];
  const challenge = teamChallenges[0];
  function changeBackground(e) {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  }
  function onLeave(e) {
    e.currentTarget.style.backgroundColor = 'transparent';
  }
  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  // console.log(team, captain, teamChallenges);
  return (
    <Container
      className={`team-item team-${team.name}`}
      onMouseEnter={changeBackground}
      onMouseLeave={onLeave}
      style={{ padding: '1.0rem 1.5rem 1.0rem 1.5rem' }}
    >
      <Row>
        <b>Captain</b>
        {captain
          ? `${captain.firstName} ${captain.lastName}: ${captain.username}`
          : ''}
        <b>Challenge:</b>
        {challenge ? challenge.title : 'None yet.'}
      </Row>
      <Button variant="primary" onClick={handleShow}>
        {team.name}{' '}
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {team.name}{' '}
            {isCompliant ? <CiCircleCheck /> : <AiOutlineExclamationCircle />}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={4}>
              <h4>{team.name}</h4>
              <ListGroup>
                {teamChallenges.map((c) => (
                  <ListGroup.Item key={c._id}>{c.title}</ListGroup.Item>
                ))}
              </ListGroup>
              <h4>Captain</h4>
              {captain
                ? `${captain.firstName} ${captain.lastName}: ${captain.username}`
                : ''}
            </Col>
            <Col xs={5}>
              <h4>Members</h4>
              <ListGroup variant="flush">
                {teamMembers.map((t) => (
                  <ListGroup.Item key={t}>{t}</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col xs={5}>
              {isCompliant ? (
                <h4>Team is Compliant</h4>
              ) : (
                <h4>
                  <mark>Team is not Compliant</mark>
                </h4>
              )}
              <h4>Devpost Page</h4>
              {team.devPostPage}
              <h4>Github Repo</h4>
              {team.gitHubRepo}
            </Col>
            <Col xs={2}>
              <Button variant="primary">
                <Link
                  to={`/admin-edit-team/${team._id}`}
                  style={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    textDecoration: 'none',
                  }}
                >
                  Edit
                </Link>
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

ViewTeam.propTypes = {
  team: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  teamParticipants: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamMembers: PropTypes.arrayOf(PropTypes.string).isRequired,
  teamChallenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  isCompliant: PropTypes.bool.isRequired,
};

export default withTracker((props) => {
  // console.log(props);
  const participants = Participants.find({}).fetch();
  const teamChallenges = _.map(
    TeamChallenges.find({ teamID: props.team._id }).fetch(),
    (tc) => Challenges.findDoc(tc.challengeID),
  );
  const teamParticipants = TeamParticipants.find({}).fetch();
  return {
    participants,
    teamChallenges,
    teamParticipants,
  };
})(ViewTeam);
