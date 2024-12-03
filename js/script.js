// Fetch and display posts
async function displayPost() {
    try {
        const response = await fetch('assets/json/posts.json');
        const posts = await response.json();

        const feed = document.getElementById('feed');

        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('element', 'post');
            postElement.setAttribute('data-index', index);

            const commentsHTML = post.comments
                .map(
                    (comment) =>
                        `<div class="comment"><strong>${comment.user}</strong>: ${comment.text}</div>`
                )
                .join('');

            postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.user.profilePicture}" alt="${
                post.user.name
            }" class="profile-picture">
                <span>${post.user.name}</span>
            </div>
            <div class="post-content">
                <p>${post.content.text}</p>
                ${
                    post.content.image
                        ? `<img src="${post.content.image}" alt="Post Image">`
                        : ''
                }
            </div>
            <div class="post-reactions">
                <button class="like-button"><i class="ri-thumb-up-line"></i> <span>${
                    post.reactions.like
                }</span></button>
                <button class="dislike-button"><i class="ri-thumb-down-line"></i> <span>${
                    post.reactions.dislike
                }</span></button>
                <button class="love-button"><i class="ri-heart-2-line"></i> <span>${
                    post.reactions.love
                }</span></button>
            </div>
            <div class="comments-section">
                <div class="comments-list">${commentsHTML}</div>
                <form class="comment-form">
                    <input type="text" placeholder="Add a comment..." />
                    <button type="submit">Post</button>
                </form>
            </div>
            `;

            feed.appendChild(postElement);
        });

        addReactionListeners();
        addCommentListeners();
        addImagePreview();
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Add reaction listeners
function addReactionListeners() {
    const posts = document.querySelectorAll('.post');

    posts.forEach((post) => {
        const likeButton = post.querySelector('.like-button');
        const dislikeButton = post.querySelector('.dislike-button');
        const loveButton = post.querySelector('.love-button');

        const buttons = [likeButton, dislikeButton, loveButton];

        buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const counter = button.querySelector('span');
                const reactionType = button.classList[0]; // like-button, dislike-button, love-button
                const isActive = button.classList.contains('active');

                // If another button is active, deactivate it
                buttons.forEach((btn) => {
                    if (btn !== button && btn.classList.contains('active')) {
                        const otherCounter = btn.querySelector('span');
                        otherCounter.textContent =
                            parseInt(otherCounter.textContent, 10) - 1;
                        btn.classList.remove('active', 'blue', 'red', 'pink');
                    }
                });

                // Toggle the current button
                if (isActive) {
                    // Deactivate and decrement
                    button.classList.remove(
                        'active',
                        getColorClass(reactionType)
                    );
                    counter.textContent = parseInt(counter.textContent, 10) - 1;
                } else {
                    // Activate and increment
                    button.classList.add('active', getColorClass(reactionType));
                    counter.textContent = parseInt(counter.textContent, 10) + 1;

                    // Add dust animation
                    createDust(button, getColorClass(reactionType));
                }
            });
        });
    });
}

// Helper function to get the color class based on reaction type
function getColorClass(reactionType) {
    return reactionType === 'like-button'
        ? 'blue'
        : reactionType === 'dislike-button'
        ? 'red'
        : 'pink';
}

// Create dust animation
function createDust(button, colorClass) {
    const dustContainer = document.createElement('div');
    dustContainer.classList.add('dust-container');
    button.appendChild(dustContainer);

    const colors = {
        blue: '#6FDFFF',
        red: '#FF6F6F',
        pink: '#FF6FB5',
    };
    const color = colors[colorClass] || '#ffffff';
    const particles = 10;

    for (let i = 0; i < particles; i++) {
        const dust = document.createElement('span');
        dust.classList.add('dust');
        dust.style.backgroundColor = color;
        dust.style.left = `${Math.random() * 100}%`;
        dust.style.animationDelay = `${Math.random() * 0.3}s`;
        dust.style.animationDuration = '0.6s';
        dustContainer.appendChild(dust);
    }

    setTimeout(() => dustContainer.remove(), 1000);
}

// Add comment listeners
function addCommentListeners() {
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const commentInput = form.querySelector('input');
            const commentsList = form.previousElementSibling;

            if (commentInput.value.trim()) {
                const newComment = document.createElement('div');
                newComment.classList.add('comment');
                newComment.innerHTML = `<strong>You</strong>: ${commentInput.value.trim()}`;
                commentsList.appendChild(newComment);
                commentInput.value = '';
            }
        });
    });
}

// Add image preview (lightbox)
function addImagePreview() {
    const images = document.querySelectorAll('.post-content img');
    images.forEach((img) => {
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.innerHTML = `
                <img src="${img.src}" alt="Full Image">
                <button class="close-lightbox">&times;</button>
            `;
            document.body.appendChild(lightbox);

            lightbox
                .querySelector('.close-lightbox')
                .addEventListener('click', () => {
                    lightbox.remove();
                });
        });
    });
}

// Load posts on page load
displayPost();
