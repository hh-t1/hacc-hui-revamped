import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import SkillsAdminWidget from './SkillsAdminWidget';
import ChallengesAdminWidget from './ChallengesAdminWidget';
import ToolsAdminWidget from './ToolsAdminWidget';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { CanCreateTeams } from '../../../api/team/CanCreateTeamCollection';
import { CanChangeChallenges } from '../../../api/team/CanChangeChallengeCollection';

/**
 * Renders the Page for Managing HACC. **deprecated**
 * @memberOf ui/pages
 */
const ManageHaccWidget = (props) => {
  const [canCreate, setCreate] = useState(false);
  const [canChange, setChange] = useState(false);

  const toggleTeam = () => {
    const doc = CanCreateTeams.findOne();
    if (doc) {
      const updateData = {
        id: doc._id,
        canCreateTeams: !canCreate,
      };
      const collectionName = CanCreateTeams.getCollectionName();
      updateMethod.call({ collectionName, updateData });
      setCreate(!canCreate);
    }
  };

  const toggleChallenge = () => {
    const doc = CanChangeChallenges.findOne();
    if (doc) {
      const updateData = {
        id: doc._id,
        canChangeChallenges: !canChange,
      };
      const collectionName = CanChangeChallenges.getCollectionName();
      updateMethod.call({ collectionName, updateData });
      setChange(!canChange);
    }
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      <Container>
        <Col>
          <Container
            style={{
              textAlign: 'center',
              backgroundColor: '#E5F0FE',
              padding: '1rem 0rem',
              margin: '2rem 0rem',
              borderRadius: '2rem',
            }}
          >
            <h2>Manage HACC</h2>
            <Container className={'d-flex justify-content-center'}>
              <Row>
                <Col>
                  <h5>
                    <Form.Check
                      type={'switch'}
                      toggle
                      label="Can Create Teams"
                      checked={canCreate}
                      onChange={toggleTeam}
                    />
                    &nbsp;
                  </h5>
                  <h5>
                    <Form.Check
                      type={'switch'}
                      toggle
                      label="Can Change Challenges"
                      checked={canChange}
                      onChange={toggleChallenge}
                    />
                  </h5>
                </Col>
              </Row>
            </Container>
          </Container>
          <Container
            style={{
              textAlign: 'center',
              borderRadius: '1rem',
              backgroundColor: '#E5F0FE',
            }}
            className={'teamCreate'}
          >
            <h2>Challenges</h2>
            <Table>
              <thead>
                <tr>
                  <th width={2}>Title</th>
                  <th width={5}>Description</th>
                  <th width={2}>Submission Detail</th>
                  <th width={2}>Pitch</th>
                  <th width={2}>Edit</th>
                  <th width={2}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {props.challenges.map((challenges) => (
                  <ChallengesAdminWidget
                    key={challenges._id}
                    challenges={challenges}
                  />
                ))}
              </tbody>
            </Table>
            <div style={{ textAlign: 'center' }}>
              <Button
                style={{
                  color: 'white',
                  backgroundColor: '#DB2828',
                  margin: '2rem 0rem',
                }}
              >
                <Link to={ROUTES.ADD_CHALLENGE} style={{ color: 'white' }}>
                  Add Challenge
                </Link>
              </Button>
            </div>
            <h2>Skills</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th width={2}>Edit</th>
                  <th width={2}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {props.skills.map((skills) => (
                  <SkillsAdminWidget key={skills._id} skills={skills} />
                ))}
              </tbody>
            </Table>
            <div style={{ textAlign: 'center' }}>
              <Button
                style={{
                  color: 'white',
                  backgroundColor: '#DB2828',
                  margin: '2rem 0rem',
                }}
              >
                <Link to={ROUTES.ADD_SKILL} style={{ color: 'white' }}>
                  Add Skill
                </Link>
              </Button>
            </div>
            <h2>Tools</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th width={2}>Edit</th>
                  <th width={2}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {props.tools.map((tools) => (
                  <ToolsAdminWidget key={tools._id} tools={tools} />
                ))}
              </tbody>
            </Table>
            <div style={{ textAlign: 'center' }}>
              <Button
                style={{
                  color: 'white',
                  backgroundColor: '#DB2828',
                  margin: '2rem 0rem',
                }}
              >
                <Link to={ROUTES.ADD_TOOL} style={{ color: 'white' }}>
                  Add Tool
                </Link>
              </Button>
            </div>
          </Container>
        </Col>
      </Container>
    </div>
  );
};

ManageHaccWidget.propTypes = {
  challenges: PropTypes.array.isRequired,
  skills: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
};

function propSort(array) {
  return array.sort(function (a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => ({
  challenges: Challenges.find({})
    .fetch()
    .sort(function (a, b) {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    }),
  skills: propSort(Skills.find({}).fetch()),
  tools: propSort(Tools.find({}).fetch()),
}))(ManageHaccWidget);
