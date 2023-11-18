import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SubmitField,
  TextField,
  SelectField,
} from 'uniforms-bootstrap5';
import Swal from 'sweetalert2';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { Teams } from '../../../api/team/TeamCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import MultiSelectField from '../../components/form-fields/MultiSelectField';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import RadioField from '../../components/form-fields/RadioField';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';

const EditTeamPage = () => {
  const { _id } = useParams();
  const {
    team,
    skills,
    challenges,
    tools,
    members,
    participants,
    allChallenges,
    allSkills,
    allTools,
    canChangeChallenges,
  } = useTracker(() => {
    const teamID = _id;
    const teamDoc = Teams.findDoc(teamID);
    const challengeIDs = TeamChallenges.find({ teamID }).fetch();
    const challengesDocs = challengeIDs.map((doc) =>
      Challenges.findDoc(doc.challengeID),
    );
    const skillIDs = TeamSkills.find({ teamID }).fetch();
    const skillsDocs = skillIDs.map((id) => Skills.findDoc(id.skillID));
    const toolIDs = TeamTools.find({ teamID }).fetch();
    const toolsDocs = toolIDs.map((id) => Tools.findDoc(id.toolID));
    const memberIDs = TeamParticipants.find({ teamID }).fetch();
    const membersDocs = memberIDs.map((id) =>
      Participants.findDoc(id.participantID),
    );
    const participantsDocs = Participants.find({}).fetch();
    const allChallengesDocs = Challenges.find({}).fetch();
    const allSkillsDocs = Skills.find({}).fetch();
    const allToolsDocs = Tools.find({}).fetch();
    const canChangeChallengesDoc =
      CanChangeChallenges.findOne().canChangeChallenges;
    return {
      team: teamDoc,
      skills: skillsDocs,
      challenges: challengesDocs,
      tools: toolsDocs,
      members: membersDocs,
      participants: participantsDocs,
      allChallenges: allChallengesDocs,
      allSkills: allSkillsDocs,
      allTools: allToolsDocs,
      canChangeChallenges: canChangeChallengesDoc,
    };
  }, []);

  const [bridge, setBridge] = useState(undefined);
  const [model, setModel] = useState(undefined);

  useEffect(() => {
    const buildTheFormSchema = () => {
      const challengeNames = allChallenges.map((c) => c.title);
      const skillNames = allSkills.map((s) => s.name);
      const toolNames = allTools.map((t) => t.name);
      const participantNames = participants.map((p) => p.username);
      const s = new SimpleSchema(
        {
          open: {
            type: String,
            allowedValues: ['Open', 'Close'],
            label: 'Availability',
          },
          name: { type: String },
          challenge: {
            type: String,
            allowedValues: challengeNames,
            optional: true,
          },
          skills: { type: Array, label: 'Skills', optional: true },
          'skills.$': { type: String, allowedValues: skillNames },
          tools: { type: Array, label: 'Toolsets', optional: true },
          'tools.$': { type: String, allowedValues: toolNames },
          members: { type: Array, optional: true },
          'members.$': { type: String, allowedValues: participantNames },
          description: String,
          gitHubRepo: { type: String, optional: true },
          devPostPage: { type: String, optional: true },
          affiliation: { type: String, optional: true },
        },
        {
          clean: {
            removeEmptyStrings: true,
            trimStrings: true,
          },
          requiredByDefault: true,
        },
      );
      return s;
    };

    const buildTheModel = () => {
      const m = team;
      m.challenges = challenges.map((challenge) => challenge.title);
      m.challenge = team.challenges[0];
      m.skills = skills.map((skill) => skill.name);
      m.tools = tools.map((tool) => tool.name);
      if (m.open) {
        m.open = 'Open';
      } else {
        m.open = 'Close';
      }
      const uniqueValues = [];
      members
        .map((member) => member.username)
        .forEach((member) => {
          if (!uniqueValues.includes(member)) {
            uniqueValues.push(member);
          }
        });
      m.members = uniqueValues;
      return m;
    };

    setBridge(new SimpleSchema2Bridge(buildTheFormSchema()));
    setModel(buildTheModel());
  }, []);

  const submitData = (data) => {
    const collectionName = Teams.getCollectionName();
    const updateData = {};
    updateData.id = data._id;
    updateData.name = data.name;
    updateData.description = data.description;
    updateData.gitHubRepo = data.gitHubRepo;
    updateData.devPostPage = data.devPostPage;
    updateData.affiliation = data.affiliation;
    updateData.open = data.open === 'Open';
    if (data.challenge) {
      // build an array of challenge slugs
      updateData.challenges = [];
      const doc = Challenges.findDoc({ title: data.challenge });
      updateData.challenges.push(Slugs.getNameFromID(doc.slugID));
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
    if (data.image) {
      updateData.image = data.image;
    }
    if (data.members) {
      updateData.participants = data.members;
    }
    updateMethod.call({ collectionName, updateData }, (error) => {
      if (error) {
        // console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href>Why do I have issue?</a>',
        });
      } else {
        Swal.fire({
          icon: 'success',
          text: 'Team updated.',
        });
      }
    });
  };

  return (
    <Container id="edit-team-page">
      <Card style={{ backgroundColor: '#E5F0FE', marginBottom: '2rem' }}>
        <Card.Body>
          {bridge && model ? (
            <AutoForm
              schema={bridge}
              model={model}
              onSubmit={submitData}
              style={{
                paddingBottom: '40px',
              }}
            >
              <div
                style={{
                  borderRadius: '10px',
                }}
                className={'createTeam'}
              >
                <h2>Edit Team</h2>
                <h4>
                  Team name and Devpost page ALL have to use the same name
                </h4>
                <Row>
                  <Col>
                    <TextField name="name" />
                  </Col>
                  <Col>
                    <RadioField name="open" inline />
                  </Col>
                </Row>
                <LongTextField name="description" />
                <SelectField name="challenge" disabled={!canChangeChallenges} />
                <Row>
                  <Col>
                    <MultiSelectField name="skills" />
                  </Col>
                  <Col>
                    <MultiSelectField name="tools" />
                  </Col>
                </Row>
                <TextField name="gitHubRepo" label="GitHub Repo" disabled />
                <TextField name="devPostPage" label="Devpost Page" />
                <TextField name="affiliation" />
                <MultiSelectField name="members" />
                <SubmitField
                  value="Submit"
                  style={{
                    color: 'white',
                    width: '100%',
                    margin: '20px 0px',
                  }}
                  inputClassName="btn btn-primary btn-lg w-100"
                />
                <ErrorsField />
              </div>
            </AutoForm>
          ) : (
            <Spinner animation="border" />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default withAllSubscriptions(EditTeamPage);
