import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Form, Button, Modal } from 'react-bootstrap';

function ColorSchemesExample() {
  const [entitiesResponse, setEntitiesResponse] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEntityData, setNewEntityData] = useState({ name: '', attributes: [] });
  const [currentExample, setCurrentExample] = useState(null);
  const attributeTypes = ['string', 'number', 'boolean', 'date']; // Define attribute types

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

  const handleDeleteEntityClick = async (entityId, event) => {
    event.stopPropagation(); // Prevent other click actions
    const confirmDelete = window.confirm("Are you sure you want to delete this entity?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/entities/${entityId}`);
        const updatedEntities = entitiesResponse.filter(entity => entity.id !== entityId);
        setEntitiesResponse(updatedEntities);
        if (selectedEntity && selectedEntity.id === entityId) {
          setSelectedEntity(null);
        }
      } catch (error) {
        console.error('Error deleting entity:', error);
      }
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

  const handleEditClick = (example) => {
    const { attributes, ...rest } = example;
    setEditFormData(rest);
    setCurrentExample(example);
    setShowEditModal(true);
  };

  const handleDeleteClick = (example, entity) => {
    setSelectedEntity(entity);
    setCurrentExample(example);  // Store the example to be deleted
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/entities/${selectedEntity.id}/example`, {
        data: { exampleToDelete: currentExample },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setShowDeleteModal(false);
      const updatedExamples = selectedEntity.examples.filter(ex => JSON.stringify(ex) !== JSON.stringify(currentExample));
      setSelectedEntity({...selectedEntity, examples: updatedExamples});
    } catch (error) {
      console.error('Error deleting example:', error);
    }
  };

  const handleChange = (e, attributeName, isEdit = false) => {
    const updateForm = isEdit ? setEditFormData : setFormData;
    const currentForm = isEdit ? editFormData : formData;

    updateForm({
      ...currentForm,
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/entities/${selectedEntity.id}`, {
        oldExample: currentExample,
        newExample: editFormData
      });
      setShowEditModal(false);
      handleEntityClick(selectedEntity);
    } catch (error) {
      console.error('Error editing example:', error);
    }
  };

  const handleNewEntityChange = (e) => {
    setNewEntityData({ ...newEntityData, [e.target.name]: e.target.value });
  };

  const addAttribute = () => {
    setNewEntityData({
      ...newEntityData,
      attributes: [...newEntityData.attributes, { name: '', type: 'string', required: false }],
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
          required: attr.required,
        })),
        examples: [],
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
    setShowEditModal(false);
  };

  return (
    <React.Fragment>
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
                    <Button variant="danger" className="delete-button" onClick={(e) => handleDeleteEntityClick(entity.id, e)}><i className="fas fa-trash"></i></Button>
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
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEntity.examples && selectedEntity.examples.map((example, index) => (
                        <tr key={index}>
                          {Object.entries(example).filter(([key]) => key !== 'attributes').map(([key, value], idx) => (
                            <td key={idx}>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                          ))}
                          <td>
                            <Button variant="light" className="edit-button" onClick={() => handleEditClick(example)}><i className="fas fa-edit"></i></Button>
                            <Button variant="danger" className="delete-button" onClick={() => handleDeleteClick(example, selectedEntity)}><i className="fas fa-trash"></i></Button>
                          </td>
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
                    required={attribute.required}
                    value={formData[attribute.name] || ''}
                    onChange={(e) => handleChange(e, attribute.name)}
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
            <Modal.Title>Delete Example</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this example?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
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
                  name="name"
                  value={newEntityData.name}
                  onChange={handleNewEntityChange}
                />
              </Form.Group>
              <h5>Attributes</h5>
              {newEntityData.attributes.map((attr, index) => (
                <div key={index} className="attribute-group">
                  <Form.Group className="mb-3">
                    <Form.Label>Attribute Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={attr.name}
                      onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={attr.type}
                      onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                    >
                      {attributeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Required"
                      checked={attr.required}
                      onChange={(e) => handleAttributeChange(index, 'required', e.target.checked)}
                    />
                  </Form.Group>
                </div>
              ))}
              <Button variant="primary" onClick={addAttribute}>
                Add Attribute
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateEntity}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Example</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              {selectedEntity && Array.isArray(selectedEntity.attributes) && selectedEntity.attributes.map((attribute, index) => (
                <Form.Group key={index} className="mb-3">
                  <Form.Label>{attribute.name}</Form.Label>
                  <Form.Control
                    type={attribute.type === 'number' ? 'number' : 'text'}
                    required={attribute.required}
                    value={editFormData[attribute.name] || ''}
                    onChange={(e) => handleChange(e, attribute.name, true)}
                  />
                </Form.Group>
              ))}
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
}

export default ColorSchemesExample;
