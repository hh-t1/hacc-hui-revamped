import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Row, Col, Container, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  BoolField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { demographicLevels } from '../../../api/level/Levels';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { ROUTES } from '../../../startup/client/route-constants';

class EditProfileWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { redirectToReferer: false };
    this.newSkillRef = React.createRef();
    this.newSkillLevelRef = React.createRef();
    this.newToolRef = React.createRef();
    this.newToolLevelRef = React.createRef();
  }

  buildTheFormSchema() {
    const challengeNames = _.map(this.props.allChallenges, (c) => c.title);
    const skillNames = _.map(this.props.allSkills, (s) => s.name);
    const toolNames = _.map(this.props.allTools, (t) => t.name);
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

  buildTheModel() {
    const model = this.props.participant;
    model.challenges = _.map(this.props.devChallenges, (challenge) => {
      const c = Challenges.findDoc(challenge.challengeID);
      return c.title;
    });
    model.skills = _.map(this.props.devSkills, (skill) => {
      // console.log(skill);
      const s = Skills.findDoc(skill.skillID);
      return s.name;
    });
    model.tools = _.map(this.props.devTools, (tool) => {
      const t = Tools.findDoc(tool.toolID);
      return t.name;
    });
    return model;
  }

  submitData(data) {
    // console.log('submit', data);
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
      updateData.challenges = this.state.selectedChallenges; // Access from component state
    }
    if (data.skills) {
      updateData.skills = this.state.selectedSkills; // Access from component state
    }
    if (data.tools) {
      updateData.tools = this.state.selectedTools; // Access from component state
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
    if (this.state.redirectToReferer) {
      const from = { pathname: ROUTES.YOUR_PROFILE };
      return <Redirect to={from} />;
    }
    const model = this.buildTheModel();
    const schema = this.buildTheFormSchema();
    const formSchema = new SimpleSchema2Bridge(schema);
    return (
      <Container className="justify-content-center my-3">
        <Row className="justify-content-center">
          <Col className="text-center my-2">
            <h2>Edit Profile</h2>
          </Col>
          <AutoForm
            schema={formSchema}
            model={model}
            onSubmit={(data) => {
              this.submitData(data);
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
                      options={this.props.allChallenges}
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
                      options={this.props.allSkills}
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
                      options={this.props.allTools}
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

EditProfileWidget.propTypes = {
  allChallenges: PropTypes.arrayOf(PropTypes.object).isRequired,
  allSkills: PropTypes.arrayOf(PropTypes.object).isRequired,
  allTools: PropTypes.arrayOf(PropTypes.object).isRequired,
  participant: PropTypes.object.isRequired,
  devChallenges: PropTypes.arrayOf(PropTypes.object),
  devSkills: PropTypes.arrayOf(PropTypes.object),
  devTools: PropTypes.arrayOf(PropTypes.object),
};

export default withTracker(() => {
  const allChallenges = Challenges.find({}).fetch();
  const allSkills = Skills.find({}).fetch();
  const allTools = Tools.find({}).fetch();
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const devChallenges = ParticipantChallenges.find({ participantID }).fetch();
  const devSkills = ParticipantSkills.find({ participantID }).fetch();
  const devTools = ParticipantTools.find({ participantID }).fetch();
  return {
    allChallenges,
    allSkills,
    allTools,
    participant,
    devChallenges,
    devSkills,
    devTools,
  };
})(EditProfileWidget);
