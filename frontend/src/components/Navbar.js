import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Form, Button, Modal } from 'react-bootstrap';

function ColorSchemesExample() {
  const [entitiesResponse, setEntitiesResponse] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [newEntityData, setNewEntityData] = useState({ name: '', attributes: [] });

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
    event.stopPropagation();
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
      setShowModal(false);
      handleEntityClick(selectedEntity);
    } catch (error) {
      console.error('Error creating example:', error);
    }
  };

  const handleNewEntityChange = (e) => {
    setNewEntityData({ ...newEntityData, [e.target.name]: e.target.value });
  };

  const addAttribute = () => {
    setNewEntityData({
      ...newEntityData,
      attributes: [...newEntityData.attributes, { name: '', type: '', required: false }]
    });
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = newEntityData.attributes.map((attr, i) => {
      if (i === index) {
        return { ...attr, [field]: value };
      }
      return attr;
    });
    setNewEntityData({ ...newEntityData, attributes: updatedAttributes });
  };

  const handleCreateEntity = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/entities', {
        name: newEntityData.name,
        attributes: newEntityData.attributes.map(attr => ({
          name: attr.name,
          type: attr.type,
          required: attr.required
        })),
        examples: []
      });
      setEntitiesResponse([...entitiesResponse, response.data]);
      setNewEntityData({ name: '', attributes: [] });
      setShowEntityModal(false);
    } catch (error) {
      console.error('Error creating new entity:', error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setShowEntityModal(false);
  };

  return (
    <div className="main-content">
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Vahan</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleCreateClick}>Create Example</Nav.Link>
            <Nav.Link onClick={() => setShowEntityModal(true)}>Add New Entity</Nav.Link>
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
                  {Array.isArray(selectedEntity.attributes) ? selectedEntity.attributes.map((attribute, index) => (
                    <li key={index}>
                      {attribute.name}: {attribute.type} ({attribute.required ? 'required' : 'optional'})
                    </li>
                  )) : <li>No attributes defined.</li>}
                </ul>
              </div>
              <div className="examples-section">
                <h2>Examples</h2>
                <table className="table">
                  <thead>
                    <tr>
                      {selectedEntity.examples && selectedEntity.examples.length > 0 &&
                        Object.keys(selectedEntity.examples[0]).filter(key => key !== 'attributes').map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEntity.examples && selectedEntity.examples.map((example, index) => (
                      <tr key={index}>
                        {Object.entries(example).filter(([key]) => key !== 'attributes').map(([key, value], idx) => (
                          <td key={idx}>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            {selectedEntity && Array.isArray(selectedEntity.attributes) && selectedEntity.attributes.map((attribute, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>{attribute.name}</Form.Label>
                <Form.Control
                  type={attribute.type === 'number' ? 'number' : 'text'}
                  placeholder={`Enter ${attribute.name}`}
                  value={formData[attribute.name] || ''}
                  onChange={(e) => handleChange(e, attribute.name)}
                  required={attribute.required}
                />
              </Form.Group>
            ))}
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

      <Modal show={showEntityModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Entity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Entity Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter entity name"
                name="name"
                value={newEntityData.name}
                onChange={(e) => handleNewEntityChange(e)}
                required
              />
            </Form.Group>
            {newEntityData.attributes.map((attr, index) => (
              <div key={index}>
                <Form.Group className="mb-3">
                  <Form.Label>Attribute Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Attribute name"
                    name="name"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Attribute Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={attr.type}
                    onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="boolean">Boolean</option>
                  </Form.Control>
                </Form.Group>
              </div>
            ))}
            <Button variant="primary" type="button" onClick={addAttribute}>
              Add Attribute
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleCreateEntity}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ColorSchemesExample;
