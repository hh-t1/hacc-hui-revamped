import React, { useState } from 'react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
  LongTextField,
} from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { Skills } from '../../../api/skill/SkillCollection';
import { ROUTES } from '../../../startup/client/route-constants';

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const EditSkillWidget = (props) => {
  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   * @param formRef {FormRef} reference to the form.
   */

  const [redirect, setRedirect] = useState(false);
  const submit = (data) => {
    const { name, description } = data;

    const id = props.doc._id;

    const updateData = {
      id,
      name,
      description,
    };

    const collectionName = Skills.getCollectionName();
    updateMethod.call(
      { collectionName: collectionName, updateData: updateData },
      (error) => {
        if (error) {
          Swal.fire('Error', error.message, 'error').then(() => {});
        } else {
          Swal.fire({
            title: '<strong>Success!</strong>',
            text: 'Item edited successfully',
            icon: 'success',
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'OK',
          }).then(() => {
            setRedirect(true);
          });
        }
      },
    );
  };

  if (redirect) {
    return <Redirect to={ROUTES.CONFIGURE_HACC} />;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  const formSchema = new SimpleSchema2Bridge(Skills.getSchema());
  return (
    <Container id="edit-skill-page">
      <h2 className="text-center fw-bold">Edit Skill</h2>
      <AutoForm
        schema={formSchema}
        onSubmit={(data) => submit(data)}
        model={props.doc}
      >
        <div className="border p-3">
          <TextField name="name" required />
          <LongTextField name="description" required />
          <SubmitField value="Submit" />
          <ErrorsField />
        </div>
      </AutoForm>
    </Container>
  );
};

EditSkillWidget.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
};

const EditSkillCon = withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  return {
    doc: Skills.findOne(documentId),
  };
})(EditSkillWidget);

export default withRouter(EditSkillCon);
