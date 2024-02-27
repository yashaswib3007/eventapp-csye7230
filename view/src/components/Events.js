import React, { useState, useEffect } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    let url = `${process.env.REACT_APP_API_URL}/events`;
    if (filter) {
      url += `?filter=${filter}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  return (
    <div>
      <h2>Events</h2>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter events"
      />
      <button onClick={fetchEvents}>Apply Filter</button>
      {error && <p>{error}</p>}
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>Description: {event.description}</p>
            <p>City: {event.city}</p>
            <p>Neighborhood: {event.neighborhood}</p>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Organizer: {event.organizer.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
