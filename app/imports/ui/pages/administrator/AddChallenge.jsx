import React, { useCallback, useRef, useState } from 'react';
import {
  AutoForm,
  ErrorsField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import { Challenges } from '../../../api/challenge/ChallengeCollection';
import Swal from 'sweetalert2';
import Container from 'react-bootstrap/Container';
import { ROUTES } from '../../../startup/client/route-constants';
import { Redirect } from 'react-router-dom';

// Create a schema to specify the structure of the data to appear in the form.
const schema = new SimpleSchema({
  title: String,
  description: String,
  submissionDetail: String,
  pitch: String,
});
const formSchema = new SimpleSchema2Bridge(schema);

/**
 * Renders the Page for adding stuff. **deprecated**
 * @memberOf ui/pages
 */
const AddChallenge = () => {
  const formRef = useRef(null);

  const [redirect, setRedirect] = useState(false);

  /** On submit, insert the data.
   * @param data {Object} the results from the form.
   */
  const handleSubmit = useCallback(
      (data) => {
        const { title, description, submissionDetail, pitch } = data;
        const definitionData = { title, description, submissionDetail, pitch };
        const collectionName = Challenges.getCollectionName();
        // console.log(collectionName);
        defineMethod.call({ collectionName, definitionData }, (error) => {
          if (error) {
            Swal.fire('Error', error.message, 'error').then(() => {});
            console.error(error.message);
          } else {
            Swal.fire({
              title: '<strong>Success!</strong>',
              icon: 'success',
              showCloseButton: true,
              focusConfirm: false,
              confirmButtonText:
                  'OK'
            }).then(() => {
                setRedirect(true);
            })
            formRef.current.reset();
          }
        });
      },
      [formRef],
  );

  if (redirect) {
    return <Redirect to={ROUTES.CONFIGURE_HACC} />;
  }

  return (
      <Container id="add-challenge-page">
        <h2 className="text-center fw-bold">Add a Challenge</h2>
        <AutoForm ref={formRef} schema={formSchema} onSubmit={handleSubmit}>
          <div className="border p-3">
            <TextField name="title" />
            <TextField name="description" />
            <TextField name="submissionDetail" />
            <TextField name="pitch" />
            <SubmitField value="Submit" />
            <ErrorsField />
          </div>
        </AutoForm>
      </Container>
  );
};

export default AddChallenge;
