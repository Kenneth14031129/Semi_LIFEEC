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

const formatUserType = (userType) => {
    if (!userType) return '';
    
    return userType.toLowerCase() === 'family member' ? 'Relative' : userType;
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
    const [unreadCounts, setUnreadCounts] = useState({});
    const fileInputRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const [lastMessages, setLastMessages] = useState({});

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
        if (loggedInUserId) {
            fetchUnreadCounts();
            const interval = setInterval(fetchUnreadCounts, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [loggedInUserId]);

    const fetchUnreadCounts = async () => {
        if (!loggedInUserId) return;
    
        try {
            console.log("Fetching unread counts for user:", loggedInUserId); // Debug log
            const response = await api.get(`/messages/unread/${loggedInUserId}`);
            
            if (response && response.unreadCounts) {
                console.log("Received unread counts:", response.unreadCounts); // Debug log
                setUnreadCounts(response.unreadCounts);
            }
        } catch (error) {
            console.error("Error fetching unread counts:", {
                message: error.message,
                userId: loggedInUserId
            });
        }
    };

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

    const markMessagesAsRead = async (contactId) => {
        if (!loggedInUserId || !contactId) return;
    
        try {
            const response = await api.post('/messages/mark-read', {
                userId: loggedInUserId,
                contactId: contactId
            });
    
            if (response) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [contactId]: 0
                }));
    
                setMessages(prevMessages => 
                    prevMessages.map(msg => ({
                        ...msg,
                        read: msg.senderId === contactId ? true : msg.read
                    }))
                );
            }
        } catch (error) {
            console.error("Error marking messages as read:", error);
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
            const fileUrl = URL.createObjectURL(file);
            
            const newMsg = {
                senderId: loggedInUserId,
                receiverId: selectedContact._id,
                text: file.name,
                fileUrl: fileUrl,
                fileType: file.type,
                isFile: true,
                time: new Date().toISOString(),
                read: false
            };

            setMessages(prev => [...prev, newMsg]);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('senderId', loggedInUserId);
            formData.append('receiverId', selectedContact._id);

            console.log(`Uploading file: ${file.name}`);

            event.target.value = '';
        } catch (error) {
            console.error("Error handling file:", error);
            setError("Failed to handle file.");
        }
    };

    const handleContactClick = async (contact) => {
        setSelectedContact(contact);
        console.log("Selected contact:", contact);
        await fetchMessages(contact._id);
        await markMessagesAsRead(contact._id);
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
                time: new Date().toISOString(),
                read: false
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

    useEffect(() => {
        const fetchLastMessages = async () => {
            if (!loggedInUserId || !contacts.length) return;

            const messages = {};
            for (const contact of contacts) {
                try {
                    const data = await api.get(`/messages/${loggedInUserId}/${contact._id}`);
                    const contactMessages = data.messages || [];
                    if (contactMessages.length > 0) {
                        messages[contact._id] = contactMessages[contactMessages.length - 1];
                    }
                } catch (error) {
                    console.error(`Error fetching messages for contact ${contact._id}:`, error);
                }
            }
            setLastMessages(messages);
        };

        fetchLastMessages();
    }, [contacts, loggedInUserId]);

    const getLastMessage = (contact) => {
        const lastMessage = lastMessages[contact._id];
        if (!lastMessage) return "No messages yet";

        // If it's the logged-in user's message, add "You: " prefix
        const prefix = lastMessage.senderId === loggedInUserId ? "You: " : "";
        
        // For file messages
        if (lastMessage.isFile) {
            return `${prefix}📎 ${lastMessage.text}`;
        }
        
        // For text messages, truncate if too long
        const truncatedText = lastMessage.text.length > 30 
            ? lastMessage.text.substring(0, 27) + "..."
            : lastMessage.text;
        
        return `${prefix}${truncatedText}`;
    };

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
                        <option value="Family Member">Relative</option>
                        <option value="Nutritionist">Nutritionist</option>
                    </select>
                    <ul className="contact-list">
                        {filteredContacts.map(contact => (
                            <li
                                key={contact._id}
                                className={`contact-item 
                                    ${selectedContact && selectedContact._id === contact._id ? 'active' : ''} 
                                    ${unreadCounts[contact._id] > 0 ? 'has-unread' : ''}`}
                                onClick={() => handleContactClick(contact)}
                            >
                                <div 
                                    className="contact-avatar" 
                                    style={{ backgroundColor: getAvatarColor(contact.userType) }}
                                >
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="contact-details">
                                    <div className="contact-name">
                                        {contact.name}
                                        {unreadCounts[contact._id] > 0 && (
                                            <span className="unread-count">{unreadCounts[contact._id]}</span>
                                        )}
                                    </div>
                                    <div className="contact-message">
                                        {getLastMessage(contact)}
                                        {lastMessages[contact._id] && (
                                            <span className="message-time">
                                                {new Date(lastMessages[contact._id].time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    </aside>
                <main className="message-content">
                    {selectedContact ? (
                        <>
                            <div className="chat-header">
                                <div className="contact-info">
                                    <span className="selected-contact-name">
                                        {selectedContact.name}
                                    </span>
                                    {selectedContact.userType && (
                                        <span className="user-type">
                                            ({formatUserType(selectedContact.userType)})
                                        </span>
                                    )}
                                </div>
                                <div className="chat-actions">
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
                                    <div 
                                        key={msg.id || Math.random()} 
                                        className={`chat-bubble ${msg.senderId === loggedInUserId ? 'right' : 'left'} ${msg.read ? 'read' : 'unread'}`}
                                    >
                                        {renderMessage(msg)}
                                        <div className="message-metadata">
                                            {msg.senderId === loggedInUserId && (
                                                <span className="read-status">
                                                    {msg.read ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                            <span className="chat-time">
                                                {msg.time ? new Date(msg.time).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                }) : new Date().toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </span>
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