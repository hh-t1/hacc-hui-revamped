import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Row, List } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { TeamChallenges } from '../../../api/team/TeamChallengeCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { TeamSkills } from '../../../api/team/TeamSkillCollection';
import { TeamTools } from '../../../api/team/TeamToolCollection';
import SkillItem from './SkillItem';
import ToolItem from './ToolItem';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { LeavingTeams } from '../../../api/team/LeavingTeamCollection';
import { defineMethod, removeItMethod } from '../../../api/base/BaseCollection.methods';

const TeamCard = ({
  buildTheTeam() {
    const { team } = this.props;
    const teamID = team.id;
    const tCs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = tCs.map(tCs, (tc) => Challenges.findDoc(tc.challengeID).title);
    team.challenges = challengeTitles;
    team.skills = TeamSkills.find({ teamID }).fetch();
    team.tools = TeamTools.find({ teamID }).fetch();
    const teamPs = TeamParticipants.find({ teamID }).fetch();
    team.members = teamPs.map(teamPs, (tp) => Participants.getFullName(tp.participantID));
    return team;
  },

  handleLeaveTeam(e, inst) {
    console.log(e, inst);
    const { team } = inst;
    const pDoc = Participants.findDoc({ userID: Meteor.userId() });
    let collectionName = LeavingTeams.getCollectionName();
    const definitionData = {
      username: pDoc.username,
      team: team.id,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('failed to define', error);
      }
    });
    const teamPart = TeamParticipants.findDoc({ teamID: team.id, participantID: pDoc.id });
    console.log(teamPart);
    collectionName = TeamParticipants.getCollectionName();
    const instance = teamPart.id;
    removeItMethod.call({ collectionName, instance }, (err) => {
      if (err) {
        console.error('failed to remove from team', err);
      }
    });
  },

  render() {
    const team = this.buildTheTeam();
    const isOwner = team.owner === this.props.participantID;
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>{team.name}</Card.Header>
          <Card.Description>
            <Row container stackable columns={5}>
              <Col>
                <h4>Challenges</h4>
                {team.challenges.join(', ')}
              </Col>
              <Col>
                <h4>Desired Skills</h4>
                <List bulleted>
                  {team.skills.map((item) => <SkillItem item={item} key={item.id} />)}
                </List>
              </Col>
              <Col>
                <h4>Desired Tools</h4>
                <List bulleted>
                  {team.tools.map((item) => <ToolItem item={item} key={item.id} />)}
                </List>
              </Col>
              <Col>
                <h4>Members</h4>
                <List>
                  {team.members.map((member, index) => <List.Item key={`${index}${member}`}>{member}</List.Item>)}
                </List>
              </Col>
              <Col>
                <Button team={team} disabled={isOwner} color="red" onClick={this.handleLeaveTeam}>Leave team</Button>
              </Col>
            </Row>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  },
});

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  participantID: PropTypes.string.isRequired,
};

export default TeamCard;