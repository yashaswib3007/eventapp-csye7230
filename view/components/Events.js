// src/components/Events.js

import React, { useState, useEffect } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError('Failed to fetch events. Please log in.');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Events</h2>
      {error && <p>{error}</p>}
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.name}</li> // Adjust according to your data structure
        ))}
      </ul>
    </div>
  );
}

export default Events;
