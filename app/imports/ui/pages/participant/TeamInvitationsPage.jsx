import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FaUsers } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import TeamInvitationCard from '../../components/participant/TeamInvitationCard';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import { paleBlueStyle } from '../../styles';

const TeamInvitationsPage = () => {
  const {
    teamChallenges,
    teamInvitations,
    teamSkills,
    teamTools,
    teams,
    skills,
    challenges,
    tools,
    participants,
    teamParticipants,
  } = useTracker(() => {
    const teamChallengesDocs = TeamChallenges.find({}).fetch();
    const teamInvitationsDocs = TeamInvitations.find({
      participantID: Participants.findDoc({ userID: Meteor.userId() })._id,
    }).fetch();
    const teamSkillsDocs = TeamSkills.find({}).fetch();
    const teamToolsDocs = TeamTools.find({}).fetch();
    const teamsDocs = Teams.find({}).fetch();
    const skillsDocs = Skills.find({}).fetch();
    const challengesDocs = Challenges.find({}).fetch();
    const toolsDocs = Tools.find({}).fetch();
    const participantsDocs = Participants.find({}).fetch();
    const teamParticipantsDocs = TeamParticipants.find({}).fetch();

    return {
      teamChallenges: teamChallengesDocs,
      teamInvitations: teamInvitationsDocs,
      teamSkills: teamSkillsDocs,
      teamTools: teamToolsDocs,
      teams: teamsDocs,
      skills: skillsDocs,
      challenges: challengesDocs,
      tools: toolsDocs,
      participants: participantsDocs,
      teamParticipants: teamParticipantsDocs,
    };
  });

  // const sortBy = [
  //   { key: 'teams', text: 'teams', value: 'teams' },
  //   { key: 'challenges', text: 'challenges', value: 'challenges' },
  //   { key: 'skills', text: 'skills', value: 'skills' },
  //   { key: 'tools', text: 'tools', value: 'tools' },
  // ];

  function getTeamInvitations(invs) {
    const data = [];
    for (let i = 0; i < invs.length; i++) {
      for (let j = 0; j < teams.length; j++) {
        if (invs[i].teamID === teams[j]._id) {
          data.push(teams[j]);
        }
      }
    }
    return data;
  }

  function getTeamSkills(teamID) {
    const data = [];
    const filteredSkills = teamSkills.filter((ts) => ts.teamID === teamID);
    for (let i = 0; i < filteredSkills.length; i++) {
      for (let j = 0; j < skills.length; j++) {
        if (filteredSkills[i].skillID === skills[j]._id) {
          data.push(skills[j].name);
        }
      }
    }
    return data;
  }

  function getTeamTools(teamID) {
    const data = [];
    const filteredTools = teamTools.filter((tt) => tt.teamID === teamID);
    for (let i = 0; i < filteredTools.length; i++) {
      for (let j = 0; j < tools.length; j++) {
        if (filteredTools[i].toolID === tools[j]._id) {
          data.push(tools[j].name);
        }
      }
    }
    return data;
  }

  function getTeamChallenges(teamID) {
    const data = [];
    const filteredChallenges = teamChallenges.filter(
      (tc) => tc.teamID === teamID,
    );
    for (let i = 0; i < filteredChallenges.length; i++) {
      for (let j = 0; j < challenges.length; j++) {
        if (filteredChallenges[i].challengeID === challenges[j]._id) {
          data.push(challenges[j].title);
        }
      }
    }
    return data;
  }

  function getTeamDevelopers(teamID) {
    const data = [];
    const filteredParticipants = teamParticipants.filter(
      (tp) => tp.teamID === teamID,
    );
    for (let i = 0; i < filteredParticipants.length; i++) {
      for (let j = 0; j < participants.length; j++) {
        if (filteredParticipants[i].participantID === participants[j]._id) {
          data.push({
            firstName: participants[j].firstName,
            lastName: participants[j].lastName,
          });
        }
      }
    }
    return data;
  }

  return (
    <Container id="team-invitations-page">
      {teamInvitations.length !== 0 ? (
        <div style={{ paddingBottom: '50px', paddingTop: '40px' }}>
          <div
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <div style={paleBlueStyle}>
              <h2 style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                Team Invitations
              </h2>
            </div>
            <div>
              {getTeamInvitations(teamInvitations).map((teamInvitation) => (
                <TeamInvitationCard
                  key={teamInvitation._id}
                  teams={teamInvitation}
                  skills={getTeamSkills(teamInvitation._id)}
                  tools={getTeamTools(teamInvitation._id)}
                  challenges={getTeamChallenges(teamInvitation._id)}
                  participants={getTeamDevelopers(teamInvitation._id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
          <FaUsers size={60} />
          <h2>You have no invitations at the moment.</h2>
          <h3>Please check back later.</h3>
        </div>
      )}
    </Container>
  );
};

export default withAllSubscriptions(TeamInvitationsPage);
