import React, { useRef } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { useTracker } from "meteor/react-meteor-data";
import { AutoForm, SelectField, TextField } from "uniforms-bootstrap5";
import { Meteor } from "meteor/meteor";
import { SimpleSchema2Bridge } from "uniforms-bridge-simple-schema-2";
import SimpleSchema from "simpl-schema";
import swal from "sweetalert";
import { Administrators } from "../../../api/user/AdministratorCollection";
import { defineMethod } from "../../../api/base/BaseCollection.methods";
import { Suggestions } from "../../../api/suggestions/SuggestionCollection";

const SuggestToolSkillWidgetAdmin = (props) => {
  const admin = useTracker(() => {
    return Administrators.findDoc({ userID: Meteor.userId() });
  });
  const fRef = useRef(null);

  const buildTheFormSchema = () => {
    const schema = new SimpleSchema({
      type: { type: String, allowedValues: ["Tool", "Skill"], optional: false },
      name: String,
      description: String,
    });
    return schema;
  };

  const submit = (data) => {
    const collectionName = Suggestions.getCollectionName();
    const newData = {};
    const model = admin;
    newData.username = model.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;

    defineMethod.call(
      { collectionName: collectionName, definitionData: newData },
      (error) => {
        if (error) {
          swal("Error", error.message, "error");
        } else {
          swal("Success", "Thank you for your suggestion", "success");
          fRef.current.reset();
        }
      }
    );
  };

  const schema = buildTheFormSchema();
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
    <Card>
      <Card.Header>Add suggestion to list.</Card.Header>
      <Card.Body>
        <AutoForm ref={fRef} schema={formSchema} onSubmit={submit}>
          <Form.Group as={Row}>
            <Col>
              <SelectField name="type" />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col>
              <TextField name="name" />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col>
              <TextField name="description" />
            </Col>
          </Form.Group>
          <Button type="submit">Submit</Button>
        </AutoForm>
      </Card.Body>
    </Card>
  );
};

SuggestToolSkillWidgetAdmin.propTypes = {};

export default SuggestToolSkillWidgetAdmin;
