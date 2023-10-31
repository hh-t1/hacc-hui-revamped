import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Modal, Card, Row, Col, Container } from 'react-bootstrap';
import {
  FaUser,
  FaBan,
  FaChild,
  FaGithub,
  FaServer,
  FaLinkedin,
  FaSlack,
} from 'react-icons/fa';

const ListparticipantCardAdmin = ({
  // participantID,
  skills,
  tools,
  challenges,
  participant,
  teams,
  // teamInvitations,
}) => {
  const [show, setShow] = useState(false);
  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  const changeBackground = (e) => {
    e.currentTarget.style.backgroundColor = '#fafafa';
    e.currentTarget.style.cursor = 'pointer';
  };

  const onLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  const isMinor = participant ? participant.minor : false;

  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const inlineTextStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const h3Style = {
    fontWeight: 700,
    fontSize: 16,
  };

  const modalRowStyle = {
    marginBottom: '1rem',
  };
  const modalColStyle = {
    marginBottom: '1rem',
  };

  return (
    <>
      <Card
        onMouseEnter={changeBackground}
        onMouseLeave={onLeave}
        onClick={handleOpen}
        style={{
          padding: '1.5rem',
          paddingBottom: '2rem',
          marginBottom: '1.5rem',
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        }}
      >
        <Card.Body>
          <Card.Title>
            <h2 style={inlineTextStyle}>
              <FaUser size={24} /> {participant.firstName}{' '}
              {participant.lastName}
            </h2>
          </Card.Title>
          <Card.Subtitle style={{ marginBottom: '1rem' }}>
            {teams.length === 0 ? (
              <span style={inlineTextStyle}>
                <FaBan color="red" size={12} /> No team
              </span>
            ) : undefined}
            {_.uniq(teams).length > 1 ? (
              <span style={inlineTextStyle}>
                <FaBan size={24} />
              </span>
            ) : undefined}
            {isMinor ? (
              <span style={inlineTextStyle}>
                <FaChild size={16} />
                Minor
              </span>
            ) : undefined}
          </Card.Subtitle>
          {/* <Col> */}
          {/*  <Header>About Me</Header> */}
          {/*  {participant.aboutMe} */}
          {/* </Col> */}
          <Row>
            <Col>
              <h3 style={h3Style}>GitHub</h3>
              <Card.Text style={{ whiteSpace: 'nowrap' }}>
                {participant.gitHub}
              </Card.Text>
            </Col>
            <Col>
              <h3 style={h3Style}>Slack Username</h3>
              <Card.Text style={{ whiteSpace: 'nowrap' }}>
                {participant.username}
              </Card.Text>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <h3 style={h3Style}>Challenges</h3>
              <Col floated={'left'} style={{ paddingBottom: '0.3rem' }}>
                {challenges.slice(0, 3).map((challenge, i) => (
                  <Card.Text
                    style={{ color: 'rgb(89, 119, 199)' }}
                    key={challenge + i}
                  >
                    {challenge}
                  </Card.Text>
                ))}
              </Col>
            </Col>
            <Col>
              <h3 style={h3Style}>Skills</h3>
              {skills.slice(0, 3).map((skill, i) => (
                <Card.Text key={skill + i}>{skill.name}</Card.Text>
              ))}
            </Col>
            <Col>
              <h3 style={h3Style}>Tools</h3>
              {tools.slice(0, 3).map((tool, i) => (
                <Card.Text key={tool + i}>{tool.name}</Card.Text>
              ))}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-80w">
        <Modal.Header closeButton style={{ alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: 24 }}>
              {participant.firstName} {participant.lastName}
            </h2>
            <h3 style={{ fontSize: 18 }}>{participant.demographicLevel}</h3>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row style={modalRowStyle}>
              <Col xs={12} md={6} style={modalColStyle}>
                <span style={inlineTextStyle}>
                  <FaGithub />
                  GitHub:
                </span>
                <a href={participant.gitHub}>{participant.gitHub}</a>
              </Col>
              <Col xs={12} md={6} style={modalColStyle}>
                <span style={inlineTextStyle}>
                  <FaServer />
                  Website:
                </span>
                <a href={participant.website}>{participant.website}</a>
              </Col>
              <Col xs={12} md={6} style={modalColStyle}>
                <span style={inlineTextStyle}>
                  <FaLinkedin />
                  LinkedIn:
                </span>
                <a href={participant.linkedIn}>{participant.linkedIn}</a>
              </Col>
              <Col xs={12} md={6} style={modalColStyle}>
                <span style={inlineTextStyle}>
                  <FaSlack />
                  Slack Username:
                </span>
                <a href={participant.username}>{participant.username}</a>
              </Col>
            </Row>
            <hr />
            <Row style={modalRowStyle}>
              <Col>
                <h3 style={h3Style}>Challenges</h3>
                <ul>
                  {challenges.map((challenge, i) => (
                    <li key={challenge + i}>{challenge}</li>
                  ))}
                </ul>
              </Col>
              <Col>
                <h3 style={h3Style}>Skills</h3>
                <ul>
                  {skills.map((skill, i) => (
                    <li key={skill + i}>{skill.name}</li>
                  ))}
                </ul>
              </Col>
              <Col>
                <h3 style={h3Style}>Tools</h3>
                <ul>
                  {tools.map((tool, i) => (
                    <li key={tool + i}>{tool.name}</li>
                  ))}
                </ul>
              </Col>
              <Col>
                <h3 style={h3Style}>Teams</h3>
                <ul>
                  {_.uniq(teams).map((team, i) => (
                    <li key={team + i}>{team}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

ListparticipantCardAdmin.propTypes = {
  participantID: PropTypes.string.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participant: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  teamInvitations: PropTypes.array,
};

export default ListparticipantCardAdmin;
