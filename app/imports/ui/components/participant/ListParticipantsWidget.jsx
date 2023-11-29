import React from 'react';
import {
  Dropdown,
} from 'semantic-ui-react';
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
import ListParticipantsCard from './ListParticipantsCard';
import ListParticipantsFilter from './ListParticipantsFilter';
import { BsFillPeopleFill } from 'react-icons/bs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ListGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Dropdown as BDropdown } from 'react-bootstrap'

class ListParticipantsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      challenges: [],
      teams: [],
      tools: [],
      skills: [],
      result: _.orderBy(this.props.participants, ['name'], ['asc']),
    };
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */

  render() {
    if (this.props.participants.length === 0) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>
            <BsFillPeopleFill/>
            There are no participants at the moment.
            <h4>Please check back later.</h4>
          </h2>
        </div>
      );
    }

    const sticky = {
      position1: '-webkit-sticky',
      position: 'sticky',
      top: '6.5rem',
    };

    const filters = new ListParticipantsFilter();

    const setFilters = () => {
      const searchResults = filters.filterBySearch(
        this.props.participants,
        this.state.search,
      );
      const skillResults = filters.filterBySkills(
        this.state.skills,
        this.props.skills,
        this.props.participantSkills,
        searchResults,
      );
      const toolResults = filters.filterByTools(
        this.state.tools,
        this.props.tools,
        this.props.participantTools,
        skillResults,
      );
      const challengeResults = filters.filterByChallenge(
        this.state.challenges,
        this.props.challenges,
        this.props.participantChallenges,
        toolResults,
      );
      const sorted = filters.sortBy(challengeResults, 'participants');
      this.setState(
        {
          result: sorted,
        },
        () => {},
      );
    };

    const handleSearchChange = (event) => {
      this.setState(
        {
          search: event.target.value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getSkills = (event, { value }) => {
      this.setState(
        {
          skills: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getTools = (event, { value }) => {
      this.setState(
        {
          tools: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getChallenge = (event, { value }) => {
      this.setState(
        {
          challenges: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const getTeam = (event, { value }) => {
      this.setState(
        {
          teams: value,
        },
        () => {
          setFilters();
        },
      );
    };

    const universalSkills = this.props.skills;

    const getParticipantSkills = (participantID, participantSkills) => {
      const data = [];
      const skills = _.filter(participantSkills, {
        participantID: participantID,
      });
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

    const universalTools = this.props.tools;

    const getParticipantTools = (participantID, participantTools) => {
      const data = [];
      const tools = _.filter(participantTools, {
        participantID: participantID,
      });
      for (let i = 0; i < tools.length; i++) {
        for (let j = 0; j < universalTools.length; j++) {
          if (tools[i].toolID === universalTools[j]._id) {
            data.push({ name: universalTools[j].name });
          }
        }
      }
      return data;
    }

    const universalChallenges = this.props.challenges;

    const getParticipantChallenges = (participantID, participantChallenges) => {
      const data = [];
      const challenges = _.filter(participantChallenges, {
        participantID: participantID,
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
      <div style={{ paddingBottom: '50px' }}>
        <Container doubling relaxed stackable centered>
          <Row>
            <Col width={16}>
              <div
                style={{
                  backgroundColor: '#E5F0FE',
                  padding: '1rem 0rem',
                  margin: '2rem 0rem',
                  borderRadius: '2rem',
                }}
              >
                <h2 style={{textAlign: "center"}}>
                  All Participants
                </h2>
              </div>
            </Col>
          </Row>
          <Row>
          <Col width={3}>
            <div style={sticky}>
              <div style={{ paddingTop: '2rem' }}>
                <h3>
                    Total Participants: {this.state.result.length}
                </h3>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <Form>
                <Form.Control
                  icon="search"
                  iconPosition="left"
                  placeholder="Search by participants name..."
                  onChange={handleSearchChange}
                  fluid
                />
                </Form>
                <div style={{ paddingTop: '2rem' }}>
                  <h3>Teams</h3>
                  <Dropdown
                    placeholder="Teams"
                    fluid
                    multiple
                    search
                    selection
                    options={filters.dropdownValues(this.props.teams, 'name')}
                    onChange={getTeam}
                  />
                </div>

                <div style={{ paddingTop: '2rem' }}>
                  <h3>Challenges</h3>
                  <Dropdown
                    placeholder="Challenges"
                    fluid
                    multiple
                    search
                    selection
                    options={filters.dropdownValues(
                      this.props.challenges,
                      'title',
                    )}
                    onChange={getChallenge}
                  />
                </div>
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <h3>Skills</h3>
                <Dropdown
                  placeholder="Skills"
                  fluid
                  multiple
                  search
                  selection
                  options={filters.dropdownValues(this.props.skills, 'name')}
                  onChange={getSkills}
                />
              </div>
              <div style={{ paddingTop: '2rem' }}>
                <h3>Tools</h3>
                <Dropdown
                  placeholder="Tools"
                  fluid
                  multiple
                  search
                  selection
                  options={filters.dropdownValues(this.props.tools, 'name')}
                  onChange={getTools}
                />
              </div>
            </div>
          </Col>
          <Col xs={9}>
            <ListGroup divided>
              {this.state.result.map((participants) => (
                <ListParticipantsCard
                  key={participants._id}
                  participantID={participants._id}
                  participants={participants}
                  skills={getParticipantSkills(
                    participants._id,
                    this.props.participantSkills,
                  )}
                  tools={getParticipantTools(
                    participants._id,
                    this.props.participantTools,
                  )}
                  challenges={getParticipantChallenges(
                    participants._id,
                    this.props.participantChallenges,
                  )}
                />
              ))}
            </ListGroup>
          </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

ListParticipantsWidget.propTypes = {
  participantChallenges: PropTypes.array.isRequired,
  participantSkills: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  participantTools: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
};

export default withTracker(() => ({
  participantChallenges: ParticipantChallenges.find({}).fetch(),
  participantSkills: ParticipantSkills.find({}).fetch(),
  participantTools: ParticipantTools.find({}).fetch(),
  teams: Teams.find({ open: true }).fetch(),
  skills: Skills.find({}).fetch(),
  challenges: Challenges.find({}).fetch(),
  tools: Tools.find({}).fetch(),
  participants: Participants.find({}).fetch(),
}))(ListParticipantsWidget);
