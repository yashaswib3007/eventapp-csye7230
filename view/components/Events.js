/*
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
*/

import React, { useState, useEffect } from 'react';

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    cities: {},
    neighborhoods: {},
    // Extend this object to include other filterable fields as appropriate
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    const filterQueries = [];
    for (const [key, value] of Object.entries(filters)) {
      for (const [itemKey, itemValue] of Object.entries(value)) {
        if (itemValue) {
          filterQueries.push(`${key}[]=${encodeURIComponent(itemKey)}`);
        }
      }
    }
    let url = `${process.env.REACT_APP_API_URL}/events?${filterQueries.join('&')}`;

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

  const handleFilterChange = (category, item) => {
    // Toggling the selected state of a filter item in the filters object
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category],
        [item]: !prevFilters[category][item],
      },
    }));
  };

  // Assuming you have a list of cities and neighborhoods to show in the filters.
  // You might need to fetch these lists from your backend or define them statically.
  const exampleCities = ['New York', 'Los Angeles', 'Chicago'];
  const exampleNeighborhoods = ['Downtown', 'Midtown', 'Uptown'];

  return (
    <div>
      <h2>Events</h2>
      <div>
        <strong>Cities</strong>
        {exampleCities.map(city => (
          <div key={city}>
            <label>
              <input
                type="checkbox"
                checked={filters.cities[city] || false}
                onChange={() => handleFilterChange('cities', city)}
              /> {city}
            </label>
          </div>
        ))}
      </div>
      <div>
        <strong>Neighborhoods</strong>
        {exampleNeighborhoods.map(neighborhood => (
          <div key={neighborhood}>
            <label>
              <input
                type="checkbox"
                checked={filters.neighborhoods[neighborhood] || false}
                onChange={() => handleFilterChange('neighborhoods', neighborhood)}
              /> {neighborhood}
            </label>
          </div>
        ))}
      </div>
      <button onClick={fetchEvents}>Apply Filter</button>
      {error && <p>{error}</p>}
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>Description: {event.description}</p>
            <p>City: {event.city}</p>
            <p>Neighborhood: {event.neighborhood}</p>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Organizer: {event.organizer}</p> {/* You might need to adjust how organizer is displayed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
