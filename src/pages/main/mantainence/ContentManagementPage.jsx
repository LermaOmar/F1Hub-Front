import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentPage from './ContentPage';
import '../../../styles/Management.css';

const CONFIG = {
  teams: {
    entityName: 'team',
    endpoint: 'teams',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'nationality', label: 'Nationality', required: true },
      { key: 'price', label: 'Price', type: 'number', required: true },
      { key: 'active', label: 'Active', type: 'checkbox' }
    ]
  },
  drivers: {
    entityName: 'driver',
    endpoint: 'drivers',
    fields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'nationality', label: 'Nationality', required: true },
      { key: 'price', label: 'Price', type: 'number', required: true },
      { key: 'active', label: 'Active', type: 'checkbox' }
    ]
  }
};

const ContentManagementPage = () => {
  const [selected, setSelected] = useState('teams');

  const config = CONFIG[selected];

  const navigate = useNavigate();
  

  return (
    <div className="content-wrapper dark">
      <div className="tab-header">
        {Object.keys(CONFIG).map((key) => (
          <button
            key={key}
            className={`tab-btn ${selected === key ? 'active' : ''}`}
            onClick={() => setSelected(key)}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>
        <ContentPage
            key={config.entityName}
            entityName={config.entityName}
            endpoint={config.endpoint}
            fields={config.fields}
        />


    </div>
  );
};

export default ContentManagementPage;
