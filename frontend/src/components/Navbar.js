import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios'; // Import axios for making HTTP requests

function ColorSchemesExample() {
  const [entities, setEntities] = useState([]); // State to store entities

  // Function to handle click on "Entities" link
  const handleEntitiesClick = async () => {
    try {
      // Make GET request to backend API to fetch all entities
      const response = await axios.get('http://localhost:3001/api/entities');
      // Update state with entities from the response
      setEntities(response.data);
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Vahan</Navbar.Brand>
        <Nav className="me-auto">
          {/* Add onClick event handler to trigger fetching of entities */}
          <Nav.Link href="" onClick={handleEntitiesClick}>Entities</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;
