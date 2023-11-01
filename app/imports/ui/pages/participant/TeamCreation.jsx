import React, { useRef } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  open: {
    type: String,
    allowedValues: ['Open', 'Close'],
    label: 'Availability',
  },
  name: String,
  image: { type: String, optional: true },
  challenges: { type: Array, label: 'Challenges' },
  'challenges.$': { type: String },
  skills: { type: Array, label: 'Skills' },
  'skills.$': { type: String },
  tools: { type: Array, label: 'Toolsets' },
  'tools.$': { type: String },
  description: String,
  github: { type: String, optional: true },
  devpostPage: { type: String, optional: true },
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class TeamCreation extends React.Component {

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */
  // eslint-disable-next-line no-unused-vars
  submit(formData, formRef) {

    const skillsArr = this.props.skills;
    const skillsObj = [];

    const toolsArr = this.props.tools;
    const toolsObj = [];

    const challengesArr = this.props.challenges;
    const challengesObj = [];

    const owner = Participants.findDoc({ userID: Meteor.userId() }).username;

    const {
      name, description, challenges, skills, tools, image,
    } = formData;
    let { open } = formData;
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
    }

    for (let i = 0; i < skillsArr.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (skillsArr[i].name === skills[j]) {
          skillsObj.push(Slugs.getNameFromID(skillsArr[i].slugID));
        }
      }
    }

    for (let i = 0; i < toolsArr.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (toolsArr[i].name === tools[j]) {
          toolsObj.push(Slugs.getNameFromID(toolsArr[i].slugID));
        }
      }
    }

    for (let i = 0; i < challengesArr.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (challengesArr[i].title === challenges[j]) {
          challengesObj.push(Slugs.getNameFromID(challengesArr[i].slugID));
        }
      }
    }

    // If the name has special character or space, throw a swal error and return early.
    if (/^[a-zA-Z0-9-]*$/.test(name) === false) {
      swal('Error', 'Sorry, no special characters or space allowed.', 'error');
      return;
    }
    const collectionName = Teams.getCollectionName();
    const definitionData = {
      name,
      description,
      owner,
      open,
      image,
      challenges: challengesObj,
      skills: skillsObj,
      tools: toolsObj,
    };
    defineMethod.call({
          collectionName,
          definitionData,
        },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Team created successfully', 'success');
            formRef.reset();
          }
        });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return (this.props.ready) ? this.renderPage() :
      <div className="spinner-border" role="status">
        <span className="sr-only">Getting data</span>
      </div>;
  }

  renderPage() {
    const fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);
    const challengeArr = this.props.challenges.map('title');
    const skillArr = this.props.skills.map('name');
    const toolArr = this.props.tools.map('name');

    return (
        <Container centered>
          <Row>
            <hr />
            <AutoForm ref={useRef(fRef)} schema={formSchema} onSubmit={data => this.submit(data, fRef)}
                      style={{
                        paddingBottom: '40px',
                      }}>
              <ul
                style={{
                borderRadius: '10px',
                backgroundColor: '#E5F0FE',
              }} className={'createTeam'}>
                <Row columns={1} style={{ paddingTop: '20px' }}>
                  <Col style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                    <Container as="h2" textAlign="center" inverted>Team Information</Container>
                    <Col className='doubleLine'>
                      <TextField name='name' />
                      <div className="form-check">
                        <input className="form-check-input" type="radio" value="" id="flexRadioDefault"/>
                        <label className="form-check-label" htmlFor="flexRadioDefault">
                          open
                        </label>
                      </div>
                    </Col>
                    <TextField name='image' placeholder={'Team Image URL'} />
                    <LongTextField name='description' />
                    <MultiSelectField name='challenges' placeholder={'Challenges'}
                                      allowedValues={challengeArr} required />
                    <MultiSelectField name='skills' placeholder={'Skills'}
                                      allowedValues={skillArr} required />
                    <MultiSelectField name='tools' placeholder={'Toolsets'}
                                      allowedValues={toolArr} required />
                    <TextField name="github" />
                    <TextField name="devpostPage" />
                  </Col>
                </Row>
                <div style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <SubmitField value='Submit'
                               style={{
                                 color: 'white', backgroundColor: '#dd000a',
                                 margin: '20px 0px',
                               }} />
                </div>
                <ErrorsField />
              </ul>
            </AutoForm>
          </Row>
        </Container>
    );
  }
}

TeamCreation.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,

};

export default useTracker(() => {
  const subscriptionChallenges = Challenges.subscribe();
  const subscriptionSkills = Skills.subscribe();
  const subscriptionTools = Tools.subscribe();
  const subscriptionParticipants = Participants.subscribe();

  return {
    challenges: Challenges.find({}).fetch(),
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    participants: Participants.find({}).fetch(),
    // eslint-disable-next-line max-len
    ready: subscriptionChallenges.ready() && subscriptionSkills.ready() && subscriptionTools.ready() && subscriptionParticipants.ready(),
  };
})(TeamCreation);
