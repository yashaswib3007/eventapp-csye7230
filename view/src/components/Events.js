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
            {/* Share button for each event */}     
            <ShareButton event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
