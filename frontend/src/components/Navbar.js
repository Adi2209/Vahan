import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Form, Button, Modal } from 'react-bootstrap';

function ColorSchemesExample() {
  const [entitiesResponse, setEntitiesResponse] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/entities');
        setEntitiesResponse(response.data);
      } catch (error) {
        console.error('Error fetching entities:', error);
      }
    };
    fetchEntities();
  }, []);

  const handleEntityClick = async (entity) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/entities/${entity.id}`);
      setSelectedEntity(response.data);
    } catch (error) {
      console.error('Error fetching entity:', error);
    }
  };

  const handleCreateClick = () => {
    if (selectedEntity) {
      setShowModal(true);
      setFormData({});
    } else {
      alert('Please select an entity first.');
    }
  };

  const handleDeleteClick = (event, entity) => {
    event.stopPropagation(); // Prevent click from triggering li onClick
    setSelectedEntity(entity);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/entities/${selectedEntity.id}`);
      setShowDeleteModal(false);
      setEntitiesResponse(entitiesResponse.filter(e => e.id !== selectedEntity.id));
      setSelectedEntity(null);
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
  };

  const handleChange = (e, attributeName) => {
    setFormData({
      ...formData,
      [attributeName]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/entities/${selectedEntity.id}/examples`, formData);
      setShowModal(false); // Close modal on successful submission
      handleEntityClick(selectedEntity); // Refresh data
    } catch (error) {
      console.error('Error creating example:', error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="main-content">
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Vahan</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleCreateClick}>Create Example</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="mt-5">
        <div className="row">
          <div className="col-md-2 entities-list">
            <h1>Entities</h1>
            <ul>
              {entitiesResponse.map((entity) => (
                <li key={entity.id} onClick={() => handleEntityClick(entity)}>
                  {entity.name}
                  <Button variant="light" className="delete-button" onClick={(e) => handleDeleteClick(e, entity)}><i className="fas fa-trash"></i></Button>

                </li>
              ))}
            </ul>
          </div>
          {selectedEntity && (
            <div className="col-md-10">
              <div className="details-section">
                <h2>Details</h2>
                <p>ID: {selectedEntity.id}</p>
                <p>Name: {selectedEntity.name}</p>
                <ul>
                  {Object.entries(selectedEntity.attributes).map(
                    ([attributeName, attributeDetails]) => (
                      <li key={attributeName}>
                        {attributeName}: {attributeDetails.type} ({attributeDetails.required ? 'required' : 'optional'})
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="examples-section">
                <h2>Examples</h2>
                <table className="table">
                  <thead>
                    <tr>
                      {selectedEntity.examples && selectedEntity.examples.length > 0 &&
                        Object.keys(selectedEntity.examples[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEntity.examples && selectedEntity.examples.map((example, index) => (
                      <tr key={index}>
                        {Object.values(example).map((value, idx) => (
                          <td key={idx}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table
                ></div>
            </div>
          )}
        </div>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Example</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {selectedEntity && Object.entries(selectedEntity.attributes).map(
              ([attributeName, attributeDetails]) => (
                <Form.Group key={attributeName} className="mb-3">
                  <Form.Label>{attributeName}</Form.Label>
                  <Form.Control
                    type={attributeDetails.type === 'number' ? 'number' : 'text'}
                    value={formData[attributeName] || ''}
                    onChange={(e) => handleChange(e, attributeName)}
                    required={attributeDetails.required}
                  />
                </Form.Group>
              )
            )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this entity?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ColorSchemesExample;
