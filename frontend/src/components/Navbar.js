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

  const fetchEntities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/entities');
      setEntitiesResponse(response.data);
    } catch (error) {
      console.error('Error fetching entities:', error);
      setEntitiesResponse([]);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
    setFormData({});
    setShowForm(false);
  };

  const handleChange = (e, attributeName) => {
    setFormData({
      ...formData,
      [attributeName]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form...');
    try {
      await axios.post(`http://localhost:3001/api/entities/${selectedEntity.id}/examples`, formData);
      console.log('Example created successfully.');
      handleEntityClick(selectedEntity);
    } catch (error) {
      console.error('Error creating example:', error);
    }
  };
  

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Vahan</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={fetchEntities}>Entities</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <div className="d-flex justify-content-center">
          <div style={{ flex: 1, marginRight: '20px' }}>
            <h1>Entities</h1>
            <ul>
              {entitiesResponse.map(entity => (
                <h3 key={entity.id}>
                  <li onClick={() => handleEntityClick(entity)}>{entity.name}</li>
                </h3>
              ))}
            </ul>
          </div>

          {selectedEntity && (
            <div className="side-space d-flex flex-column justify-content-between">
              <div>
                <h2>Details</h2>
                <p>ID: {selectedEntity.id}</p>
                <p>Name: {selectedEntity.name}</p>
                <h3>Attributes:</h3>
                <ul>
                  {Object.entries(selectedEntity.attributes).map(([attributeName, attributeDetails]) => (
                    <li key={attributeName}>
                      <strong>{attributeName}</strong>: {attributeDetails.type} {attributeDetails.required ? '(required)' : ''}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="btn btn-primary" onClick={() => setShowForm(true)}>Create</Button>
            </div>
          )}

          {selectedEntity && showForm && (
            <div className="mt-5">
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

          {/* Examples table */}
          {selectedEntity && selectedEntity.examples.length > 0 && (
            <div className="mt-5">
              <h2>Examples</h2>
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(selectedEntity.examples[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedEntity.examples.map((example, index) => (
                    <tr key={index}>
                      {Object.values(example).map((value, index) => (
                        <td key={index}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default ColorSchemesExample;
