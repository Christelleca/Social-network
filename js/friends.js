// Select DOM elements
const friendsContainer = document.getElementById('friends-list');
const friends = Array.from(document.querySelectorAll('.friend'));

// Function to sort friends by first and last name
function sortFriends() {
    const sortedFriends = friends.sort((a, b) => {
        const nameA = a.querySelector('p').textContent.toLowerCase();
        const nameB = b.querySelector('p').textContent.toLowerCase();
        if (!nameA || !nameB) return 0; // If one of the elements is null, return 0
        return nameA.localeCompare(nameB);
    });

    // Reinsert sorted friends into the container
    friendsContainer.innerHTML = ''; // Clear the container
    sortedFriends.forEach((friend) => friendsContainer.appendChild(friend));
}

// Drag and Drop
let draggedFriend = null;

friends.forEach((friend) => {
    // Start dragging
    friend.addEventListener('dragstart', (e) => {
        draggedFriend = e.target;
        setTimeout(() => (friend.style.display = 'none'), 0); // Temporarily hide
    });

    // End dragging
    friend.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedFriend.style.display = 'flex'; // Re-display the element
            draggedFriend = null;
        }, 0);
    });

    // Drop zone
    friend.addEventListener('dragover', (e) => e.preventDefault());
    friend.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedFriend && draggedFriend !== friend) {
            friendsContainer.insertBefore(draggedFriend, friend); // Reinsert
        }
    });

    // Redirect to the friend's conversation
    friend.addEventListener('click', () => {
        const friendKey = friend.getAttribute('data-friend');
        window.location.href = `messages.html?friend=${friendKey}`;
    });
});

// Initial sorting of friends
sortFriends();
