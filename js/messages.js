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

// Find the corresponding conversation and display it
if (friendKey) {
    const [firstName, lastName] = friendKey.split('_');
    activeConversation = conversations.find(
        (conv) =>
            conv.user.firstName === firstName && conv.user.lastName === lastName
    );
    if (activeConversation) {
        displayMessages(); // Display the messages of this conversation
    } else {
        console.log('No messages found for this friend.');
    }
}

// Retrieve URL parameters
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Load conversations from JSON or localStorage
function loadConversations() {
    const storedData = localStorage.getItem('conversations');
    if (storedData) {
        conversations = JSON.parse(storedData);
        const friendKey = getQueryParam('friend');
        if (friendKey) {
            setActiveConversation(friendKey);
        } else {
            populateConversations();
        }
    } else {
        fetch('../assets/json/messages.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load messages.json');
                }
                return response.json();
            })
            .then((data) => {
                conversations = data;
                const friendKey = getQueryParam('friend');
                if (friendKey) {
                    setActiveConversation(friendKey);
                } else {
                    populateConversations();
                }
            })
            .catch((error) => {
                console.error('Error loading JSON:', error);
            });
    }
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
    } else {
        chatMessages.innerHTML = '<p>No messages found for this friend.</p>';
    }
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

        conversationElement.innerHTML = `
            <div>
                <p class="friend-name">${conversation.user.firstName} ${conversation.user.lastName}</p>
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
