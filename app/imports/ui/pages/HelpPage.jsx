import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

const HelpPage = () => (
  <Container
    style={{
      margin: '30px',
      backgroundColor: '#E5F0FE',
      textAlign: 'center',
    }}
  >
    <p style={{ fontSize: '40px', paddingTop: '20px' }}>
      Questions By Category
    </p>
    <hr />
    <p>GENERAL</p>
    <hr />

    <Row style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <Col style={{ paddingTop: '30px' }}>
        <h1>
          <b>How do I Register?</b>
        </h1>
        <h2>
          <a href={'https://slack.com/signin#/signin'}>
            Join The Slack Workspace
          </a>
        </h2>
        <p>
          <b>
            You will need to make a Slack account if you do not have a
            pre-existing one. <br />
            Join the Slack Workspace and type register. <br />
            You will then be given a username and password to login.
          </b>
        </p>
      </Col>

      <Col style={{ paddingTop: '30px' }}>
        <div>
          <h1>
            <b>What is HACC HUI?</b>
          </h1>
          <h4>
            <b>
              HACC HUI is an official HACC 2022 site to help participants create
              and manage their teams
            </b>
          </h4>
        </div>
      </Col>
    </Row>

    <hr />
    <p>TEAM MANAGEMENT</p>
    <hr />

    <Row style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
      <Col style={{ paddingTop: '30px' }}>
        <h1>
          <b>Where can I find Teammates?</b>
        </h1>
        <h2>
          <Link to="list-participants">List Participants Page</Link>
        </h2>
        <p>
          <b>
            You can view/send an invitation to all participants through this
            page!
          </b>
        </p>

        <div style={{ paddingTop: '100px' }}>
          <h1>
            <b>How do I Leave/Delete my Team?</b>
          </h1>
          <h2>
            <Link to="your-teams">Edit Teams Page</Link>
          </h2>
          <p>
            <b>
              Here you can leave, delete, invite, and recruit for your team!
            </b>
          </p>
        </div>
      </Col>

      <Col style={{ paddingTop: '30px' }}>
        <div>
          <h1>
            <b>How do I Create a Team?</b>
          </h1>
          <h2>
            <Link to="create-team">Create Teams Page</Link>
          </h2>
          <p>
            <b>Make sure to fill out the team creation form fully</b>
          </p>
        </div>
        <div style={{ paddingTop: '115px' }}>
          <h1>
            <b>Can I be on Multiple Teams?</b>
          </h1>
          <h2>Yes!</h2>
          <p>
            <b>
              Although it is suggested that you stay with one team, you are
              allowed to join multiple teams.
            </b>
          </p>
        </div>
      </Col>
    </Row>

    <hr />
    <p>UNEXPECTED ERRORS</p>
    <hr />

    <div style={{ paddingTop: '10px', paddingBottom: '30px' }}>
      <h1>
        <b>Site not Functioning Properly?</b>
      </h1>
      <h3>
        Please screenshot the problem and direct message cmoore@hawaii.edu on
        Slack
      </h3>
    </div>
  </Container>
);

export default HelpPage;
