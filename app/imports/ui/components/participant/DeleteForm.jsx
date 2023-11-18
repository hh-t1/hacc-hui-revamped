import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SelectField,
} from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Participants } from '../../../api/user/ParticipantCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';
import {
  deleteAccountMethod,
  userInteractionDefineMethod,
} from '../../../api/user/UserInteractionCollection.methods';
import { USER_INTERACTIONS } from '../../../startup/client/user-interaction-constants';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';

const DeleteForm = () => {
  const participant = useTracker(() => {
    const userID = Meteor.userId();
    let participantDoc;
    if (Participants.isDefined(userID)) {
      participantDoc = Participants.findDoc({ userID: Meteor.userId() });
    } else {
      participantDoc = {};
    }
    return {
      participant: participantDoc,
    };
  });
  const submit = (data) => {
    const username = participant.username;
    const type = USER_INTERACTIONS.DELETE_ACCOUNT;
    const typeData = [data.feedback, data.other];
    const userInteraction = {
      username,
      type,
      typeData,
    };
    userInteractionDefineMethod.call(userInteraction, (error) =>
      error
        ? swal('Error', error.message, 'error')
        : swal('Account deleted', 'We hope to see you again!', 'success').then(
            () => {
              // eslint-disable-next-line no-undef
              window.location = '/';
            },
          ),
    );
    const selector = { owner: participant._id };
    const ownedTeams = Teams.find(selector).fetch();
    _.forEach(ownedTeams, (team) => {
      const selector2 = { teamID: team._id };
      const teamParticipants = TeamParticipants.find(selector2).fetch();
      if (teamParticipants.length === 1) {
        const instance = team._id;
        const collectionName = Teams.getCollectionName();
        removeItMethod.call({ collectionName, instance });
      } else {
        let newOwner = teamParticipants[0].participantID;
        if (newOwner === participant._id) {
          newOwner = teamParticipants[1].participantID;
        }
        Teams.update(team._id, { newOwner });
      }
    });
    const collectionName = Participants.getCollectionName();
    const instance = participant._id;
    removeItMethod.call({ collectionName, instance });
    deleteAccountMethod.call();
  };

  const reasons = [
    {
      label: 'No challenge was interesting for me',
      value: 'No challenge was interesting for me',
    },
    {
      label: 'The challenges were too hard',
      value: 'The challenges were too hard',
    },
    {
      label: "Couldn't find a team I liked being on",
      value: "Couldn't find a team I liked being on",
    },
    {
      label: 'My schedule conflicts with the HACC',
      value: 'My schedule conflicts with the HACC',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];
  const schema = new SimpleSchema({
    feedback: {
      type: String,
      allowedValues: reasons,
      defaultValue: 'Other',
    },
    other: { type: String, required: false },
  });
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Container
      className="mt-3"
      style={{
        textAlign: 'center',
      }}
    >
      <Col>
        <h2>Feedback</h2>
        <AutoForm
          schema={formSchema}
          onSubmit={(data) => {
            swal({
              text: 'Are you sure you want to delete your account?',
              icon: 'warning',
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                submit(data);
              } else {
                swal('Canceled deleting your account').then();
              }
            });
          }}
        >
          <div className="shadow-sm p-3 mb-5 bg-white rounded">
            <h3>We&apos;re sorry to hear you&apos;re deleting your account.</h3>
            <h4>
              Please provide feedback on why you&apos;re leaving to improve the
              HACC experience for next year.
            </h4>
            <br />
            <Container>
              <Row columns={2}>
                <Col>
                  <SelectField name="feedback" options={reasons} />
                </Col>
                <Col>
                  <LongTextField name="other" rows="5" />
                </Col>
              </Row>
            </Container>
            <Button basic color="red" value="submit">
              Delete Account
            </Button>
            <ErrorsField />
          </div>
        </AutoForm>
      </Col>
    </Container>
  );
};

export default withRouter(DeleteForm);
