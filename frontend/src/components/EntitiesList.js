import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EntitiesList = () => {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/entities');
      setEntities(response.data);
    } catch (error) {
      console.error('Error fetching entities:', error);
    }
  };

  return (
    <div>
      <h1>Entities List</h1>
      <ul>
        {entities.map(entity => (
          <li key={entity.id}>
            <h2>{entity.name}</h2>
            <h3>Attributes:</h3>
            <ul>
              {Object.entries(entity.attributes).map(([attributeName, attributeDetails]) => (
                <li key={attributeName}>
                  <strong>{attributeName}</strong>: {attributeDetails.type} {attributeDetails.required ? '(required)' : ''}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntitiesList;
