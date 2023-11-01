import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, FormCheck, Container, Row, Col } from 'react-bootstrap';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import { ZipZap } from 'meteor/udondan:zipzap';
import moment from 'moment';
import { Participants } from '../../../api/user/ParticipantCollection';
import { updateMethod } from '../../../api/base/BaseCollection.methods';
import { MinorParticipants } from '../../../api/user/MinorParticipantCollection';
import { ROUTES } from '../../../startup/client/route-constants';
import { databaseFileDateFormat } from '../../pages/administrator/DumpDatabase';

function UpdateMinorParticipantsWidget({ MinorParticipantsID }) {
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const [selected, setSelected] = useState([]);

  const getMinorParticipants = () => {
    const MinorParticipantsList = [];
    MinorParticipantsID.forEach((ParticipantsID) => {
      const MinorParticipant = Participants._collection.findOne({ _id: ParticipantsID });
      const MinorP = MinorParticipants._collection.findOne({ participantID: ParticipantsID });
      const ParentName = `${MinorP.parentFirstName} ${MinorP.parentLastName} (${MinorP.parentEmail})`;
      MinorParticipant.ParentName = ParentName;
      MinorParticipantsList.push(MinorParticipant);
    });
    return MinorParticipantsList;
  };

  const download = () => {
    const minors = getMinorParticipants();
    let csv = 'Minor Participant Name, Participant email, Parent/Guardian Name (Parent/Guardian email)\n';
    minors.forEach((m) => {
      csv += `${m.firstName} ${m.lastName},${m.username},${m.ParentName}\n`;
    });
    const zip = new ZipZap();
    const dir = 'hacchui-minor-participants';
    const fileName = `${dir}/${moment().format(databaseFileDateFormat)}-minor-participants.csv`;
    zip.file(fileName, csv);
    zip.saveAs(`${dir}.zip`);
  };

  const submitData = () => {
    let Error = false;
    selected.forEach((MP) => {
      const collectionName = Participants.getCollectionName();
      const updateData = {
        id: MP,
        isCompliant: true,
      };
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          Error = true;
          console.error('Could not update Participant', error);
        }
      });
    });
    if (!Error) {
      swal('Success', 'Updated successfully', 'success');
      setRedirectToReferer(true);
    } else {
      swal('Fail', 'Updated fail', 'error');
    }
  };

  const handleCheckChange = (MP, checked) => {
    if (checked) {
      setSelected((prev) => [...prev, MP]);
    } else {
      setSelected((prev) => prev.filter((Minor) => Minor !== MP));
    }
  };

  const renderMinorParticipants = () => {
    const MinorParticipantsList = getMinorParticipants();
    return MinorParticipantsList.map((p) => (
      <tr key={p._id}>
        <td>{`${p.firstName} ${p.lastName}`}</td>
        <td>{p.ParentName}</td>
        <td>
          <FormCheck
            type="checkbox"
            value={p._id}
            onChange={(evt) => handleCheckChange(p._id, evt.target.checked)}
          />
        </td>
      </tr>
    ));
  };

  if (redirectToReferer) {
    const from = { pathname: ROUTES.LANDING };
    return <Redirect to={from} />;
  }

  return (
    <div style={{ paddingBottom: '50px' }}>
      <div
        style={{
          backgroundColor: '#E5F0FE',
          padding: '1rem 0rem',
          margin: '2rem 0rem',
          borderRadius: '2rem',
          textAlign: 'center',
        }}
      >
        <h2>Minor Participants List ({MinorParticipantsID.length})</h2>
        <Button variant="success" onClick={() => download}>
          Download minor participants
        </Button>
      </div>
      <div
        style={{
          borderRadius: '1rem',
          backgroundColor: '#E5F0FE',
        }}
      >
        <Table striped bordered hover responsive="sm">
          <thead style={{ backgroundColor: 'gray', color: 'white' }}>
          <tr>
            <th>Minor Participant Name</th>
            <th>Parent Name (Email)</th>
            <th>Compliant</th>
          </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white' }}>
          {renderMinorParticipants()}
          </tbody>
        </Table>
        <Container>
          <Row className="justify-content-md-center">
            <Col md={3} style={{ paddingBottom: '15px' }}>
              <Button
                variant="danger"
                style={{ width: '100%' }}
                onClick={() => submitData()}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

UpdateMinorParticipantsWidget.propTypes = {
  MinorParticipantsID: PropTypes.arrayOf(PropTypes.string),
};

export default UpdateMinorParticipantsWidget;
