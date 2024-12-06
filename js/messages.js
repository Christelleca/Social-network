// DOM Elements
const conversationList = document.getElementById('conversations');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');

// Load conversations and messages
let conversations = [];
let activeConversation = null;

// Load JSON data (mock localStorage first load)
function loadConversations() {
    const storedData = localStorage.getItem('conversations');
    if (storedData) {
        conversations = JSON.parse(storedData);
        populateConversations();
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
                populateConversations();
            })
            .catch((error) => {
                console.error('Error loading JSON:', error);
            });
    }
}

// Populate the conversation list
function populateConversations() {
    conversationList.innerHTML = '';
    conversations.forEach((conversation) => {
        // Retrieve the last message from the conversation
        const lastMessageObj =
            conversation.messages[conversation.messages.length - 1];

        // Define lastMessage
        const lastMessage = lastMessageObj
            ? `${
                  lastMessageObj.sender ||
                  lastMessageObj.user ||
                  'Unknown Sender'
              }: ${
                  lastMessageObj.content || lastMessageObj.text || 'No Content'
              }`
            : 'No messages yet';

        // Create a new conversation element
        const conversationElement = document.createElement('div');
        conversationElement.classList.add('conversation');
        conversationElement.innerHTML = `
            <div>
                <p>${conversation.user.name}</p>
                <p>${lastMessage}</p>
            </div>
        `;

        // Add click event to open the conversation
        conversationElement.addEventListener('click', () => {
            activeConversation = conversation;
            displayMessages();
        });

        // Append the new conversation element to the list
        conversationList.appendChild(conversationElement);
    });
}

// Display messages in the chat window
function displayMessages() {
    if (!activeConversation) return;

    chatMessages.innerHTML = ''; // Clear current messages
    activeConversation.messages.forEach((message) => {
        const sender = message.sender || message.user || 'Unknown Sender';
        const content = message.content || message.text || 'No Content';

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

    // Add to the current conversation
    activeConversation.messages.push(newMessage);

    // Update lastMessage for the active conversation
    activeConversation.lastMessage = newMessage.content;

    // Update UI
    displayMessages();

    // Update the conversation list to reflect the new last message
    populateConversations();
    // Clear input field
    messageInput.value = '';

    // Save updated data to localStorage
    localStorage.setItem('conversations', JSON.stringify(conversations));
});

// Update the conversation list dynamically
function updateConversationList() {
    const activeIndex = conversations.indexOf(activeConversation);
    if (activeIndex >= 0) {
        const conversationElement = conversationList.querySelector(
            `[data-index="${activeIndex}"]`
        );
        if (conversationElement) {
            const lastMessage =
                activeConversation.messages[
                    activeConversation.messages.length - 1
                ];
            conversationElement.querySelector('p:nth-child(2)').textContent =
                lastMessage.content;
        }
    }
}

// Initial load
loadConversations();
