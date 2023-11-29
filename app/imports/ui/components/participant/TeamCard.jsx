import React from 'react';
import PropTypes from 'prop-types';
import { Header, List } from 'semantic-ui-react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import _ from 'lodash';
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

class TeamCard extends React.Component {
  buildTheTeam() {
    const { team } = this.props;
    const teamID = team._id;
    const tCs = TeamChallenges.find({ teamID }).fetch();
    const challengeTitles = _.map(tCs, (tc) => Challenges.findDoc(tc.challengeID).title);
    team.challenges = challengeTitles;
    team.skills = TeamSkills.find({ teamID }).fetch();
    team.tools = TeamTools.find({ teamID }).fetch();
    const teamPs = TeamParticipants.find({ teamID }).fetch();
    team.members = _.map(teamPs, (tp) => Participants.getFullName(tp.participantID));
    return team;
  }

  handleLeaveTeam(e, inst) {
    console.log(e, inst);
    const { team } = inst;
    const pDoc = Participants.findDoc({ userID: Meteor.userId() });
    let collectionName = LeavingTeams.getCollectionName();
    const definitionData = {
      username: pDoc.username,
      team: team._id,
    };
    defineMethod.call({ collectionName, definitionData }, (error) => {
      if (error) {
        console.error('failed to define', error);
      }
    });
    const teamPart = TeamParticipants.findDoc({ teamID: team._id, participantID: pDoc._id });
    console.log(teamPart);
    collectionName = TeamParticipants.getCollectionName();
    const instance = teamPart._id;
    removeItMethod.call({ collectionName, instance }, (err) => {
      if (err) {
        console.error('failed to remove from team', err);
      }
    });
  }

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
                  <Header size="tiny">Challenges</Header>
                  {team.challenges.join(', ')}
                </Col>
                <Col>
                  <Header size="tiny">Desired Skills</Header>
                  <List bulleted>
                    {team.skills.map((item) => <SkillItem item={item} key={item._id} />)}
                  </List>
                </Col>
                <Col>
                  <Header size="tiny">Desired Tools</Header>
                  <List bulleted>
                    {team.tools.map((item) => <ToolItem item={item} key={item._id} />)}
                  </List>
                </Col>
                <Col>
                  <Header size="tiny">Members</Header>
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
  }
}

TeamCard.propTypes = {
  team: PropTypes.object.isRequired,
  participantID: PropTypes.string.isRequired,
};

export default TeamCard;
