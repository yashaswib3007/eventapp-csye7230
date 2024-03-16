import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Eventdetails.css'; // If you have specific styles for this page

function Eventdetails() {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams(); // This will get the event ID from the URL

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            // Include other necessary headers
          },
        });

        if (!response.ok) {
          throw new Error('Event data fetch failed');
        }

        const eventData = await response.json();
        setEvent(eventData);
      } catch (error) {
        setError('Failed to load event details');
        console.error(error);
      }
    };

    fetchEventData();
  }, [id]); // Run this effect when the id changes

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!event) {
    return <p>Loading...</p>;
  }

  // Render event details
  return (
    <div className="event-detail-container">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>City: {event.city}</p>
      <p>Neighborhood: {event.neighborhood}</p>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Organizer: {event.organizer.username}</p>
      {/* Include other event details you wish to display */}
    </div>
  );
}

export default Eventdetails;