import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'lodash';
import { Teams } from '../../../api/team/TeamCollection';
import { TeamParticipants } from '../../../api/team/TeamParticipantCollection';
import { Participants } from '../../../api/user/ParticipantCollection';
import { TeamInvitations } from '../../../api/team/TeamInvitationCollection';
import YourTeamsCard from './YourTeamsCard';
import MemberTeamCard from './MemberTeamCard';

/**
 * Widget to list teams
 * @memberOf ui/pages
 */
class YourTeamsWidget extends React.Component {
  render() {
    const allParticipants = this.props.participants;

    function getTeamParticipants(teamID, teamParticipants) {
      const data = [];
      const participants = _.uniqBy(
        _.filter(teamParticipants, { teamID: teamID }),
        'participantID',
      );
      // console.log(participants);
      for (let i = 0; i < participants.length; i++) {
        for (let j = 0; j < allParticipants.length; j++) {
          if (participants[i].participantID === allParticipants[j]._id) {
            data.push({
              firstName: allParticipants[j].firstName,
              lastName: allParticipants[j].lastName,
            });
          }
        }
      }
      return data;
    }

    if (!this.props.participant.isCompliant) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>
            You have not agreed to the{' '}
            <a href="https://hacc.hawaii.gov/hacc-rules/">HACC Rules</a>
            &nbsp;or we&apos;ve haven&apos;t received the signed form yet.
            <h4>
              You can&apos;t be the owner of a team until you do. Please check
              back later.
            </h4>
          </h2>
        </div>
      );
    }
    if (this.props.teams.length + this.props.memberTeams.length === 0) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>
            You are not the owner or member of any teams
            <h4>Please check back later.</h4>
          </h2>
        </div>
      );
    }

    return (
      <Container className="justify-content-center">
        <Row className="justify-content-center">
          <h2 style={{ textAlign: 'center' }}>Your Teams</h2>
        </Row>
        {this.props.teams.length === 0 ? (
          ''
        ) : (
          <Col width={15}>
            <Card>
              <h4 style={{ textAlign: 'center' }}>Owner</h4>
              <Card.Body divided>
                {this.props.teams.map((teams) => (
                  <YourTeamsCard
                    key={teams._id}
                    teams={teams}
                    teamParticipants={getTeamParticipants(
                      this.props.teamParticipants,
                    )}
                    teamInvitation={this.props.teamInvitation}
                  />
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
        {this.props.memberTeams.length === 0 ? (
          ''
        ) : (
          <Col width={15}>
            <Card>
              <h4 style={{ textAlign: 'center' }}>Member</h4>
              <Card.Body divided>
                {this.props.memberTeams.map((team) => (
                  <MemberTeamCard
                    key={team._id}
                    team={team}
                    teamParticipants={getTeamParticipants(
                      team._id,
                      this.props.teamParticipants,
                    )}
                  />
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Container>
    );
  }
}

YourTeamsWidget.propTypes = {
  participant: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  memberTeams: PropTypes.arrayOf(PropTypes.object).isRequired,
  teamParticipants: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  teamInvitation: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const participant = Participants.findDoc({ userID: Meteor.userId() });
  const participantID = participant._id;
  const teams = Teams.find({ owner: participantID }).fetch();
  const memberTeams = _.map(
    _.uniqBy(TeamParticipants.find({ participantID }).fetch(), 'teamID'),
    (tp) => Teams.findDoc(tp.teamID),
  );
  const participants = Participants.find({}).fetch();
  const teamParticipants = TeamParticipants.find({}).fetch();
  const teamInvitation = TeamInvitations.find({}).fetch();
  // console.log(memberTeams);
  return {
    participant,
    teams,
    memberTeams,
    participants,
    teamParticipants,
    teamInvitation,
  };
})(YourTeamsWidget);
