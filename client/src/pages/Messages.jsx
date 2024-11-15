// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import AuthService from "../../../services/AuthService";
import "../styles/Messages.css";

// Utility function to generate a color based on the first letter of the contact's name
const getAvatarColor = (name) => {
    if (name === "Nurse") return "#000000"; // Black color for Nurse
    if (name === "Family of the Resident") return "#32CD32"; // Green for Family of the Resident
    return "#FF69B4"; // Pink for Nutritionist
};

const Messages = () => {
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState(""); // New filter state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const chatMessagesRef = useRef(null);

    // Retrieve logged-in user ID from AuthService
    useEffect(() => {
        const userId = AuthService.getUserId();
        if (userId) {
            setLoggedInUserId(userId);
            console.log("Logged-in user ID:", userId);
        } else {
            console.error("User ID is undefined. Ensure the user is logged in.");
            setError("You must be logged in to view messages.");
        }
    }, []);

    // Fetch contacts from the API
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/users`);
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts.");
                }
                const data = await response.json();
                console.log("Fetched contacts:", data.users);
                setContacts(data.users || []);
                setFilteredContacts(data.users || []); // Initialize with all contacts
                if (data.users && data.users.length > 0) {
                    setSelectedContact(data.users[0]); // Default to the first contact
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
                setError("Failed to load contacts.");
            }
        };

        if (loggedInUserId) {
            fetchContacts();
        }
    }, [loggedInUserId]);

    // Scroll to the bottom when messages change
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle contact click to load messages for that contact
    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        console.log("Selected contact:", contact);
        fetchMessages(contact._id);
    };

    // Fetch messages from the server for the selected contact
    const fetchMessages = async (contactId) => {
        if (!loggedInUserId || !contactId) {
            console.error("Both sender and receiver IDs are required.");
            setError("Invalid user ID or contact ID.");
            return;
        }

        setLoading(true);
        setError(null);
        console.log(`Fetching messages between ${loggedInUserId} and ${contactId}`);
        
        try {
            const response = await fetch(`http://localhost:3000/api/v1/messages/${loggedInUserId}/${contactId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch messages.");
            }
            const data = await response.json();
            console.log("Fetched messages:", data.messages);
            setMessages(data.messages || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError("Failed to load messages.");
        } finally {
            setLoading(false);
        }
    };

    // Send message to the server
    const sendMessageToServer = async (message) => {
        console.log("Sending message to server:", message);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/messages/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });
            if (!response.ok) {
                throw new Error("Failed to send message.");
            }
            const savedMessage = await response.json();
            console.log("Message sent and saved:", savedMessage.message);
            setMessages((prevMessages) => [...prevMessages, savedMessage.message]); // Add saved message to the list
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message.");
        }
    };

    // Handle sending a new message
    const handleSendMessage = () => {
        if (newMessage.trim() && selectedContact) {
            const newMsg = {
                senderId: loggedInUserId, // Ensure this is the logged-in user's ID
                receiverId: selectedContact._id,
                text: newMessage,
            };
            console.log("Preparing to send message:", newMsg);

            // Send message to server and reset input
            sendMessageToServer(newMsg);
            setNewMessage("");
        } else {
            console.error("Cannot send message: Either the new message text is empty or selected contact is not set.");
            setError("Please select a contact and enter a message.");
        }
    };

    // Filter contacts based on search query and user type
    useEffect(() => {
        const filtered = contacts.filter(contact => {
            const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = userTypeFilter ? contact.userType === userTypeFilter : true;
            return matchesSearch && matchesType;
        });
        setFilteredContacts(filtered);
    }, [searchQuery, userTypeFilter, contacts]);

    return (
        <div className="messages-container">
            <Header />
            <div className="messages-body">
                <aside className="sidebar">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-bar"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        value={userTypeFilter}
                        onChange={(e) => setUserTypeFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All User Types</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Family Member">Family Member</option>
                        <option value="Nutritionist">Nutritionist</option>
                    </select>
                    <ul className="contact-list">
                        {filteredContacts.map(contact => (
                            <li
                                key={contact._id}
                                className={`contact-item ${selectedContact && selectedContact._id === contact._id ? 'active' : ''}`}
                                onClick={() => handleContactClick(contact)}
                            >
                                <div className="contact-avatar" style={{ backgroundColor: getAvatarColor(contact.name) }}>
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="contact-details">
                                    <div className="contact-name">{contact.name}</div>
                                    <div className="contact-message">Last message preview...</div>
                                </div>
                                <div className="contact-time">Time</div>
                            </li>
                        ))}
                    </ul>
                    <button className="add-contact-btn">+</button>
                </aside>
                <main className="message-content">
                    {selectedContact ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-avatar" style={{ backgroundColor: getAvatarColor(selectedContact.name) }}>
                                    {selectedContact.name.charAt(0).toUpperCase()}
                                </div>
                                <h2>{selectedContact.name}</h2>
                                <div className="chat-actions">
                                    <button className="call-btn">📞</button>
                                    <button className="video-call-btn">📹</button>
                                    <button className="delete-btn">🗑️</button>
                                </div>
                            </div>
                            <div className="chat-messages" ref={chatMessagesRef}>
                                {loading ? (
                                    <p>Loading messages...</p>
                                ) : error ? (
                                    <p className="error-message">{error}</p>
                                ) : messages.length === 0 ? (
                                    <p>No messages available.</p>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className={`chat-bubble ${msg.senderId === loggedInUserId ? 'right' : 'left'}`}>
                                            <div className="chat-text">
                                                {msg.text}
                                            </div>
                                            <div className="chat-time">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="message-input">
                                <button className="file-btn">📎</button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <h2>Select a contact to view messages</h2>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Messages;
