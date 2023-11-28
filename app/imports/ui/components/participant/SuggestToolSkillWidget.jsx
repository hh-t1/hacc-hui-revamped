import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import { paleBlueStyle } from '../../styles';
import Dropdown from '../Dropdown';

const SuggestToolSkillWidget = ({ participant }) => {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    const valid = type !== '' && name !== '' && description !== '';
    setIsValid(valid);
  };

  useEffect(() => {
    validateForm();
  }, [type, name, description]);

  const submit = (e) => {
    e.preventDefault();

    const collectionName = Suggestions.getCollectionName();
    const newData = {
      username: participant.username,
      name,
      type,
      description,
    };

    defineMethod.call({ collectionName, definitionData: newData }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Thank you for your suggestion', 'success');
        setName('');
        setType('');
        setDescription('');
      }
    });
  };

  return (
    <Container
      id="suggest-tool-skill"
      style={{ paddingBottom: '50px', paddingTop: '40px' }}
    >
      <Card style={{ ...paleBlueStyle, maxWidth: '800px', margin: '0 auto' }}>
        <Card.Header as="h2" className="text-center">
          Hello {participant.firstName}, please fill out the form to suggest a
          new tool or skill.
        </Card.Header>
        <Card.Body style={{ width: '400px', margin: '0 auto' }}>
          <Form onSubmit={submit}>
            <Form.Group>
              <Row className="py-1">
                <Col className="text-center">
                  <Dropdown
                    items={[
                      { key: '1', text: 'Tool', value: 'Tool' },
                      { key: '2', text: 'Skill', value: 'Skill' },
                    ]}
                    onItemSelect={(value) => setType(value)}
                    label={type || 'Select Type'}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                    }}
                    className="text-center"
                  />
                </Col>
              </Row>
              <Row className="py-1">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Row>
              <Row className="py-1">
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  as="textarea"
                />
              </Row>
            </Form.Group>
            <Button
              type="submit"
              style={{
                display: 'block',
                margin: 'auto',
                backgroundColor: isValid ? null : 'gray',
                cursor: isValid ? 'pointer' : 'not-allowed',
              }}
              disabled={!isValid}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};


SuggestToolSkillWidget.propTypes = {
  participant: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  return {
    participant,
  };
})(SuggestToolSkillWidget);
