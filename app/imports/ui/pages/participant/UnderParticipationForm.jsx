import React from 'react';
import { Alert, Container, Form, Col, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { AutoForm, SubmitField, TextField } from 'uniforms-bootstrap5';
import { ROUTES } from '../../../startup/client/route-constants';
import { darkerBlueStyle } from '../../styles';
import { Participants } from '../../../api/user/ParticipantCollection';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { userInteractionDefineMethod } from '../../../api/user/UserInteractionCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import {
  defineMethod,
  updateMethod,
} from '../../../api/base/BaseCollection.methods';

const schema = new SimpleSchema({
  yourLastName: String,
  yourFirstName: String,
  parentFirstName: String,
  parentLastName: String,
  parentEmail: String,
});

/**
 * A simple static component to render some text for the landing page.
 * @memberOf ui/pages
 */
const UnderParticipationForm = () => {

  const [redirect, setRedirect] = useState(false);

  const submit = (formData) => {
    const { firstName, lastName, parentFirstName, parentLastName, parentEmail } = formData;
    const dev = Participants.findDoc({ userID: Meteor.userId() });
    const username = dev.username;
    let collectionName = MinorParticipants.getCollectionName();
    const definitionData = {
      username,
      parentFirstName,
      parentLastName,
      parentEmail,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        swal('Error', error.message, 'Problem defining MinorParticipant');
      }
    });
    const interactionData = {
      username: dev.username,
      type: USER_INTERACTIONS.MINOR_SIGNED_CONSENT,
      typeData: [firstName, lastName, parentFirstName, parentLastName, parentEmail],
    };
    userInteractionDefineMethod.call(interactionData, (error) => {
      if (error) {
        swal('Error', error.message, 'Could not define user interaction');
      }
    });
    collectionName = Participants.getCollectionName();
    const updateData = {
      id: dev._id,
      minor: true,
    };
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        swal('Error', error.message, 'Could not update minor status');
      }
    });
    setRedirect(true);
  };

  const formSchema = new SimpleSchema2Bridge(schema);
  if (redirect) {
    return <Redirect to={ROUTES.CREATE_PROFILE}/>;
  }

  return (
  <Container style={darkerBlueStyle}>
    <h2 className='text-center mt-3'>HACC Registration</h2>
    <AutoForm schema={formSchema} onSubmit={data => submit(data)}>
      <Alert className='text-center'>
        <Alert.Heading>
          Read the <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>.
          <br />
          Then agree to the terms.
        </Alert.Heading>
      </Alert>
      <Form.Group widths="equal">
        <Row>
          <Col xs={6}><TextField name='yourFirstName' /></Col>
          <Col xs={6}><TextField name='yourLastName' /></Col>
        </Row>
      </Form.Group>
      <Form.Group widths="equal">
        <Row>
          <Col xs={4}><TextField name='parentFirstName' label="Parent/Guardian First Name" /></Col>
          <Col xs={4}><TextField name='parentLastName' label="Parent/Guardian Last Name" /></Col>
          <Col xs={4}><TextField name='parentEmail' label="Parent/Guardian Email" /></Col>
        </Row>
      </Form.Group>
      <SubmitField />
    </AutoForm>
  </Container>
);
};

export default UnderParticipationForm;
