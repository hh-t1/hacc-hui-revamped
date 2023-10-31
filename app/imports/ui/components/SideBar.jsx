import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Header, Sidebar, Segment, Icon } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { MinorParticipants } from '../../api/user/MinorParticipantCollection';
import { HACCHui } from '../../api/hacc-hui/HACCHui';

/**
 * The SideBar appears on the side of every page. Rendered by the App Layout component.
 * @memberOf ui/components
 */
const SideBar = ({ children }) => {
  const { currentUser } = useTracker(() => {
    return {
      currentUser: Meteor.user() ? Meteor.user().username : '',
    };
  }, []);

  const [visible, setVisible] = useState(false);

  let isCompliant = HACCHui.canCreateTeams;
  const isAdmin =
    currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
  const isParticipant =
    currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);
  if (isParticipant) {
    const participant = Participants.findDoc({ userID: Meteor.userId() });
    isCompliant = isCompliant && participant.isCompliant;
  }

  const numParticipants = Participants.count();
  const numTeams = Teams.find({ open: true }).count();
  const teamCount = Teams.count();
  const suggestionCount = Suggestions.count();
  const minors = MinorParticipants.find({}).fetch();
  const uncompliantMinors = minors.filter(
    (m) => Participants.findDoc(m.participantID).isCompliant,
  ).length;

  return (
    <div>
      <Menu borderless inverted fixed={'top'} className={'mobileBar'}>
        <Menu.Item position={'left'}>
          <div
            onClick={() => setVisible((vis) => !vis)}
            style={{ padding: '5px' }}
          >
            <Icon name="bars" />
          </div>
        </Menu.Item>
      </Menu>
      <Sidebar.Pushable as={Segment} className={'sideBar'}>
        <Sidebar
          style={{ paddingTop: '4rem', backgroundColor: 'rgb(18, 72, 132)' }}
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          onHide={() => setVisible(false)}
          visible={visible}
          width="thin"
        >
          <Menu.Item
            as={NavLink}
            activeClassName=""
            exact
            to={ROUTES.LANDING}
            onClick={() => setVisible((vis) => !vis)}
          >
            <Header inverted as="h1">
              HACC-Hui
            </Header>
          </Menu.Item>
          {isParticipant
            ? [
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  disabled={!isCompliant}
                  exact
                  to={ROUTES.CREATE_TEAM}
                  key="team-creation"
                >
                  Create a Team
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.YOUR_PROFILE}
                  key="edit-profile"
                >
                  Your Profile
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.OPEN_TEAMS}
                  key="list-teams"
                >
                  List the Teams ({numTeams})
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  disabled={!isCompliant}
                  exact
                  to={ROUTES.YOUR_TEAMS}
                  key="your-teams"
                >
                  Your Teams
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.LIST_PARTICIPANTS}
                  key="list-participants"
                >
                  List the Participants ({numParticipants})
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.SUGGEST_TOOL_SKILL}
                  key="suggest-tool-skill"
                >
                  Suggest Tool/Skill
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.TEAM_INVITATIONS}
                  key="team-invitations"
                >
                  Your Invitations
                </Menu.Item>,
              ]
            : undefined}
          {isAdmin
            ? [
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.CONFIGURE_HACC}
                  key={ROUTES.CONFIGURE_HACC}
                >
                  Configure HACC
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.UPDATE_MP}
                  key={ROUTES.UPDATE_MP}
                >
                  Update Minor Participants Status ({uncompliantMinors})
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.LIST_SUGGESTIONS}
                  key={ROUTES.LIST_SUGGESTIONS}
                >
                  Suggestions List ({suggestionCount})
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.VIEW_TEAMS}
                  key={ROUTES.VIEW_TEAMS}
                >
                  View Team ({teamCount})
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.DUMP_DATABASE}
                  key={ROUTES.DUMP_DATABASE}
                >
                  Dump Database
                </Menu.Item>,
              ]
            : undefined}
          <Menu.Item>
            {currentUser === '' ? (
              <Menu.Item
                as={NavLink}
                activeClassName="active"
                exact
                to={ROUTES.SIGN_IN}
                key={ROUTES.SIGN_IN}
                onClick={() => setVisible((vis) => !vis)}
              >
                Sign In
              </Menu.Item>
            ) : (
              [
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.SIGN_OUT}
                  key={ROUTES.SIGN_OUT}
                  onClick={() => setVisible((vis) => !vis)}
                >
                  Sign Out
                </Menu.Item>,
                <Menu.Item
                  as={NavLink}
                  activeClassName="active"
                  exact
                  to={ROUTES.DELETE_ACCOUNT}
                  key={ROUTES.DELETE_ACCOUNT}
                  onClick={() => setVisible((vis) => !vis)}
                >
                  Delete Account
                </Menu.Item>,
              ]
            )}
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher style={{ paddingTop: '5rem' }}>
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

// Declare the types of all properties.
SideBar.propTypes = {
  children: PropTypes.array,
};

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default withRouter(SideBar);
