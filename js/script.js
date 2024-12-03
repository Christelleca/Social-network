// Function to fetch and display posts on the feed
async function displayPost() {
    try {
        // Fetch the JSON file containing posts
        const response = await fetch('assets/json/posts.json');
        const posts = await response.json();

        // Select the container where posts will be displayed
        const feed = document.getElementById('feed');

        // Loop through each post and dynamically generate HTML content
        posts.forEach((post) => {
            // Create a container for the post
            const postElement = document.createElement('div');
            postElement.classList.add('element', 'post');

            // Insert the structure of a post
            postElement.innerHTML = `
            <div class="post-header">
                <!-- User's profile picture and name -->
                <img src="${post.user.profilePicture}" alt="${
                post.user.name
            }" class="profile-picture">
                <span>${post.user.name}</span>
            </div>
            <div class="post-content">
                <!-- Post text content -->
                <p>${post.content.text}</p>
                ${
                    post.content.image
                        ? `<img src="${post.content.image}" alt="Post Image">` // Include image if available
                        : '' // Leave empty if no image
                }
            </div>
            <div class="post-reactions">
                <!-- Reaction buttons with dynamic counts -->
                <button class="like-button"><i class="ri-thumb-up-line"></i> ${
                    post.reactions.like
                }</button>
                <button class="dislike-button"><i class="ri-thumb-down-line"></i> ${
                    post.reactions.dislike
                }</button>
                <button class="love-button"><i class="ri-heart-fill"></i> ${
                    post.reactions.love
                }</button>
            </div>
        `;
            // Add the post to the feed container
            feed.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading posts:', error); // Log an error if fetching fails
    }
}

// Call the function to load and display posts
displayPost();
