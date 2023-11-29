import React, { useRef, useState } from 'react';
import { Container, Col, Button, Modal, Row, ListGroup } from 'react-bootstrap';
import { BsHandThumbsDown } from 'react-icons/bs';
import { BiCheck } from 'react-icons/bi';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SelectField,
  SubmitField,
  TextField,
  ListItemField,
  ListField,
} from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import RadioField from '../../components/form-fields/RadioField';
import { Teams } from '../../../api/team/TeamCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';

const CreateTeamPage = () => {
  const { participant, challenges, skills, tools, canCreateTeams } =
    useTracker(() => {
      const participantDoc = Participants.findDoc({ userID: Meteor.userId() });
      const challengesDocs = Challenges.find({}).fetch();
      const skillsDocs = Skills.find({}).fetch();
      const toolsDocs = Tools.find({}).fetch();
      const canCreateTeamsDoc = CanCreateTeams.findOne().canCreateTeams;
      return {
        participant: participantDoc,
        challenges: challengesDocs,
        skills: skillsDocs,
        tools: toolsDocs,
        canCreateTeams: canCreateTeamsDoc,
      };
    }, []);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState([]);
  const [notRegistered, setNotRegistered] = useState([]);

  const formRef = useRef(null);

  const buildTheModel = () => {
    return {
      skills: [],
      tools: [],
    };
  };

  const buildTheFormSchema = () => {
    const challengeNames = challenges.map((c) => c.title);
    const skillNames = skills.map((s) => s.name);
    const toolNames = tools.map((t) => t.name);
    const schema = new SimpleSchema({
      open: {
        type: String,
        allowedValues: ['Open', 'Close'],
        label: 'Availability',
      },
      name: { type: String, label: 'Team Name' },
      challenge: {
        type: String,
        allowedValues: challengeNames,
        optional: true,
      },
      skills: { type: Array, label: 'Skills', optional: true },
      'skills.$': { type: String, allowedValues: skillNames },
      tools: { type: Array, label: 'Toolsets', optional: true },
      'tools.$': { type: String, allowedValues: toolNames },
      // participants: { type: String, label: 'participants' },
      description: String,
      devpostPage: { type: String, optional: true },
      affiliation: { type: String, optional: true },

      participants: {
        optional: true,
        type: Array,
        minCount: 0,
      },
      'participants.$': {
        optional: true,
        type: Object,
      },
      'participants.$.email': {
        optional: true,
        type: String,
        min: 3,
      },
    });
    return schema;
  };

  /** On submit, insert the data.
   * @param formData {Object} the results from the form.
   */
  const submit = (formData) => {
    this.setState({ isRegistered: [] });
    this.setState({ notRegistered: [] });
    const owner = participant.username;
    const {
      name: formName,
      description: formDescription,
      challenge: formChallenge,
      participants: formParticipants,
    } = formData;
    if (/^[a-zA-Z0-9-]*$/.test(formName) === false) {
      swal(
        'Error',
        'Sorry, no special characters or space allowed in the Team name.',
        'error',
      );
      return;
    }
    let partArray = [];

    if (typeof formParticipants !== 'undefined') {
      partArray = formParticipants;
    }

    const currPart = Participants.find({}).fetch();
    const tempIsRegistered = [];
    const tempNotRegistered = [];
    // console.log(currPart, partArray);
    for (let i = 0; i < partArray.length; i++) {
      let registered = false;
      for (let j = 0; j < currPart.length; j++) {
        if (currPart[j].username === partArray[i].email) {
          registered = true;
          setIsRegistered([...isRegistered, `-${partArray[i].email}`]);
          tempIsRegistered.push(partArray[i].email);
        }
      }
      if (!registered) {
        setNotRegistered([...notRegistered, `-${partArray[i].email}`]);
        tempNotRegistered.push(partArray[i].email);
      }
    }
    if (tempNotRegistered.length !== 0) {
      setShowErrorModal(true);
    }

    let { open } = formData;
    if (open === 'Open') {
      open = true;
    } else {
      open = false;
    }

    const skillsArr = skills.map((n) => {
      const doc = Skills.findDoc({ name: n });
      return Slugs.getNameFromID(doc.slugID);
    });
    const toolsArr = tools.map((t) => {
      const doc = Tools.findDoc({ name: t });
      return Slugs.getNameFromID(doc.slugID);
    });
    const challengesArr = [];
    if (formChallenge) {
      const challengeDoc = Challenges.findDoc({ title: formChallenge });
      const challengeSlug = Slugs.getNameFromID(challengeDoc.slugID);
      challengesArr.push(challengeSlug);
    }
    const collectionName = Teams.getCollectionName();
    const definitionData = {
      name: formName,
      description: formDescription,
      owner,
      open,
      challenges: challengesArr,
      skills: skillsArr,
      tools: toolsArr,
    };
    // console.log(collectionName, definitionData);
    defineMethod.call(
      {
        collectionName,
        definitionData,
      },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          if (!showErrorModal) {
            swal('Success', 'Team created successfully', 'success');
          }
          formRef.reset();
        }
      },
    );

    // sending invites out to registered members
    for (let i = 0; i < tempIsRegistered.length; i++) {
      const newTeamID = Teams.find({ name: formName }).fetch();
      const teamDoc = Teams.findDoc(newTeamID[0]._id);
      const team = Slugs.getNameFromID(teamDoc.slugID);
      const inviteCollection = TeamInvitations.getCollectionName();
      const inviteData = { team: team, participant: tempIsRegistered[i] };
      defineMethod.call(
        { collectionName: inviteCollection, definitionData: inviteData },
        // (error) => {
        //   if (error) {
        //     console.error(error.message);
        //   } else {
        //     console.log('Success');
        //   }
        // },
      );
    }
  };

  const closeModal = () => {
    setShowErrorModal(false);
    swal('Success', 'Team created successfully', 'success');
  };

  if (!participant.isCompliant) {
    return (
      <Container id="create-team-page">
        <div style={{ textAlign: 'center' }}>
          <Container as="h2">
            <BsHandThumbsDown />
            You have not agreed to the{' '}
            <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
            &nbsp;or we&apos;ve haven&apos;t received the signed form yet.
            <Col>
              You cannot create a team until you do agree to the rules. Please
              check back later.
            </Col>
          </Container>
        </div>
      </Container>
    );
  }

  const formSchema = new SimpleSchema2Bridge(buildTheFormSchema());
  const model = buildTheModel();
  const disabled = !canCreateTeams;
  return (
    <Container
      id="create-team-page"
      centered
      style={{ paddingBottom: '50px', paddingTop: '40px' }}
    >
      <Row>
        <hr />
        <ul
          style={{
            // borderRadius: '10px',
            backgroundColor: '#E5F0FE',
          }}
          className={'createTeam'}
        >
          <h2>Create a Team</h2>
          <h4>
            Team name and Devpost page ALL have to use the same name. Team names
            cannot have spaces or special characters.
          </h4>
          <AutoForm
            ref={formRef}
            schema={formSchema}
            model={model}
            onSubmit={submit}
            style={{
              paddingBottom: '40px',
            }}
          >
            <Row style={{ paddingTop: '20px' }}>
              <Row style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <Col className="doubleLine">
                  <TextField name="name" />
                  <RadioField name="open" inline />
                </Col>
                <LongTextField name="description" />
                <SelectField name="challenge" />
                <Col>
                  <MultiSelectField name="skills" />
                  <MultiSelectField name="tools" />
                </Col>
                <TextField name="devpostPage" />
                <TextField name="affiliation" />

                <ListField
                  name="participants"
                  label={"Enter each participant's email"}
                >
                  <ListItemField name="$">
                    <TextField
                      showInlineError
                      iconLeft="mail"
                      name="email"
                      label={'Email'}
                    />
                  </ListItemField>
                </ListField>
              </Row>
            </Row>
            <div style={{ textAlign: 'center' }}>
              <SubmitField
                value="Submit"
                style={{
                  color: 'white',
                  backgroundColor: '#dd000a',
                  margin: '20px 0px',
                }}
                disabled={disabled}
              />
            </div>
            <ErrorsField />
          </AutoForm>
        </ul>
        <Modal onClose={closeModal} open={showErrorModal}>
          <Modal.Header>Member Warning</Modal.Header>
          <Modal.Content scrolling>
            <Modal.Description>
              <Container>
                Some Members you are trying to invite have not registered with
                SlackBot.
              </Container>
              <b>Registered Members:</b>
              <ListGroup>
                {isRegistered.map((e, idx) => (
                  <ListGroup.Item key={`key-${e}-${idx}`}>{e}</ListGroup.Item>
                ))}
              </ListGroup>
              <b>Not Registered Members:</b>
              <ListGroup>
                {notRegistered.map((e, idx) => (
                  <ListGroup.Item key={`key-${e}-${idx}`}>{e}</ListGroup.Item>
                ))}
              </ListGroup>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <b style={{ float: 'left' }}>
              Slackbot will only send invites to registered members, please
              confirm.
            </b>
            <Button align="right" onClick={closeModal}>
              <BiCheck /> I Understand
            </Button>
          </Modal.Actions>
        </Modal>
      </Row>
    </Container>
  );
};

export default withAllSubscriptions(CreateTeamPage);
