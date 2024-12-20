import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import AuthService from "../../../services/authService";
import "../styles/Messages.css";
import { api } from "../api/api";

const getAvatarColor = (userType) => {
    console.log("Getting avatar color for userType:", userType);
    
    switch (userType?.toLowerCase()) {
        case "nurse":
            return "#000000";
        case "family member":
            return "#32CD32";
        case "nutritionist":
            return "#FF69B4";
        default:
            console.log("No matching user type found, using default color");
            return "#808080";
    }
};

const Messages = () => {
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const fileInputRef = useRef(null);
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        const user = AuthService.getUser();
        if (user && user._id) {
            setLoggedInUserId(user._id);
            console.log("Logged-in user ID:", user._id);
        } else {
            console.error("User ID is undefined. Ensure the user is logged in.");
            setError("You must be logged in to view messages.");
        }
    }, []);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = AuthService.getAuthToken();
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const data = await api.get('/user/users');
                console.log("Fetched contacts with user types:", data.users.map(user => ({
                    name: user.name,
                    userType: user.userType
                })));
                
                setContacts(data.users || []);
                setFilteredContacts(data.users || []);
                if (data.users && data.users.length > 0) {
                    setSelectedContact(data.users[0]);
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
                if (error.response?.status === 401) {
                    setError("Session expired. Please log in again.");
                    AuthService.logout();
                } else {
                    setError("Failed to load contacts.");
                }
            }
        };

        if (loggedInUserId && AuthService.isAuthenticated()) {
            fetchContacts();
        }
    }, [loggedInUserId]);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    const handleCallClick = () => {
        if (!selectedContact) {
            setError("Please select a contact to call.");
            return;
        }

        setIsCallActive(!isCallActive);
        if (!isCallActive) {
            console.log(`Initiating call with ${selectedContact.name}`);
            alert(`Initiating call with ${selectedContact.name}`);
        } else {
            console.log(`Ending call with ${selectedContact.name}`);
            alert(`Ending call with ${selectedContact.name}`);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!selectedContact) {
            setError("Please select a contact to send files to.");
            return;
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            setError("File size exceeds 5MB limit.");
            return;
        }

        try {
            // Create a preview URL for the file
            const fileUrl = URL.createObjectURL(file);
            
            // Create message with file
            const newMsg = {
                senderId: loggedInUserId,
                receiverId: selectedContact._id,
                text: file.name,
                fileUrl: fileUrl,
                fileType: file.type,
                isFile: true,
                time: new Date().toISOString()
            };

            // Add message to the chat
            setMessages(prev => [...prev, newMsg]);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('senderId', loggedInUserId);
            formData.append('receiverId', selectedContact._id);

            console.log(`Uploading file: ${file.name}`);

            // You would typically make an API call here to upload the file
            // await api.post('/messages/upload', formData);

            event.target.value = '';
        } catch (error) {
            console.error("Error handling file:", error);
            setError("Failed to handle file.");
        }
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        console.log("Selected contact:", contact);
        fetchMessages(contact._id);
    };

    const fetchMessages = async (contactId) => {
        if (!loggedInUserId || !contactId) {
            console.error("Both sender and receiver IDs are required.");
            setError("Invalid user ID or contact ID.");
            return;
        }

        if (!AuthService.isAuthenticated()) {
            setError("Please log in to view messages.");
            return;
        }

        setLoading(true);
        setError(null);
        console.log(`Fetching messages between ${loggedInUserId} and ${contactId}`);
        
        try {
            const data = await api.get(`/messages/${loggedInUserId}/${contactId}`);
            console.log("Fetched messages:", data.messages);
            setMessages(data.messages || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
            if (error.response?.status === 401) {
                setError("Session expired. Please log in again.");
                AuthService.logout();
            } else {
                setError("Failed to load messages.");
            }
        } finally {
            setLoading(false);
        }
    };

    const sendMessageToServer = async (message) => {
        if (!AuthService.isAuthenticated()) {
            setError("Please log in to send messages.");
            return;
        }

        console.log("Sending message to server:", message);
        try {
            const savedMessage = await api.post('/messages/send', message);
            console.log("Message sent and saved:", savedMessage.message);
            setMessages((prevMessages) => [...prevMessages, savedMessage.message]);
        } catch (error) {
            console.error("Error sending message:", error);
            if (error.response?.status === 401) {
                setError("Session expired. Please log in again.");
                AuthService.logout();
            } else {
                setError("Failed to send message.");
            }
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedContact) {
            const newMsg = {
                senderId: loggedInUserId,
                receiverId: selectedContact._id,
                text: newMessage,
                time: new Date().toISOString()
            };
            console.log("Preparing to send message:", newMsg);

            sendMessageToServer(newMsg);
            setNewMessage("");
        } else {
            console.error("Cannot send message: Either message is empty or no contact selected.");
            setError("Please select a contact and enter a message.");
        }
    };

    const renderMessage = (msg) => {
        if (msg.isFile && msg.fileType?.startsWith('image/')) {
            return (
                <div className="message-image-container">
                    <img 
                        src={msg.fileUrl} 
                        alt={msg.text} 
                        className="message-image"
                    />
                    <span className="file-name">{msg.text}</span>
                </div>
            );
        }
        return <div className="chat-text">{msg.text}</div>;
    };

    useEffect(() => {
        const filtered = contacts.filter(contact => {
            const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = userTypeFilter ? contact.userType?.toLowerCase() === userTypeFilter.toLowerCase() : true;
            return matchesSearch && matchesType;
        });
        setFilteredContacts(filtered);
    }, [searchQuery, userTypeFilter, contacts]);

    if (!AuthService.isAuthenticated()) {
        return (
            <div className="messages-container">
                <Header />
                <div className="messages-body">
                    <div className="error-message">
                        Please log in to view your messages.
                    </div>
                </div>
            </div>
        );
    }

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
                                <div 
                                    className="contact-avatar" 
                                    style={{ backgroundColor: getAvatarColor(contact.userType) }}
                                >
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
                                <span className="selected-contact-name">{selectedContact.name}</span>
                                <div className="chat-actions">
                                    <button 
                                        className={`call-btn ${isCallActive ? 'active' : ''}`}
                                        onClick={handleCallClick}
                                    >
                                        {isCallActive ? '📞 End' : '📞 Call'}
                                    </button>
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
                                        <div key={msg.id || Math.random()} className={`chat-bubble ${msg.senderId === loggedInUserId ? 'right' : 'left'}`}>
                                            {renderMessage(msg)}
                                            <div className="chat-time">
                                                {msg.time ? new Date(msg.time).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                }) : new Date().toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="message-input">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*,.pdf,.doc,.docx"
                                />
                                <button className="file-btn" onClick={handleFileClick}>📎</button>
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