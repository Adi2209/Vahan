import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function ColorSchemesExample() {
  const [entitiesResponse, setEntitiesResponse] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  // Fetch list of all entities
  const fetchEntities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/entities');
      setEntitiesResponse(response.data);
    } catch (error) {
      console.error('Error fetching entities:', error);
      setEntitiesResponse([]);
    }
  };

  // Fetch details of a specific entity
  const fetchEntity = async (entityId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/entities/${entityId}`);
      setSelectedEntity(response.data);
    } catch (error) {
      console.error('Error fetching entity:', error);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
    setFormData({});
    setShowForm(true);
    fetchEntity(entity.id);
  };

  const handleChange = (e, attributeName) => {
    setFormData({
      ...formData,
      [attributeName]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3001/api/entities/${selectedEntity.id}/examples`, formData);
      fetchEntity(selectedEntity.id); // Refresh entity data after adding example
    } catch (error) {
      console.error('Error creating example:', error);
    }
  };

  return (
    <div className="main-content">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Vahan</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={fetchEntities}>Entities</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid>
        <div className="row">
          <div className="col-md-2 entities-list">
            <h1>Entities</h1>
            <ul>
              {entitiesResponse.map(entity => (
                <li key={entity.id} onClick={() => handleEntityClick(entity)}>{entity.name}</li>
              ))}
            </ul>
          </div>

          {selectedEntity && (
            <div className="col-md-3 details-section">
              <h2>Details</h2>
              <p>ID: {selectedEntity.id}</p>
              <p>Name: {selectedEntity.name}</p>
              <ul>
                {Object.entries(selectedEntity.attributes).map(([attributeName, attributeDetails]) => (
                  <li key={attributeName}>
                    <strong>{attributeName}</strong>: {attributeDetails.type} {attributeDetails.required ? '(required)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedEntity && selectedEntity.examples && (
            <div className="col-md-3 examples-section">
              <h2>Examples</h2>
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(selectedEntity.examples[0]).map(key => <th key={key}>{key}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {selectedEntity.examples.map((example, index) => (
                    <tr key={index}>
                      {Object.values(example).map((value, index) => <td key={index}>{value}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showForm && (
            <div className="col-md-4 form-section">
              <h2>Create Example</h2>
              <Form onSubmit={handleSubmit}>
                {Object.entries(selectedEntity.attributes).map(([attributeName, attributeDetails]) => (
                  <Form.Group key={attributeName}>
                    <Form.Label>{attributeName}</Form.Label>
                    <Form.Control
                      type={attributeDetails.type === 'number' ? 'number' : 'text'}
                      value={formData[attributeName] || ''}
                      onChange={(e) => handleChange(e, attributeName)}
                      required={attributeDetails.required}
                    />
                  </Form.Group>
                ))}
                <Button type="submit" className="btn btn-primary">Submit</Button>
              </Form>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default ColorSchemesExample;
