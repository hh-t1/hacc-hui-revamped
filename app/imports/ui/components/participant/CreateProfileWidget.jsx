import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import {
  AutoForm,
  BoolField,
  LongTextField,
  SelectField,
  TextField,
} from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { Skills } from '../../../api/skill/SkillCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { demographicLevels } from '../../../api/level/Levels';
import MultiSelectField from '../form-fields/MultiSelectField';
import { ROUTES } from '../../../startup/client/route-constants';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

const CreateProfileWidget = (props) => {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const { participant, challenges, skills, tools } = useTracker(() => {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    const challenges = Challenges.find({}).fetch();
    const skills = Skills.find({}).fetch();
    const tools = Tools.find({}).fetch();

    return {
      participant,
      challenges,
      skills,
      tools,
    };
  }, []);

  const buildTheFormSchema = () => {
    const challengeNames = this.props.challenges.map((c) => c.challenge);
    const skillNames = this.props.skills.map((s) => s.name);
    const toolNames = this.props.tools.map((t) => t.name);
    const schema = new SimpleSchema({
      firstName: String,
      lastName: String,
      username: String,
      demographicLevel: {
        type: String,
        allowedValues: demographicLevels,
        optional: true,
      },
      linkedIn: { type: String, optional: true },
      gitHub: { type: String, optional: true },
      slackUsername: { type: String, optional: true },
      website: { type: String, optional: true },
      aboutMe: { type: String, optional: true },
      userID: { type: SimpleSchema.RegEx.Id, optional: true },
      lookingForTeam: { type: Boolean, optional: true },
      isCompliant: { type: Boolean, optional: true },
      challenges: { type: Array, optional: true },
      'challenges.$': { type: String, allowedValues: challengeNames },
      skills: { type: Array, optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
    });
    return schema;
  };

  const submit = (data) => {
    const collectionName = Participants.getCollectionName();
    const updateData = {};
    updateData.id = data._id;
    updateData.firstName = data.firstName;
    updateData.lastName = data.lastName;
    if (data.demographicLevel) {
      updateData.demographicLevel = data.demographicLevel;
    }
    if (data.challenges) {
      updateData.challenges = data.challenges.map((title) => {
        const doc = Challenges.findDoc({ title });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.skills) {
      updateData.skills = data.skills.map((name) => {
        const doc = Skills.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.tools) {
      updateData.tools = data.tools.map((name) => {
        const doc = Tools.findDoc({ name });
        return Slugs.getNameFromID(doc.slugID);
      });
    }
    if (data.linkedIn) {
      updateData.linkedIn = data.linkedIn;
    }
    if (data.gitHub) {
      updateData.gitHub = data.gitHub;
    }
    if (data.slackUsername) {
      updateData.slackUsername = data.slackUsername;
    }
    if (data.website) {
      updateData.website = data.website;
    }
    if (data.aboutMe) {
      updateData.aboutMe = data.aboutMe;
    }
    updateData.editedProfile = true;
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href>Why do I have this issue?</a>',
        });
      } else {
        Swal.fire({
          icon: 'success',
          text: 'Your profile is updated.',
        });
      }
    });
    setRedirectToReferer(true);
  };

  if (redirectToReferer) {
    return <Redirect to={ROUTES.YOUR_PROFILE} />;
  }

  const formSchema = new SimpleSchema2Bridge(buildTheFormSchema());

  return (
    <Container>
      <Row>
        <Col>
          <h2>Hello {firstname}, this is your first time to login, so please fill out your profile</h2>
          <AutoForm schema={formSchema} model={model} onSubmit={onSubmit}>
            <Form.Group as={Row}>
              <Col>
                <TextField name="username" disabled />
              </Col>
              <Col>
                <BoolField name="isCompliant" disabled />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col>
                <TextField name="firstName" />
              </Col>
              <Col>
                <TextField name="lastName" />
              </Col>
              <Col>
                <SelectField name="demographicLevel" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col>
                <TextField name="linkedIn" />
              </Col>
              <Col>
                <TextField name="gitHub" />
              </Col>
              <Col>
                <TextField name="slackUsername" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col>
                <TextField name="website" />
              </Col>
              <Col>
                <LongTextField name="aboutMe" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col>
                <MultiSelectField name="challenges" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col>
                <MultiSelectField name="skills" />
              </Col>
              <Col>
                <MultiSelectField name="tools" />
              </Col>
            </Form.Group>
            <Button type="submit">Submit</Button>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

CreateProfileWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
  challenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  tools: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CreateProfileWidget;
