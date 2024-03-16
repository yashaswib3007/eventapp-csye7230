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
  function ShareButton({ event }) {
    const [socialMediaId, setSocialMediaId] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setSocialMediaId(data.socialMediaId);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('An error occurred while fetching user data', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);
  
    const handleShareClick = async () => {
      if (!socialMediaId) {
        // Show input for socialMediaId if not present
        setShowInput(true);
        return;
      }
  
      // Proceed with sharing functionality
      if (navigator.share) {
        try {
          await navigator.share({
            title: event.title,
            text: `${event.title} - ${event.description}. Find out more!`,
            url: window.location.href,
          });
          console.log('Event shared successfully');
        } catch (error) {
          console.error('Error sharing the event', error);
        }
      } else {
        console.log('Web Share API is not supported in your browser.');
      }
    };
  
    const handleSubmit = async () => {
      const updateSocialMediaId = async (newId) => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/user/updateSocialMediaId`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ socialMediaId: newId }),
          });
  
          if (response.ok) {
            setSocialMediaId(newId);
            setShowInput(false);
            setMessage('Your social media account has been added.');
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
          } else {
            console.error('Failed to update social media ID');
          }
        } catch (error) {
          console.error('An error occurred while updating social media ID', error);
        }
      };
  
      updateSocialMediaId(inputValue);
    };
  
    if (loading) return <p>Loading...</p>;
  
    if (showInput) {
      return (
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your Social Media ID"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      );
    }
  
    return (
      <>
        <button onClick={handleShareClick}>Share Event</button>
        {message && <p>{message}</p>}
      </>
    );
  }
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
            <ShareButton event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
/*


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css'; // Ensure this points to the correct path of your CSS file

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

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

  function ShareButton({ event }) {
    const shareEvent = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: event.title,
            text: `${event.title} - ${event.description}. Find out more!`,
            url: window.location.href,
          });
          console.log('Event shared successfully');
        } catch (error) {
          console.error('Error sharing the event', error);
        }
      } else {
        console.log('Web Share API is not supported in your browser.');
      }
    };

    return <button onClick={shareEvent}>Share Event</button>;
  }

  function ViewButton({ eventId }) {
    const navigate = useNavigate(); // This should be at the top of your component with other hooks.
  
    return <button onClick={() => navigate(`/event-details/${eventId}`)}>View</button>;
  }
  

  return (
    <div className="events-container">
      <h2 className="events-title">Events</h2>
      <input
        className="events-filter"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter events"
      />
      <button className="events-apply-button" onClick={fetchEvents}>Apply Filter</button>
      {error && <p className="events-error">{error}</p>}
      <ul className="events-list">
        {events.map((event) => (
          <li className="event-item" key={event._id}>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">Description: {event.description}</p>
            <p className="event-city">City: {event.city}</p>
            <p className="event-neighborhood">Neighborhood: {event.neighborhood}</p>
            <p className="event-date">Date: {new Date(event.date).toLocaleString()}</p>
            <p className="event-organizer">Organizer: {event.organizer.username}</p>
            <div className="event-actions">
              <ShareButton event={event} />
              <ViewButton eventId={event._id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

function Events() {
  const [allEvents, setAllEvents] = useState([]); // Will hold all events fetched from the backend
  const [displayedEvents, setDisplayedEvents] = useState([]); // Will hold filtered events for display
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // You'll have states to store selected filter values
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

  useEffect(() => {
    // Fetch all events once and store them
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setAllEvents(data);
        setDisplayedEvents(data); // Initially, all events are displayed
      } catch (error) {
        setError('Failed to fetch events. Please try again later.');
        console.error('Fetch error:', error);
      }
    };

    fetchEvents();
  }, []);

  const filterEvents = () => {
    // Filter events based on selected filters
    let filtered = allEvents;
    if (selectedCity) {
      filtered = filtered.filter(event => event.city === selectedCity);
    }
    if (selectedNeighborhood) {
      filtered = filtered.filter(event => event.neighborhood === selectedNeighborhood);
    }
    // Set the filtered events to be displayed
    setDisplayedEvents(filtered);
  };

  // Call filterEvents whenever a filter changes
  useEffect(() => {
    filterEvents();
  }, [selectedCity, selectedNeighborhood]);

  // ... rest of your component logic

  return (
    <div className="events-container">
      <h2 className="events-title">Events</h2>
      
      <div>
        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
          <option value="">All Cities</option>

        </select>
        <select value={selectedNeighborhood} onChange={e => setSelectedNeighborhood(e.target.value)}>
          <option value="">All Neighborhoods</option>
        </select>
      </div>
      
      {error && <p className="events-error">{error}</p>}
      <ul className="events-list">
        {displayedEvents.map(event => (
          <li className="event-item" key={event._id}>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css'; // Ensure this points to the correct path of your CSS file

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

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

  // Complex ShareButton from the first events.js
  function ShareButton({ event }) {
    const [socialMediaId, setSocialMediaId] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setSocialMediaId(data.socialMediaId);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('An error occurred while fetching user data', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, []);

    const handleShareClick = async () => {
      if (!socialMediaId) {
        setShowInput(true);
        return;
      }

      if (navigator.share) {
        try {
          await navigator.share({
            title: event.title,
            text: `${event.title} - ${event.description}. Find out more!`,
            url: window.location.href,
          });
          console.log('Event shared successfully');
        } catch (error) {
          console.error('Error sharing the event', error);
        }
      } else {
        console.log('Web Share API is not supported in your browser.');
      }
    };

    const handleSubmit = async () => {
      updateSocialMediaId(inputValue);
    };

    const updateSocialMediaId = async (newId) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/updateSocialMediaId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ socialMediaId: newId }),
        });

        if (response.ok) {
          setSocialMediaId(newId);
          setShowInput(false);
          setMessage('Your social media account has been added.');
          setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        } else {
          console.error('Failed to update social media ID');
        }
      } catch (error) {
        console.error('An error occurred while updating social media ID', error);
      }
    };

    if (loading) return <p>Loading...</p>;

    if (showInput) {
      return (
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your Social Media ID"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      );
    }

    return (
      <>
        <button onClick={handleShareClick}>Share Event</button>
        {message && <p>{message}</p>}
      </>
    );
  }

  function ViewButton({ eventId }) {
    // This navigate function is already defined at the top of your Events component
    return <button onClick={() => navigate(`/event-details/${eventId}`)}>View</button>;
  }

  return (
    <div className="events-container">
      <h2 className="events-title">Events</h2>
      <input
        className="events-filter"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter events"
      />
      <button className="events-apply-button" onClick={fetchEvents}>Apply Filter</button>
      {error && <p className="events-error">{error}</p>}
      <ul className="events-list">
        {events.map((event) => (
          <li className="event-item" key={event._id}>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">Description: {event.description}</p>
            <p className="event-city">City: {event.city}</p>
            <p className="event-neighborhood">Neighborhood: {event.neighborhood}</p>
            <p className="event-date">Date: {new Date(event.date).toLocaleString()}</p>
            <p className="event-organizer">Organizer: {event.organizer.username}</p>
            <div className="event-actions">
              <ShareButton event={event} />
              <ViewButton eventId={event._id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
