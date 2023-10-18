import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { CanCreateTeams } from '../../api/team/CanCreateTeamCollection';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavDropdown } from 'react-bootstrap/NavDropdown';


const NavBar = () => {
    const { currentUser, canCreateTeams } = useTracker(() => ({
      currentUser: Meteor.user() ? Meteor.user().username : '',
      canCreateTeams: CanCreateTeams.findOne().canCreateTeams,
    }));

    let isCompliant = canCreateTeams;
    const isAdmin = currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParticipant = currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);

    const numParticipants = Participants.count();
    const numTeams = Teams.find({ open: true }).count();
    const teamCount = Teams.count();
    const suggestionCount = Suggestions.count();
    
    if (isParticipant) {
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      isCompliant = isCompliant && participant.isCompliant;
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={NavLink} exact to={ROUTES.LANDING} href="#home" style={{ paddingLeft: '14px'}}>React-Bootstrap</Navbar.Brand>
            <Nav>
              {isParticipant ? (
                <>
                  <Nav.Link as={NavLink} exact to={ROUTES.YOUR_PROFILE} href="#profile">Profile</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.CREATE_TEAM} href="#createTeam">Create Team</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.OPEN_TEAMS} href="#openTeams">Open Teams</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.YOUR_TEAMS} href="#yourTeams">Your Teams</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.LIST_PARTICIPANTS} href="#listParticipants">List Participants</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.SUGGEST_TOOL_SKILL} href="#suggestTools/Skills">Suggest Tools/Skills</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.TEAM_INVITATIONS} href="#invitations">Invitations</Nav.Link>
                </>
              ) : isAdmin ? (
                <>
                  <Nav.Link as={NavLink} exact to={ROUTES.CONFIGURE_HACC} href="#configureHACC">Configure HACC</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.UPDATE_MP} href="#updateMP">Update Minor Participants Status</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.LIST_SUGGESTIONS} href="#suggestionsList">Suggestions List ({suggestionCount})</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.LIST_PARTICIPANTS_ADMIN} href="#listParticipants">List Participants ({numParticipants})</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.VIEW_TEAMS} href="#viewTeams">View Teams ({teamCount})</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.ALL_TEAM_INVITATIONS} href="#viewAllTeamInvitations">View All Team Invitations</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.DUMP_DATABASE} href="#dumpDatabase">Dump Database</Nav.Link>
                </>
              ) : (
                <>
                </>
              )}
            </Nav>
            <Nav className="ml-auto">
              <Nav.Link as={NavLink} exact to={ROUTES.HELP_PAGE} href="#help">Help</Nav.Link> 
              {isParticipant ? (
                <>
                  <Nav.Link as={NavLink} to={ROUTES.SIGN_OUT}>Sign Out</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.DELETE_ACCOUNT}>Delete Account</Nav.Link> 
                </>
              ) : isAdmin ? (
                <>
                  <Nav.Link as={NavLink} to={ROUTES.SIGN_OUT}>Sign Out</Nav.Link>
                  <Nav.Link as={NavLink} exact to={ROUTES.DELETE_ACCOUNT}>Delete Account</Nav.Link> 
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to={ROUTES.SIGN_IN}>Sign In</Nav.Link>
                </>
              )}
            </Nav>
        </Navbar>
    );
};

// Declare the types of all properties.
NavBar.propTypes = {
  currentUser: PropTypes.string,
  canCreateTeams: PropTypes.bool,
};

export default NavBar;
