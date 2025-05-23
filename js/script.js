// Store users data
let users = [
    { id: 1, name: "Danny Broome", email: "danny@baltic.com", password: "!Password1", avatar: "https://media.giphy.com/media/84CRvhy2DJlwA/giphy.gif" },
    { id: 2, name: "Ace Cochez", email: "ace@baltic.com", password: "!Password2", avatar: "https://t3.ftcdn.net/jpg/01/18/50/58/360_F_118505846_PZCicmZZdCNIHS7HUrkUqiUpJMaoJZFZ.jpg" },
    { id: 3, name: "The Baltic Community", email: "baltic@baltic.com", password: "!Password3", avatar: "https://cdn.brandfetch.io/idf8ZReMDl/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B" },
    { id: 4, name: "Marjan Hussain", email: "marjan@baltic.com", password: "!Password4", avatar: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOG9wbjMwMHdtMHN2dWg4eXVzc2h2eWF3ZTRqc251bG5pNmxpemJpayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VBZ6EWbfnLXKoRoSDv/giphy.gif" },
    { id: 5, name: "Ruairi Orr", email: "ruairi@baltic.com", password: "!Password5", avatar: "https://t4.ftcdn.net/jpg/13/76/74/77/240_F_1376747702_xFXUDsz4hnes0pIZgxjPBLMVB6cytJQx.jpg" },
    { id: 6, name: "Bailey S", email: "bailey@baltic.com", password: "!Password6", avatar: "https://randomuser.me/api/portraits/men/1.jpg" }
];

// Store posts data
let posts = [
		{
				id: users[0].id,
				authorId: users[0].id,
				authorName: users[0].name,
                avatar: users[0].avatar,
				content: "Happy Friday! How are you? How has your week been? Up to anything this weekend? As per usual, I'll leave mine in the comments. Happy days!",
                timestamp: Date.now() - (300000) //Roughly 5 mins
		}
];

// Store events data
let events = [
		{
				id: 1,
				title: "Creating Replicas: How to re-imagine a website",
				month: "JUNE",
				day: "15",
				image: null
		},
		{
				id: 2,
				title: "How to upgrade the UI/UX of a community platform",
				month: "JULY",
				day: "27",
				image: null
		},
		{
				id: 3,
				title: "The Dangers of Bad UI",
				month: "AUGUST",
				day: "30",
				image: null
		}
];

// Current logged in user
let currentUser = null;

// Session Manager
// Check for existing session on page load
function checkSession() {
    const userData = localStorage.getItem('balticUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            loginUser(user, true); // true = from session
        } catch (e) {
            localStorage.removeItem('balticUser');
        }
    }
}

// Save session to localStorage
function saveSession(user) {
    localStorage.setItem('balticUser', JSON.stringify(user));
}

// Clear session from localStorage
function clearSession() {
    localStorage.removeItem('balticUser');
}


// DOM Elements
const loginPage = document.getElementById('login-page');
const signupPage = document.getElementById('signup-page');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signupBtn = document.getElementById('signup-btn');
const backToLoginBtn = document.getElementById('back-to-login-btn');
const userNameSpan = document.getElementById('user-name');
const postInput = document.getElementById('post-input');
const postsContainer = document.getElementById('posts-container');
const activeUsers = document.getElementById('active-users');
const eventList = document.getElementById('event-list');
const profileIcon = document.getElementById('profile-icon');
const postUserAvatar = document.getElementById('post-user-avatar');
const submitPostBtn = document.getElementById('submit-post-btn');
// Dropdown elements
const profileDropdown = document.getElementById('profile-dropdown');
const dropdownAvatar = document.getElementById('dropdown-avatar');
const dropdownUsername = document.getElementById('dropdown-username');
const logoutLink = document.getElementById('logout-link');

// Show login page by default
loginPage.classList.remove('hidden');

// Handle signup button click
signupBtn.addEventListener('click', () => {
		loginPage.classList.add('hidden');
		signupPage.classList.remove('hidden');
});

// Handle back to log in button
backToLoginBtn.addEventListener('click', () => {
		signupPage.classList.add('hidden');
		loginPage.classList.remove('hidden');
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Email regex validation - requires letters before and after @, followed by . and domain extension
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Password regex validation - at least 8 chars, 1 uppercase letter, and 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Validation
    let isValid = true;
    let errorMessage = "";
    
    // Make sure email is a string and validate format
    if (!email || typeof email !== 'string' || !emailRegex.test(email.toString())) {
        isValid = false;
        errorMessage += "Invalid email format. Email must have format like 'name@example.com'\n";
    }
    
    // Make sure password is a string and validate format
    if (!password || typeof password !== 'string' || !passwordRegex.test(password.toString())) {
        isValid = false;
        errorMessage += "Password must be at least 8 characters and include at least 1 uppercase letter and 1 number";
    }
    
    if (isValid) {
        const foundUser = users.find(user => user.email === email.toLowerCase() && user.password === password);
        if(foundUser) {
            loginUser({
                id: foundUser.id,
                avatar: foundUser.avatar,
                name: foundUser.name.split(' ')[0],
                email: foundUser.email
            });
        }
        else {
            loginUser({
                id: users.length + 1,
                name: email.split('@')[0],
                avatar: null,
                email: email
            });
        }
    } else {
        // Display error message
        alert(errorMessage);
    }
});

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const profilePictureInput = document.getElementById('profile-picture').files[0];
    
    // Email regex validation - requires letters before and after @, followed by . and domain extension
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Password regex validation - at least 8 chars, 1 uppercase letter and 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Validation
    let isValid = true;
    let errorMessage = "";
    
    // Make sure fullName is a string and not empty
    if (!fullName || typeof fullName !== 'string' || fullName.toString().trim() === '') {
        isValid = false;
        errorMessage += "Full name is required\n";
    }
    
    if (!emailRegex.test(email)) {
        isValid = false;
        errorMessage += "Invalid email format. Email must have format like 'name@example.com'\n";
    }
    
    if (!passwordRegex.test(password)) {
        isValid = false;
        errorMessage += "Password must be at least 8 characters and include at least 1 uppercase letter and 1 number";
    }
    
    if (isValid) {
        let avatarUrl = null;
        if (profilePictureInput) {
            avatarUrl = await convertImageToBase64(profilePictureInput);
        }
        // Create new user
        const newUser = {
            id: users.length + 1,
            name: fullName.split(' ')[0],
            email: email,
            avatar: avatarUrl
        };
        
        // Add to users array
        users?.push(newUser);
        
        // Log in the new user
        loginUser(newUser);
    } else {
        // Display error message
        alert(errorMessage);
    }
});

// Post when button is clicked
submitPostBtn.addEventListener('click', handlePostSubmit);

// Text box behavior

// Auto-resizing text area functionality
function autoResizeTextarea() {
    postInput.style.height = '36px'; 
    postInput.style.height = Math.max(36, postInput.scrollHeight) + 'px'; 

    if (postInput.scrollHeight > 300) {
        postInput.style.overflowY = 'auto';
    } else {
        postInput.style.overflowY = 'hidden';
    }
}

// Initialize once DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    postInput.style.resize = 'none'; 
    postInput.style.overflow = 'hidden';
    postInput.style.boxSizing = 'border-box';
    postInput.style.minHeight = '36px';
    postInput.style.maxHeight = '300px';
    postInput.style.width = '100%';
    
    postInput.addEventListener('input', autoResizeTextarea);
    
    // Initialize
    autoResizeTextarea();
});

postInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handlePostSubmit();
    }
});

function handlePostSubmit() {
    const content = postInput.value;
    
    if (content && content.trim() !== '') {
        const newPost = {
            id: Date.now(),
            authorId: currentUser.id,
            authorName: currentUser.name,
            avatar: currentUser.avatar,
            content: content,
            timestamp: Date.now()
        };
        
        // Add to posts array
        posts.unshift(newPost);
        
        // Refresh posts
        renderPosts();

        setTimeout(() => {
            postInput.value = '';
            autoResizeTextarea();
        }, 250);
    }
}

// Convert image to base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Handle post input focus
postInput.addEventListener('click', () => {
    // Focus on the input field when clicked
    postInput.focus();
});

// Navbar profile management dropdown
if (profileIcon) {
    profileIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        if (profileDropdown.classList.contains('hidden')) {
            updateDropdownProfile();
            profileDropdown.classList.remove('hidden');
        } else {
            profileDropdown.classList.add('hidden');
        }
    });
}

document.addEventListener('click', function(e) {
    if (!profileDropdown.classList.contains('hidden')) {
        if (!profileDropdown.contains(e.target) && e.target !== profileIcon) {
            profileDropdown.classList.add('hidden');
        }
    }
});

function updateDropdownProfile() {
    if (!currentUser) return;
    dropdownUsername.textContent = currentUser.name;
    if (currentUser.avatar) {
        dropdownAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}">`;
    } else {
        dropdownAvatar.textContent = currentUser.name.charAt(0);
    }
}

if (logoutLink) {
    logoutLink.addEventListener('click', function() {
        clearSession(); // Remove session from localStorage
        currentUser = null;
        mainApp.classList.add('hidden');
        loginPage.classList.remove('hidden');
        profileDropdown.classList.add('hidden');
    });
}

// Login user function
function loginUser(user, fromSession = false) {
		currentUser = user;
		
		// Add user to active users if not already there
		if (!users.find(u => u.id === user.id)) {
				users.push(user);
		}
		
		// Update UI
		userNameSpan.textContent = user.name;
		
		// Hide login/signup pages, show main app
		loginPage.classList.add('hidden');
		signupPage.classList.add('hidden');
		mainApp.classList.remove('hidden');
		
		 // Save session if not from session
    if (!fromSession) {
        saveSession(user);
    }
		
		// Initialize app
    updateCurrentUserAvatar();
		initApp();
}
  
// Update user avatar in UI
function updateCurrentUserAvatar() {
    if (currentUser) {
        // Profile icon in navbar
        if (currentUser.avatar) {
            profileIcon.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}" class="avatar-image">`;
        } else {
            profileIcon.textContent = currentUser.name.charAt(0);
        }

        // Post input avatar
        if (currentUser.avatar) {
            postUserAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}" class="avatar-image">`;
        } else {
            postUserAvatar.textContent = currentUser.name.charAt(0);
        }
    }
}

// Initialize app
function initApp() {
		renderPosts();
		renderActiveUsers();
		renderEvents();
}

// Render posts
function renderPosts() {
		postsContainer.innerHTML = '';

		if (posts.length === 0) {
				postsContainer.innerHTML = '<div class="post"><p>No posts yet. Be the first to post!</p></div>';
				return;
		}

		posts.forEach((post, index) => {
				const maxLength = 350; // Maximum length for truncation
				const showReadMore = post.content.length > maxLength; 
				const truncatedContent = showReadMore
						? post.content.slice(0, maxLength) + '...'
						: post.content;

				const postElement = document.createElement('div');
				postElement.className = 'post';
				postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar">
                            ${post.avatar
                ? `<img src="${post.avatar}" alt="${post.authorName}" class="avatar-image">`
                : post.authorName.charAt(0)}
                        </div>
                        <div class="author-info">
                            <h4>${post.authorName}</h4>
                            <span class="post-time">${formatTimeAgo(post.timestamp || Date.now())}</span>
                        </div>
                    </div>
                    <div class="post-options">⋮</div>
                </div>
                <div class="post-content">
                    <p>
                        <span class="post-text">${truncatedContent}</span>
                        ${showReadMore ? '<a href="#" class="read-more" data-index="' + index + '">Read more</a>' : ''}
                    </p>
                </div>
            `;

				postsContainer.appendChild(postElement);
                setupPostOptionsMenu();
		});

		// Add event listeners for "Read more" links
		const readMoreLinks = postsContainer.querySelectorAll('.read-more');
		readMoreLinks.forEach(link => {
				link.addEventListener('click', function(e) {
						e.preventDefault();
						const idx = this.getAttribute('data-index');
						const postText = this.parentElement.querySelector('.post-text');
						postText.textContent = posts[idx].content;
						this.style.display = 'none';
				});
		});
}

function formatTimeAgo(timestamp) {
    const sec = Math.floor((Date.now() - timestamp) / 1000);
    const mins = sec / 60;
    const hrs = mins / 60;
    const days = hrs / 24;
    
    if (days >= 1) return `${Math.floor(days)} day${days >= 2 ? 's' : ''} ago`;
    if (hrs >= 1) return `${Math.floor(hrs)} hour${hrs >= 2 ? 's' : ''} ago`;
    if (mins >= 1) return `${Math.floor(mins)} minute${mins >= 2 ? 's' : ''} ago`;
    return 'Just now';
}

// Handle post options menu
function setupPostOptionsMenu() {
    const postOptions = document.querySelectorAll('.post-options');
    
    postOptions.forEach((optionsButton, index) => {
        optionsButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Remove any existing options menus
            const existingMenus = document.querySelectorAll('.post-options-menu');
            existingMenus.forEach(menu => menu.remove());
            
            const post = posts[index];
            
            // Only show edit/delete for the current user's posts
            if (post.authorId === currentUser.id) {
                const optionsMenu = document.createElement('div');
                optionsMenu.className = 'post-options-menu';
                optionsMenu.innerHTML = `
                    <div class="option-item edit-post" data-index="${index}">Edit post</div>
                    <div class="option-item delete-post" data-index="${index}">Delete post</div>
                `;
                
                // Position the menu
                optionsButton.appendChild(optionsMenu);
                
                // Add event listeners
                const editOption = optionsMenu.querySelector('.edit-post');
                const deleteOption = optionsMenu.querySelector('.delete-post');
                
                editOption.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const postIndex = this.getAttribute('data-index');
                    optionsMenu.remove();
                    editPost(postIndex);
                });
                
                deleteOption.addEventListener('click', function() {
                    const postIndex = this.getAttribute('data-index');
                    deletePost(postIndex);
                    optionsMenu.remove();
                });
            }
        });
    });
    
    // Close menu if user clicks elsewhere
    document.addEventListener('click', function() {
        const existingMenus = document.querySelectorAll('.post-options-menu');
        existingMenus.forEach(menu => menu.remove());
    });
}

function editPost(index) {
    const post = posts[index];
    const postContent = document.querySelectorAll('.post-content')[index];
    const originalText = post.content;
    
    postContent.innerHTML = `
        <div class="edit-container">
            <textarea class="edit-textarea">${originalText}</textarea>
            <div class="edit-actions">
                <button class="btn btn-primary save-edit">Save</button>
                <button class="btn btn-secondary cancel-edit">Cancel</button>
            </div>
        </div>
    `;
    
    const textarea = postContent.querySelector('.edit-textarea');
    textarea.focus();
    
    // Set initial height based on content
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
    
    // Add event listener for textarea resizing as user types
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 300) + 'px';
    });
    
    // Add event listeners for save and cancel
    const saveButton = postContent.querySelector('.save-edit');
    const cancelButton = postContent.querySelector('.cancel-edit');
    
    saveButton.addEventListener('click', function() {
        const newContent = textarea.value.trim();
        if (newContent) {
            post.content = newContent;
            renderPosts();
        }
    });
    
    cancelButton.addEventListener('click', function() {
        renderPosts();
    });
}

function deletePost(index) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts.splice(index, 1);
        renderPosts();
    }
}

// Render active users
function renderActiveUsers() {
		activeUsers.innerHTML = '';
		
		users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.innerHTML = `
                <div class="user-avatar-small">
                    ${user.avatar
                ? `<img src="${user.avatar}" alt="${user.name}" class="avatar-image">`
                : user.name.charAt(0)}
                </div>
                <div class="user-name">${user.name}</div>
            `;
				
				activeUsers.appendChild(userElement);
		});
}

// Render events
function renderEvents() {
		eventList.innerHTML = '';
		
		if (events.length === 0) {
				eventList.innerHTML = '<p>No upcoming events</p>';
				return;
		}
		
		events.forEach(event => {
				const eventElement = document.createElement('div');
				eventElement.className = 'event-item';
				eventElement.innerHTML = `
						<div class="event-date">
								<div class="event-month">${event.month}</div>
								<div class="event-day">${event.day}</div>
						</div>
						<div class="event-info">
								<div class="event-title">${event.title}</div>
								<a href="#" class="event-link">Find out more</a>
						</div>
				`;
				
				eventList.appendChild(eventElement);
		});
}

// Initialize app
window.onload = function() {
		checkSession(); // Try to restore session
		// If no session, show login page
		if (!currentUser) {
				loginPage.classList.remove('hidden');
				}
};