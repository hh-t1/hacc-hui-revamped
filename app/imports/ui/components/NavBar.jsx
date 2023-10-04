import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { ROUTES } from '../../startup/client/route-constants';
import { Participants } from '../../api/user/ParticipantCollection';
import { Teams } from '../../api/team/TeamCollection';
import { Suggestions } from '../../api/suggestions/SuggestionCollection';
import { CanCreateTeams } from '../../api/team/CanCreateTeamCollection';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
    let isCompliant = this.props.canCreateTeams;
    const isAdmin = this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.ADMIN);
    const isParticipant =
      this.props.currentUser && Roles.userIsInRole(Meteor.userId(), ROLE.PARTICIPANT);
    if (isParticipant) {
      const participant = Participants.findDoc({ userID: Meteor.userId() });
      isCompliant = isCompliant && participant.isCompliant;
    }

    const numParticipants = Participants.count();
    const numTeams = Teams.find({ open: true }).count();
    const teamCount = Teams.count();
    const suggestionCount = Suggestions.count();

  return (
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={NavLink} exact to={ROUTES.LANDING} href="#home" style={{ paddingLeft: '14px'}}>React-Bootstrap</Navbar.Brand>
        <Nav>
          (isParticipant && 
            [
              <Nav.Link as={NavLink} exact to={ROUTES.YOUR_PROFILE} href="#profile">Profile</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.CREATE_TEAM} href="#createTeam">Create Team</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.OPEN_TEAMS} href="#openTeams">Open Teams</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.YOUR_TEAMS} href="#yourTeams">Your Teams</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.LIST_PARTICIPANTS} href="#listParticipants">List Participants</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.SUGGEST_TOOL_SKILL} href="#suggestTools/Skills">Suggest Tools/Skills</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.TEAM_INVITATIONS} href="#invitations">Invitations</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.HELP_PAGE} href="#help">Help</Nav.Link> 
            ]
          )
        </Nav>
    </Navbar>
    // <Nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    //   <Nav.Link as={NavLink} exact to={ROUTES.}>Home</Nav.Link>
    //   <Nav.Link as={NavLink} exact to={ROUTES.LANDING}href="#link">Link</Nav.Link>
    // </Nav>
  );
};

/*
          {isParticipant ? (
            <>
              <Nav.Link as={NavLink} exact to={ROUTES.YOUR_PROFILE} href="#profile">Profile</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.CREATE_TEAM} href="#createTeam">Create Team</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.OPEN_TEAMS} href="#openTeams">Open Teams</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.YOUR_TEAMS} href="#yourTeams">Your Teams</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.LIST_PARTICIPANTS} href="#listParticipants">List Participants</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.SUGGEST_TOOL_SKILL} href="#suggestTools/Skills">Suggest Tools/Skills</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.TEAM_INVITATIONS} href="#invitations">Invitations</Nav.Link>
              <Nav.Link as={NavLink} exact to={ROUTES.HELP_PAGE} href="#help">Help</Nav.Link>
            </>
          ) : isAdmin ? (
            <>

            </>
          )  : (
            <>
            </>
          )
          }
*/
// Declare the types of all properties.
NavBar.propTypes = {
  currentUser: PropTypes.string,
  canCreateTeams: PropTypes.bool,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  canCreateTeams: CanCreateTeams.findOne().canCreateTeams,
}))(NavBar);

// Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter
export default NavBar;
