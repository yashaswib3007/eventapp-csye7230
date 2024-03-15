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
    const shareEvent = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: event.title,
            text: `${event.title} - ${event.description}. Find out more!`,
            url: window.location.href, // You might want to customize this URL to point to the specific event page if you have one.
          });
          console.log('Event shared successfully');
        } catch (error) {
          console.error('Error sharing the event', error);
        }
      } else {
        // Fallback for browsers that do not support the Web Share API
        console.log('Web Share API is not supported in your browser.');
      }
    };
   
    return (
  <button onClick={shareEvent}>Share Event</button>
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
            {/* Share button for each event */}     
            <ShareButton event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
