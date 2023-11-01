import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Administrators } from '../../../api/user/AdministratorCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Suggestions } from '../../../api/suggestions/SuggestionCollection';
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';

const SuggestToolSkillAdmin = (props) => {

  const buildTheFormSchema = () => {
    return new SimpleSchema({
      type: { type: String, allowedValues: ['Tool', 'Skill'], optional: false },
      name: String,
      description: String,
    });
  }

  const submit = (data, formRef) => {
    const collectionName = Suggestions.getCollectionName();
    const newData = {};
    const model = props.admin;
    newData.username = model.username;
    newData.name = data.name;
    newData.type = data.type;
    newData.description = data.description;

    defineMethod.call({ collectionName: collectionName, definitionData: newData },
        (error) => {
          if (error) {
            Swal.fire('Error', error.message, 'error').then(() => {});
          } else {
            Swal.fire('Success', 'Thank you for your suggestion', 'success').then(() => {});
            formRef.reset();
          }
        });
  }

  const types = [
    {
      label: 'Tool',
      value: 'Tool',
    },
    {
      label: 'Skill',
      value: 'Skill',
    },
  ];

  let fRef = null;
  const schema = buildTheFormSchema();
  const formSchema = new SimpleSchema2Bridge(schema);
  return (
      <Container>
        <h2 className="text-center fw-bold">Add suggestion to list. </h2>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={formSchema} onSubmit={data => submit(data, fRef)}>
          <div className="border p-3">
            <SelectField name="type" options={types}/>
            <TextField name="name"/>
            <TextField name="description"/>
            <SubmitField/>
            <ErrorsField/>
          </div>
        </AutoForm>
      </Container>
  );
}

SuggestToolSkillAdmin.propTypes = {
  admin: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const admin = Administrators.findDoc({ userID: Meteor.userId() });
  return {
    admin,
  };
})(SuggestToolSkillAdmin);
