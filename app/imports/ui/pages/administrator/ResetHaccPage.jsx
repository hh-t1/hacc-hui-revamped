import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaSyncAlt } from 'react-icons/fa';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import swal from "sweetalert";

const ResetHaccPage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  const handleResetClick = () => {
    setShowConfirmation(true);
    setIsConfirmDisabled(true);
    setTimeout(() => setIsConfirmDisabled(false), 5000);
  };

  const handleCancel = () => setShowConfirmation(false);

  const handleConfirmReset = () => {
    Meteor.call('haccReset');
    setShowConfirmation(false);

    swal('Success', 'HACC Hui has been reset.', 'success');
  };

  const beforePress = (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh', textAlign: 'center' }}
    >
      <Container>
        <Row>
          <Col className="text-center mx-auto py-3">
            <h2>
              Delete all challenges, participants, teams, suggestions, and slack
              connections. This action is irreversible.
            </h2>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mx-auto py-3">
            <Button variant="primary" onClick={handleResetClick} size="lg">
              <FaSyncAlt /> Reset
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );

  const afterPress = (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <Container>
        <Row>
          <Col className="text-center mx-auto py-3">
            <h2>Are you sure you want to reset HACC Hui?</h2>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mx-auto py-3">
            <Button
              variant="danger"
              onClick={handleConfirmReset}
              disabled={isConfirmDisabled}
              size="lg"
            >
              Confirm Reset
            </Button>{' '}
          </Col>
        </Row>
        <Row>
          <Col className="text-center mx-auto py-3">
            <Button variant="secondary" onClick={handleCancel} size="lg">
              Cancel
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      {showConfirmation ? afterPress : beforePress}
    </div>
  );
};

export default withAllSubscriptions(ResetHaccPage);
