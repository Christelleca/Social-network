// DOM Elements
const conversationList = document.getElementById('conversations');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');

// Load conversations and messages
let conversations = [];
let activeConversation = null;

// Retrieve the selected friend from the URL
const urlParams = new URLSearchParams(window.location.search);
const friendKey = urlParams.get('friend');

// Load conversations from JSON or localStorage
function loadConversations() {
    const storedData = localStorage.getItem('conversations');
    if (storedData) {
        try {
            conversations = JSON.parse(storedData);
            if (!Array.isArray(conversations)) {
                throw new Error('Stored data is not an array');
            }
            populateConversations();
            if (friendKey) {
                setActiveConversation(friendKey);
            }
        } catch (error) {
            console.error('Error parsing stored data:', error);
            localStorage.removeItem('conversations'); // Clean corrupted data
            fetchConversationsFromJSON();
        }
    } else {
        fetchConversationsFromJSON();
    }
}

// Fetch conversations from JSON
function fetchConversationsFromJSON() {
    fetch('../assets/json/messages.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to load messages.json');
            }
            return response.json();
        })
        .then((data) => {
            conversations = data;
            populateConversations();
            if (friendKey) {
                setActiveConversation(friendKey);
            }
        })
        .catch((error) => {
            console.error('Error loading JSON:', error);
        });
}

// Set the active conversation based on a friend identifier
function setActiveConversation(friendKey) {
    const [firstName, lastName] = friendKey.split('_');
    activeConversation = conversations.find(
        (conversation) =>
            conversation.user.firstName === firstName &&
            conversation.user.lastName === lastName
    );

    if (activeConversation) {
        displayMessages();
        highlightActiveConversation(friendKey);
    } else {
        chatMessages.innerHTML = '<p>No messages found for this friend.</p>';
    }
}

// Highlight the active conversation
function highlightActiveConversation(friendKey) {
    const conversationElements = document.querySelectorAll('.conversation');
    conversationElements.forEach((element) => {
        if (element.dataset.friend === friendKey) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

// Populate the conversation list
function populateConversations() {
    conversationList.innerHTML = ''; // Reset the conversation list
    conversations.forEach((conversation, index) => {
        const lastMessageObj =
            conversation.messages[conversation.messages.length - 1];
        const lastMessage = lastMessageObj
            ? `${lastMessageObj.sender || 'Unknown Sender'}: ${
                  lastMessageObj.content || 'No Content'
              }`
            : 'No messages yet';

        const conversationElement = document.createElement('div');
        conversationElement.classList.add('conversation');
        conversationElement.dataset.index = index; // Index for quick reference

        // Add data-friend with a unique key for each user
        conversationElement.dataset.friend = `${conversation.user.firstName}_${conversation.user.lastName}`;

        // Use the profile picture from the JSON
        const profilePictureSrc = `../assets/images/profiles/${conversation.user.profilePicture}`;

        conversationElement.innerHTML = `
            <div>
                <img src="${profilePictureSrc}" alt="${conversation.user.firstName} ${conversation.user.lastName}" class="profile-picture">
                <p class="friend-name"><strong>${conversation.user.firstName} ${conversation.user.lastName}</strong></p>
                <p>${lastMessage}</p>
            </div>
        `;

        // Add a click event to activate the conversation
        conversationElement.addEventListener('click', () => {
            activeConversation = conversation;

            // Update the URL to include the friend parameter
            const friendKey = conversationElement.dataset.friend;
            if (friendKey) {
                const newUrl = `${
                    window.location.pathname
                }?friend=${encodeURIComponent(friendKey)}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
            }

            displayMessages();
            highlightActiveConversation(friendKey);
        });

        // Add the element to the conversation list
        conversationList.appendChild(conversationElement);
    });
}

// Display messages in the chat window
function displayMessages() {
    if (!activeConversation) return;

    chatMessages.innerHTML = ''; // Clear current messages
    activeConversation.messages.forEach((message) => {
        const sender = message.sender || 'Unknown Sender';
        const content = message.content || 'No Content';

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `
            <p><strong>${sender}</strong></p>
            <p>${content}</p>
            <span class="timestamp">${new Date(
                message.timestamp
            ).toLocaleString()}</span>
        `;
        chatMessages.appendChild(messageElement);
    });
}

// Send a new message
sendMessageButton.addEventListener('click', () => {
    if (!activeConversation || !messageInput.value.trim()) return;

    const newMessage = {
        sender: 'You',
        content: messageInput.value.trim(),
        timestamp: new Date().toISOString(),
    };

    activeConversation.messages.push(newMessage);

    // Update UI
    displayMessages();
    populateConversations();
    messageInput.value = '';

    localStorage.setItem('conversations', JSON.stringify(conversations));
});

// Load initial data
loadConversations();
