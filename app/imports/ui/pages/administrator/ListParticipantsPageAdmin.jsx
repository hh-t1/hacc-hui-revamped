import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Form, InputGroup } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { FaSearch, FaUsers } from 'react-icons/fa';
import _ from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';

import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import ListParticipantsCardAdmin from '../../components/administrator/ListParticipantsCardAdmin';
import ListParticipantsFilterAdmin from '../../components/administrator/ListParticipantsFilterAdmin';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

const ListParticipantsPageAdmin = () => {
  const {
    participantChallenges,
    participantSkills,
    participantTools,
    universalTeams,
    teamParticipants,
    universalSkills,
    universalChallenges,
    universalTools,
    participants,
    teamInvitations,
  } = useTracker(() => {
    const participantChallengesDocs = ParticipantChallenges.find({}).fetch();
    const participantSkillsDocs = ParticipantSkills.find({}).fetch();
    const participantToolsDocs = ParticipantTools.find({}).fetch();
    const teamsDocs = Teams.find({}).fetch();
    const teamParticipantsDocs = TeamParticipants.find({}).fetch();
    const skillsDocs = Skills.find({}).fetch();
    const challengesDocs = Challenges.find({}).fetch();
    const toolsDocs = Tools.find({}).fetch();
    const participantsDocs = Participants.find(
      {},
      { sort: { lastName: 1, firstName: 1 } },
    ).fetch();
    const teamInvitationsDocs = TeamInvitations.find({}).fetch();
    return {
      participantChallenges: participantChallengesDocs,
      participantSkills: participantSkillsDocs,
      participantTools: participantToolsDocs,
      universalTeams: teamsDocs,
      teamParticipants: teamParticipantsDocs,
      universalSkills: skillsDocs,
      universalChallenges: challengesDocs,
      universalTools: toolsDocs,
      participants: participantsDocs,
      teamInvitations: teamInvitationsDocs,
    };
  }, []);

  const [search, setSearch] = useState('');
  const [teamsSelected, setTeamsSelected] = useState([]);
  const [challengesSelected, setChallengesSelected] = useState([]);
  const [skillsSelected, setSkillsSelected] = useState([]);
  const [toolsSelected, setToolsSelected] = useState([]);
  const [noTeamCheckbox, setNoTeamCheckbox] = useState(false);
  const [multipleTeamsCheckbox, setMultipleTeamsCheckbox] = useState(false);
  const [notCompliantCheckbox, setNotCompliantCheckbox] = useState(false);
  const [result, setResult] = useState(participants);

  if (participants.length === 0) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '3rem' }}>
        <FaUsers size={64} />
        <h2>There are no participants at the moment.</h2>
        <h3>Please check back later.</h3>
      </Container>
    );
  }

  const filters = new ListParticipantsFilterAdmin();

  const setFilters = () => {
    let res = [];
    res = filters.filterBySearch(participants, search);
    if (noTeamCheckbox) {
      res = filters.filterNoTeam(teamParticipants, res);
    }
    if (multipleTeamsCheckbox) {
      res = filters.filterMultipleTeams(teamParticipants, res);
    }
    if (notCompliantCheckbox) {
      res = res.filter((p) => !p.isCompliant);
    }
    res = filters.filterBySkills(
      skillsSelected,
      universalSkills,
      participantSkills,
      res,
    );
    res = filters.filterByTools(
      toolsSelected,
      universalTools,
      participantTools,
      res,
    );
    res = filters.filterByChallenge(
      challengesSelected,
      universalChallenges,
      participantChallenges,
      res,
    );
    res = filters.filterByTeam(
      teamsSelected,
      universalTeams,
      teamParticipants,
      res,
    );

    setResult(res);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const onUpdateSelect = (newList, targetListSetter) => {
    targetListSetter(newList.map((item) => item.value));
  };

  useEffect(() => {
    setFilters();
  }, [
    noTeamCheckbox,
    multipleTeamsCheckbox,
    notCompliantCheckbox,
    search,
    skillsSelected,
    toolsSelected,
    challengesSelected,
    teamsSelected,
  ]);

  function getParticipantSkills(participantID) {
    const data = [];
    const pSkills = participantSkills.filter(
      (skill) => skill.participantID === participantID,
    );
    for (let i = 0; i < pSkills.length; i++) {
      for (let j = 0; j < universalSkills.length; j++) {
        if (pSkills[i].skillID === universalSkills[j]._id) {
          data.push({ name: universalSkills[j].name });
        }
      }
    }
    return data;
  }

  function getParticipantTools(participantID) {
    const data = [];
    const pTools = participantTools.filter(
      (tool) => tool.participantID === participantID,
    );
    for (let i = 0; i < pTools.length; i++) {
      for (let j = 0; j < universalTools.length; j++) {
        if (pTools[i].toolID === universalTools[j]._id) {
          data.push({ name: universalTools[j].name });
        }
      }
    }
    return data;
  }

  function getParticipantChallenges(participantID) {
    const data = [];
    const pChallenges = participantChallenges.filter(
      (challenge) => challenge.participantID === participantID,
    );
    for (let i = 0; i < pChallenges.length; i++) {
      for (let j = 0; j < universalChallenges.length; j++) {
        if (pChallenges[i].challengeID === universalChallenges[j]._id) {
          data.push(universalChallenges[j].title);
        }
      }
    }
    return data;
  }

  function getParticipantTeams(participantID) {
    const data = [];
    const pTeams = teamParticipants.filter(
      (teamParticipant) => teamParticipant.participantID === participantID,
    );
    for (let i = 0; i < pTeams.length; i++) {
      for (let j = 0; j < universalTeams.length; j++) {
        if (pTeams[i].teamID === universalTeams[j]._id) {
          data.push(universalTeams[j].name);
        }
      }
    }
    return data;
  }

  const handleDownload = () => {
    const zip = new ZipZap();
    const dir = 'hacchui-participants';
    const fileName = `${dir}/${moment().format(
      databaseFileDateFormat,
    )}-participants.txt`;
    const emails = result.map((p) => p.username);
    zip.file(fileName, emails.join('\n'));
    zip.saveAs(`${dir}.zip`);
  };

  const sticky = {
    position: 'sticky',
    top: '13.3rem',
  };
  const filterStyle = {
    marginTop: '1.5rem',
  };
  const filterH2Style = {
    fontSize: '18px',
    fontWeight: 900,
    marginBottom: 0,
  };

  return (
    <Container className="mb-5" id="list-participants-admin-page">
      <div
        style={{
          backgroundColor: '#E5F0FE',
          padding: '1rem 0rem',
          margin: '2rem 0rem',
          borderRadius: '2rem',
        }}
      >
        <h1 style={{ textAlign: 'center' }}>All Participants</h1>
      </div>
      <Row>
        <Col xs={3}>
          <div style={sticky}>
            <Button variant="outline-secondary" onClick={handleDownload}>
              Download emails
            </Button>
            <div style={filterStyle}>
              <h2 style={filterH2Style}>Filter Participants</h2>
              <h3 style={{ fontSize: '16px', fontWeight: 400, color: 'gray' }}>
                Total Participants: {result.length}
              </h3>
              <Form.Check
                type="checkbox"
                label="No Team"
                checked={noTeamCheckbox}
                onChange={() => setNoTeamCheckbox((checked) => !checked)}
              />
              <Form.Check
                type="checkbox"
                label="Multiple Teams"
                checked={multipleTeamsCheckbox}
                onChange={() => setMultipleTeamsCheckbox((checked) => !checked)}
              />
              <Form.Check
                type="checkbox"
                label="Not Compliant"
                checked={notCompliantCheckbox}
                onChange={() => setNotCompliantCheckbox((checked) => !checked)}
              />
            </div>
            <div style={filterStyle}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  onChange={handleSearchChange}
                  placeholder="Search by participant's name..."
                />
              </InputGroup>

              <div style={filterStyle}>
                <h2 style={filterH2Style}>Teams</h2>
                <Multiselect
                  options={filters.dropdownValues(universalTeams, 'name')}
                  displayValue="text"
                  placeholder="Select teams..."
                  onSelect={(selected) =>
                    onUpdateSelect(selected, setTeamsSelected)
                  }
                  onRemove={(selected) =>
                    onUpdateSelect(selected, setTeamsSelected)
                  }
                />
              </div>

              <div style={filterStyle}>
                <h2 style={filterH2Style}>Challenges</h2>
                <Multiselect
                  options={filters.dropdownValues(universalChallenges, 'title')}
                  displayValue="text"
                  placeholder="Select challenges..."
                  onSelect={(selected) =>
                    onUpdateSelect(selected, setChallengesSelected)
                  }
                  onRemove={(selected) =>
                    onUpdateSelect(selected, setChallengesSelected)
                  }
                />
              </div>
            </div>
            <div style={filterStyle}>
              <h2 style={filterH2Style}>Skills</h2>
              <Multiselect
                options={filters.dropdownValues(universalSkills, 'name')}
                displayValue="text"
                placeholder="Select skills..."
                onSelect={(selected) =>
                  onUpdateSelect(selected, setSkillsSelected)
                }
                onRemove={(selected) =>
                  onUpdateSelect(selected, setSkillsSelected)
                }
              />
            </div>
            <div style={filterStyle}>
              <h2 style={filterH2Style}>Tools</h2>
              <Multiselect
                options={filters.dropdownValues(universalTools, 'name')}
                displayValue="text"
                placeholder="Select tools..."
                onSelect={(selected) =>
                  onUpdateSelect(selected, setToolsSelected)
                }
                onRemove={(selected) =>
                  onUpdateSelect(selected, setToolsSelected)
                }
              />
            </div>
          </div>
        </Col>
        <Col xs={9}>
          <div>
            {_.orderBy(result, ['lastName', 'firstName'], ['asc', 'asc']).map(
              (participant) =>
                participant ? (
                  <ListParticipantsCardAdmin
                    key={participant._id}
                    participantID={participant._id}
                    participant={participant}
                    skills={getParticipantSkills(participant._id)}
                    tools={getParticipantTools(participant._id)}
                    challenges={getParticipantChallenges(participant._id)}
                    teams={getParticipantTeams(participant._id)}
                    teamInvitations={teamInvitations}
                  />
                ) : undefined,
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default withAllSubscriptions(ListParticipantsPageAdmin);
