import React from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Checkbox,
  Dropdown,
} from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import {
  AutoForm,
  ErrorsField,
  LongTextField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import _ from 'underscore';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Participants } from '../../../api/user/ParticipantCollection';
import { Skills } from '../../../api/skill/SkillCollection';
import { Tools } from '../../../api/tool/ToolCollection';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import { ParticipantSkills } from '../../../api/user/ParticipantSkillCollection';
import { ParticipantTools } from '../../../api/user/ParticipantToolCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  linkedIn: { type: String, optional: true },
  gitHub: { type: String, optional: true },
  slackUsername: { type: String, optional: true },
  website: { type: String, optional: true },
  aboutMe: { type: String, optional: true },
  Agree: { type: Boolean, defaultValue: false },
});

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
class Dprofile extends React.Component {
  numskill;

  skillSet;

  levelSet;

  skills_level;

  skill;

  level;

  challenges;

  toolset;

  tool;

  constructor(props) {
    super(props);
    this.numskill = 0;
    this.skillSet = [];
    this.levelSet = [];
    this.skills_level = [];
    this.challenges = [];
    this.state = { Skilladded: false };
    this.toolset = [];
  }

  getParticipant() {
    return Participants._collection.findOne({
      username: Meteor.user().username,
    });
  }

  renderChallenge() {
    const handleOnChange = (e, data) => {
      if (data.checked === true) {
        const challenge = _.findWhere(this.props.challenges, {
          title: data.label,
        });
        this.challenges.push(challenge);
      } else {
        // eslint-disable-next-line eqeqeq
        this.challenges = _.filter(this.challenges, function (challenge) {
          return challenge.title !== data.label;
        });
      }
      console.log(this.challenges);
    };
    const ChallengesOptions = this.props.challenges;
    return _.map(ChallengesOptions, function (challenge) {
      //  const name = `${challenge.title}   ( ${challenge.description} )`;
      return (
        <Row key={challenge._id}>
          <Checkbox label={challenge.title} onChange={handleOnChange} />
        </Row>
      );
    });
  }

  renderSkill() {
    const handleOnChange = (e, data) => {
      this.skill = _.findWhere(data.options, { value: data.value });
      console.log(this.skill);
    };
    const SkillArray = this.props.skills;
    const Skillname = [];
    for (let i = 0; i < SkillArray.length; i++) {
      const sn = {
        key: SkillArray[i].slugID,
        docid: SkillArray[i]._id,
        text: SkillArray[i].name,
        value: SkillArray[i].name,
      };
      Skillname.push(sn);
    }
    return (
      <Dropdown
        placeholder="please pick a skill"
        selection
        options={Skillname}
        onChange={handleOnChange}
      />
    );
  }

  renderTools() {
    const handleOnChange = (e, data) => {
      this.tool = _.findWhere(data.options, { value: data.value });
    };
    const ToolsArray = this.props.tools;
    const Toolname = [];
    for (let i = 0; i < ToolsArray.length; i++) {
      const sn = {
        key: ToolsArray[i].slugID,
        docid: ToolsArray[i]._id,
        text: ToolsArray[i].name,
        value: ToolsArray[i].name,
      };
      Toolname.push(sn);
    }
    return (
      <Dropdown
        placeholder="please pick a skill"
        selection
        options={Toolname}
        onChange={handleOnChange}
      />
    );
  }

  renderLevel() {
    const handleOnChange = (e, data) => {
      this.level = _.findWhere(data.options, { value: data.value });
      console.log(this.level);
    };
    // eslint-disable-next-line max-len
    const Levels = [
      { key: 0, text: 'Experienced', value: 'Experienced' },
      {
        key: 1,
        text: 'Novice',
        value: 'Novice',
      },
      {
        key: 2,
        text: "Don't know, but would like to learn",
        value: "Don't know, but would like to learn",
      },
    ];
    // eslint-disable-next-line max-len
    // return Skillname.map((skill, i) => <Dropdown.Item key={i} onClick={() => this.selectSkill(skill)} >{skill}</Dropdown.Item>);
    // eslint-disable-next-line max-len
    return (
      <Dropdown
        placeholder="please pick a Level for the skill"
        fluid
        selection
        options={Levels}
        onChange={handleOnChange}
      />
    );
  }

  renderSkill_level() {
    const deleteSkill = (removeskill) => {
      // eslint-disable-next-line eqeqeq
      this.skillSet = _.filter(this.skillSet, function (skill) {
        return skill.name !== removeskill.name;
      });
      const newState = { Skilladded: true };
      this.setState(newState);
    };
    if (this.skillSet.length > 0) {
      return _.map(this.skillSet, function (skill) {
        return (
          <Row key={skill.docID}>
            <Col width={1} style={{ marginTop: `${10}px` }}>
              <h3>Skill:</h3>{' '}
            </Col>
            <Col width={4} style={{ marginTop: `${10}px` }}>
              <h3>{skill.name}</h3>
            </Col>
            {/* eslint-disable-next-line max-len */}
            <Col width={1} style={{ marginTop: `${10}px` }}>
              <h3>Level:</h3>{' '}
            </Col>
            <Col width={5} style={{ marginTop: `${10}px` }}>
              <h3>{skill.level}</h3>
            </Col>
            {/* eslint-disable-next-line max-len */}
            <Col width={3}>
              <Button onClick={() => deleteSkill(skill)}>
                delete the skill
              </Button>
            </Col>
          </Row>
        );
      });
    }

    // eslint-disable-next-line eqeqeq
    return '';
  }

  renderTool_level() {
    const deleteTool = (removeTool) => {
      // eslint-disable-next-line eqeqeq
      this.toolset = _.filter(this.toolset, function (tool) {
        return tool.name !== removeTool.name;
      });
      const newState = { Skilladded: true };
      this.setState(newState);
    };
    if (this.toolset.length > 0) {
      return _.map(this.toolset, function (tool) {
        return (
          <Row key={tool.docID}>
            <Col width={1} style={{ marginTop: `${10}px` }}>
              <h3>Tool:</h3>{' '}
            </Col>
            <Col width={4} style={{ marginTop: `${10}px` }}>
              <h3>{tool.name}</h3>
            </Col>
            {/* eslint-disable-next-line max-len */}
            <Col width={1} style={{ marginTop: `${10}px` }}>
              <h3>Level:</h3>{' '}
            </Col>
            <Col width={5} style={{ marginTop: `${10}px` }}>
              <h3>{tool.level}</h3>
            </Col>
            {/* eslint-disable-next-line max-len */}
            <Col width={3}>
              <Button onClick={() => deleteTool(tool)}>delete the tool</Button>
            </Col>
          </Row>
        );
      });
    }

    // eslint-disable-next-line eqeqeq
    return '';
  }

  addSkill() {
    const SkillObject = {};
    if (this.skill != null) {
      SkillObject.key = this.skill.key;
      SkillObject.docID = this.skill.docid;
      SkillObject.name = this.skill.text;
      if (this.level != null) {
        SkillObject.level = this.level.value;
      } else SkillObject.level = '';
      console.log(SkillObject);
    }
    console.log(SkillObject);
    this.skillSet.push(SkillObject);
    console.log(this.skillSet);
    for (let i = 0; i < this.skillSet.length; i++)
      console.log(`skill${this.skillSet[i].name}`);
    const newState = { Skilladded: true };
    this.setState(newState);
    // eslint-disable-next-line eqeqeq
    // work on this part to update level
  }

  addTool() {
    const ToolObject = {};
    if (this.tool != null) {
      ToolObject.key = this.tool.key;
      ToolObject.docID = this.tool.docid;
      ToolObject.name = this.tool.text;
      ToolObject.level = this.level.value;
      console.log(ToolObject);
    }
    console.log(ToolObject);
    this.toolset.push(ToolObject);
    console.log(this.toolset);
    for (let i = 0; i < this.toolset.length; i++)
      console.log(`skill${this.toolset[i].name}`);
    const newState = { Skilladded: true };
    this.setState(newState);
  }

  submit(data, formRef) {
    const participant = this.getParticipant();
    const docID = participant._id;
    console.log(docID);
    const { linkedIn, gitHub, website, aboutMe } = data;
    console.log(linkedIn);
    console.log(gitHub);
    console.log(website);
    console.log(aboutMe);
    console.log(this.skillSet);
    const skillsID = _.pluck(this.skillSet, 'key');
    console.log(skillsID);
    console.log(this.challenges);

    const challengesID = _.pluck(this.challenges, 'slugID');
    console.log(this.toolset);
    const toolsID = _.pluck(this.toolset, 'key');
    const updateData = {};
    updateData.id = docID;
    updateData.challenges = challengesID;
    updateData.skills = skillsID;
    updateData.tools = toolsID;
    updateData.linkedIn = linkedIn;
    updateData.gitHub = gitHub;
    updateData.website = website;
    updateData.aboutMe = aboutMe;

    console.log(updateData);
    let success_base = false;
    if (
      updateMethod.call({ collectionName: 'ParticipantCollection', updateData })
    ) {
      console.log('sucess');
      success_base = true;
    } else {
      console.log('fail');
    }
    const deskill = ParticipantSkills._collection
      .find({ participantID: docID })
      .fetch();
    _.each(
      deskill,
      function (skill_level) {
        const updateskillLevel = _.filter(this.skillSet, function (skill) {
          return skill_level.skillID === skill.docID;
        });
        console.log(skill_level._id, updateskillLevel[0]);
        updateMethod.call({
          collectionName: 'ParticipantSkillCollection',
          updateData: {
            id: skill_level._id,
            skillLevel: updateskillLevel[0].level,
          },
        });
      },
      this,
    );
    const detool = ParticipantTools._collection
      .find({ participantID: docID })
      .fetch();
    _.each(
      detool,
      function (tool_level) {
        const updatetoolLevel = _.filter(this.toolset, function (tool) {
          return tool_level.toolID === tool.docID;
        });
        updateMethod.call({
          collectionName: 'ParticipantToolCollection',
          updateData: {
            id: tool_level._id,
            toolLevel: updatetoolLevel[0].level,
          },
        });
      },
      this,
    );

    /* Participants.update(docID, { challenges: challengesID, skills: skillsID, tools: toolsID,
           linkedIn, gitHub, website, aboutMe, isCompliant: Agree },
         (error) => { */
    if (!success_base) {
      swal('Error', 'fail', 'error');
    } else {
      swal('Success', 'profile added successfully', 'success');
      formRef.reset();
    }

    // eslint-disable-next-line max-len
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    return this.props.ready ? (
      this.renderPage()
    ) : (
      <div className="spinner-border" role="status">
        <span className="sr-only">Getting data</span>
      </div>
    );
  }

  renderPage() {
    const participant = this.getParticipant();
    let fRef = null;
    const formSchema = new SimpleSchema2Bridge(schema);

    const firstname = participant.firstName;

    return (
      <Container>
        <Col>
          <h1>
            Hello {firstname}, this is your first time to login, so please fill
            out your profile
          </h1>

          <AutoForm
            ref={(ref) => {
              fRef = ref;
            }}
            schema={formSchema}
            onSubmit={(data) => this.submit(data, fRef)}
          >
            <ul>
              <h3>
                Challenge(s) you want to participate in: (please select at least
                one)
              </h3>
              <Row style={{ marginLeft: `${10}px` }}>
                {this.renderChallenge()}
              </Row>
              <Row>
                <Row>
                  <Col width={1} style={{ marginTop: `${10}px` }}>
                    <h4>Skill:</h4>{' '}
                  </Col>
                  <Col width={4}>{this.renderSkill()}</Col>
                  {/* eslint-disable-next-line max-len */}
                  <Col width={1} style={{ marginTop: `${10}px` }}>
                    <h4>Level:</h4>
                  </Col>
                  <Col width={5}>{this.renderLevel()}</Col>
                  <Col width={3}>
                    <Button onClick={() => this.addSkill()}>
                      Add the skill
                    </Button>
                  </Col>
                </Row>
                {this.state.Skilladded ? this.renderSkill_level() : ''}
                <Row>
                  <Col width={1} style={{ marginTop: `${10}px` }}>
                    <h4>Tool:</h4>{' '}
                  </Col>
                  <Col width={4}>{this.renderTools()}</Col>
                  {/* eslint-disable-next-line max-len */}
                  <Col width={1} style={{ marginTop: `${10}px` }}>
                    <h4>Level:</h4>
                  </Col>
                  <Col width={5}>{this.renderLevel()}</Col>
                  <Col width={3}>
                    <Button onClick={() => this.addTool()}>Add the tool</Button>
                  </Col>
                </Row>
                {this.state.Skilladded ? this.renderTool_level() : ''}
              </Row>
              <TextField name="linkedIn" />
              <TextField name="gitHub" />
              <TextField name="slackUsername" />
              <TextField name="website" />
              <LongTextField name="aboutMe" />
              <SubmitField value="Submit" />
              <ErrorsField />
            </ul>
          </AutoForm>
        </Col>
      </Container>
    );
  }
}

Dprofile.propTypes = {
  skills: PropTypes.array.isRequired,
  challenges: PropTypes.array.isRequired,
  tools: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};
export default withTracker(() => {
  const subscription = Skills.subscribe();
  const subscription2 = Challenges.subscribe();
  const subscription3 = Participants.subscribe();
  const subscription4 = Tools.subscribe();
  return {
    skills: Skills.find({}).fetch(),
    tools: Tools.find({}).fetch(),
    challenges: Challenges.find({}).fetch(),
    ready:
      subscription.ready() &&
      subscription2.ready() &&
      subscription3.ready() &&
      subscription4.ready(),
  };
})(Dprofile);
