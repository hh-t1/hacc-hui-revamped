/* eslint-disable max-len */
import React from 'react';
import { Grid, Header, Item, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { _ } from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import { Teams } from '../../../api/team/TeamCollection';
import { ParticipantChallenges } from '../../../api/user/ParticipantChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { WantsToJoin } from '../../../api/team/WantToJoinCollection';
import InterestedParticipantCard from './InterestedParticipantCard';

/**
 * Renders the interested participants
 * @memberOf ui/pages
 */
class InterestedParticipants extends React.Component {
  render() {
    if (this.props.interestedDevs.length === 0) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Header as="h2" icon>
            <Icon name="users" />
            There are no interested partcipants at the moment.
            <Header.Subheader>Please check back later.</Header.Subheader>
          </Header>
        </div>
      );
    }

    const universalSkills = this.props.skills;

    function getDeveloperSkills(developerID, developerSkills) {
      const data = [];
      const skills = _.filter(developerSkills, { developerID: developerID });
      for (let i = 0; i < skills.length; i++) {
        for (let j = 0; j < universalSkills.length; j++) {
          if (skills[i].skillID === universalSkills[j]._id) {
            data.push({ name: universalSkills[j].name });
          }
        }
      }
      // console.log(data);
      return data;
    }

    const universalDevs = this.props.developers;

    function getInterestedDevelopers(devs) {
      const data = [];
      for (let i = 0; i < devs.length; i++) {
        for (let j = 0; j < universalDevs.length; j++) {
          if (devs[i].participantID === universalDevs[j]._id) {
            data.push(universalDevs[j]);
          }
        }
      }
      // console.log(data);
      return data;
    }

    const universalTools = this.props.tools;

    function getDeveloperTools(developerID, developerTools) {
      const data = [];
      const tools = _.filter(developerTools, { developerID: developerID });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push({ name: universalTools[j].name });
          }
        }
      }
      // console.log(data);
      return data;
    }

    const universalChallenges = this.props.challenges;

    function getDeveloperChallenges(developerID, developerChallenges) {
      const data = [];
      const challenges = _.filter(developerChallenges, {
        developerID: developerID,
      });
      for (let i = 0; i < challenges.length; i++) {
        for (let j = 0; j < universalChallenges.length; j++) {
          if (challenges[i].challengeID === universalChallenges[j]._id) {
            data.push(universalChallenges[j].title);
          }
        }
      }
      return data;
    }

    return (
      <Grid
        container
        doubling
        relaxed
        stackable
        style={{ marginBottom: '2rem' }}
      >
        <Grid.Row centered>
          <Header as={'h2'} style={{ paddingTop: '2rem' }}>
            Interested Participants for Team: {this.props.teams[0].name}
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Item.Group divided>
              {/* eslint-disable-next-line max-len */}
              {getInterestedDevelopers(this.props.interestedDevs).map(
                (developers) => (
                  <InterestedParticipantCard
                    key={developers._id}
                    developers={developers}
                    teams={this.props.teams}
                    skills={getDeveloperSkills(
                      developers._id,
                      this.props.developerSkills,
                    )}
                    tools={getDeveloperTools(
                      developers._id,
                      this.props.developerTools,
                    )}
                    challenges={getDeveloperChallenges(
                      developers._id,
                      this.props.developerChallenges,
                    )}
                  />
                ),
              )}
            </Item.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
InterestedParticipants.propTypes = {
  developerChallenges: PropTypes.array.isRequired,
  interestedDevs: PropTypes.array.isRequired,
  developerSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  developerTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  developers: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
};

export default withTracker(() => {
  // console.log(match);
  // const documentId = match.params._id;
  // eslint-disable-next-line no-undef
  let url = window.location.href;
  url = url.split('/');
  // console.log(url);
  const documentId = url[url.length - 1];
  // console.log(Teams.find({ _id: documentId }).fetch());
  // eslint-disable-next-line max-len
  // console.log(InterestedDevs.find({ teamID: TeamDevelopers.findDoc({ developerID: Developers.findDoc({ userID: Meteor.userId() })._id }).teamID }).fetch());
  return {
    // eslint-disable-next-line max-len
    developers: Participants.find({}).fetch(),
    developerChallenges: ParticipantChallenges.find({}).fetch(),
    developerSkills: ParticipantSkills.find({}).fetch(),
    developerTools: ParticipantTools.find({}).fetch(),
    // eslint-disable-next-line max-len
    interestedDevs: WantsToJoin.find({ teamID: documentId }).fetch(),
    teams: Teams.find({ _id: documentId }).fetch(),
    skills: Skills.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    // developers: Developers.find({}).fetch(),
  };
})(InterestedParticipants);
