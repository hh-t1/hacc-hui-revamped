import React, { useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AutoForm,
  BoolField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { Skills } from '../../../api/skill/SkillCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { demographicLevels } from '../../../api/level/Levels';
import { ROUTES } from '../../../startup/client/route-constants';
import { Slugs } from '../../../api/slug/SlugCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';

class CreateProfileWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferer: false,
      selectedChallenges: [], // State for selected challenges
      selectedSkills: [], // State for selected skills
      selectedTools: [], // State for selected tools
    };
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.challenges, (c) => c.title);
    const skillNames = _.map(this.props.skills, (s) => s.name);
    const toolNames = _.map(this.props.tools, (t) => t.name);
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
  }

  submit(data) {
    const collectionName = Participants.getCollectionName();
    const updateData = {};
    updateData.id = data._id;
    updateData.firstName = data.firstName;
    updateData.lastName = data.lastName;
    if (data.demographicLevel) {
      updateData.demographicLevel = data.demographicLevel;
    }
    if (data.challenges) {
      // build an array of challenge slugs
      updateData.challenges = this.state.selectedChallenges;
    }
    if (data.skills) {
      updateData.skills = this.state.selectedSkills;
    }
    if (data.tools) {
      updateData.tools = this.state.selectedTools;
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
    // console.log(collectionName, updateData);
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
    this.setState({ redirectToReferer: true });
  }

  render() {
    const model = this.props.participant;
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    const firstname = model.firstName;
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.YOUR_PROFILE };
      return <Redirect to={from} />;
    }
    return (
      <Container className="justify-content-center my-3">
        <Row className="justify-content-center">
          <Col className="text-center my-2">
            <h2>
              Hello {firstname}, this is your first time logging in, please
              tells us more about yourself!{' '}
            </h2>
            <h2>You can always change this later</h2>
          </Col>
          <AutoForm
            schema={formSchema}
            model={model}
            onSubmit={(data) => {
              this.submit(data);
            }}
          >
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <TextField name="username" disabled />
                    <BoolField name="isCompliant" disabled />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextField name="firstName" />
                  </Col>
                  <Col>
                    <TextField name="lastName" />
                  </Col>
                  <Col>
                    <SelectField name="demographicLevel" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextField name="linkedIn" />
                  </Col>
                  <Col>
                    <TextField name="gitHub" />
                  </Col>
                  <Col>
                    <TextField name="slackUsername" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Multiselect
                      options={this.props.challenges}
                      selectedValues={this.state.selectedChallenges}
                      onSelect={(selectedList) =>
                        this.setState({ selectedChallenges: selectedList })
                      }
                      onRemove={(selectedList) =>
                        this.setState({ selectedChallenges: selectedList })
                      }
                      displayValue="title"
                      closeIcon="cancel"
                      placeholder="Select Challenges"
                    />
                  </Col>
                  <Col>
                    <Multiselect
                      options={this.props.skills}
                      selectedValues={this.state.selectedSkills}
                      onSelect={(selectedList) =>
                        this.setState({ selectedSkills: selectedList })
                      }
                      onRemove={(selectedList) =>
                        this.setState({ selectedSkills: selectedList })
                      }
                      displayValue="name"
                      closeIcon="cancel"
                      placeholder="Select Skills"
                    />
                  </Col>
                  <Col>
                    <Multiselect
                      options={this.props.tools}
                      selectedValues={this.state.selectedTools}
                      onSelect={(selectedList) =>
                        this.setState({ selectedTools: selectedList })
                      }
                      onRemove={(selectedList) =>
                        this.setState({ selectedTools: selectedList })
                      }
                      displayValue="name"
                      closeIcon="cancel"
                      placeholder="Select Tools"
                    />
                  </Col>
                </Row>
                <Row>
                  <TextField name="website" />
                  <LongTextField name="aboutMe" />
                </Row>
                <SubmitField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Row>
      </Container>
    );
  }
}

CreateProfileWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  skills: PropTypes.arrayOf(PropTypes.object).isRequired,
  challenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  tools: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withTracker(() => {
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
})(CreateProfileWidget);
