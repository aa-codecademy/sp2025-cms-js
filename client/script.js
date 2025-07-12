document.addEventListener('DOMContentLoaded', () => {
	const articlesContainer = document.getElementById('articles-container');
	const BACKEND_URL = 'http://localhost:3000/api'; // Your NestJS backend URL

	// Auth elements
	const loginBtn = document.getElementById('login-btn');
	const registerBtn = document.getElementById('register-btn');
	const logoutBtn = document.getElementById('logout-btn');
	const userInfo = document.getElementById('user-info');
	const loginModal = document.getElementById('login-modal');
	const registerModal = document.getElementById('register-modal');
	const loginForm = document.getElementById('login-form');
	const registerForm = document.getElementById('register-form');

	// Check if user is logged in on page load
	checkAuthStatus();

	// Auth event listeners
	loginBtn.addEventListener('click', () => showModal(loginModal));
	registerBtn.addEventListener('click', () => showModal(registerModal));
	logoutBtn.addEventListener('click', logout);

	// Close modals when clicking on X
	document.querySelectorAll('.close').forEach(closeBtn => {
		closeBtn.addEventListener('click', () => {
			loginModal.style.display = 'none';
			registerModal.style.display = 'none';
		});
	});

	// Close modals when clicking outside
	window.addEventListener('click', event => {
		if (event.target === loginModal) {
			loginModal.style.display = 'none';
		}
		if (event.target === registerModal) {
			registerModal.style.display = 'none';
		}
	});

	// Form submissions
	loginForm.addEventListener('submit', handleLogin);
	registerForm.addEventListener('submit', handleRegister);

	function showModal(modal) {
		modal.style.display = 'block';
	}

	function checkAuthStatus() {
		const token = localStorage.getItem('authToken');
		const user = JSON.parse(localStorage.getItem('user') || 'null');

		if (token && user) {
			// User is logged in
			loginBtn.style.display = 'none';
			registerBtn.style.display = 'none';
			logoutBtn.style.display = 'inline-block';
			userInfo.style.display = 'inline-block';
			userInfo.textContent = `Welcome, ${user.name}!`;
		} else {
			// User is not logged in
			loginBtn.style.display = 'inline-block';
			registerBtn.style.display = 'inline-block';
			logoutBtn.style.display = 'none';
			userInfo.style.display = 'none';
		}
	}

	async function handleLogin(event) {
		event.preventDefault();

		const email = document.getElementById('login-email').value;
		const password = document.getElementById('login-password').value;

		try {
			const response = await fetch(`${BACKEND_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				throw new Error('Login failed');
			}

			const data = await response.json();

			// Store auth data
			localStorage.setItem('authToken', data.accessToken);
			localStorage.setItem('user', JSON.stringify(data.user));

			// Update UI
			checkAuthStatus();
			loginModal.style.display = 'none';
			loginForm.reset();

			alert('Login successful!');
		} catch (error) {
			console.error('Login error:', error);
			alert('Login failed. Please check your credentials.');
		}
	}

	async function handleRegister(event) {
		event.preventDefault();

		const name = document.getElementById('register-name').value;
		const email = document.getElementById('register-email').value;
		const password = document.getElementById('register-password').value;

		try {
			const response = await fetch(`${BACKEND_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password }),
			});

			if (!response.ok) {
				throw new Error('Registration failed');
			}

			const data = await response.json();

			// Store auth data
			localStorage.setItem('authToken', data.accessToken);
			localStorage.setItem('user', JSON.stringify(data.user));

			// Update UI
			checkAuthStatus();
			registerModal.style.display = 'none';
			registerForm.reset();

			alert('Registration successful!');
		} catch (error) {
			console.error('Registration error:', error);
			alert('Registration failed. Please try again.');
		}
	}

	function logout() {
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		checkAuthStatus();
		alert('Logged out successfully!');
	}

	async function fetchArticles() {
		try {
			const response = await fetch(`${BACKEND_URL}/articles`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();

			articlesContainer.innerHTML = ''; // Clear loading message

			if (!result.data || result.data.length === 0) {
				articlesContainer.innerHTML =
					'<p>No articles found. Add some in Strapi!</p>';
				return;
			}

			result.data.forEach(article => {
				const articleCard = document.createElement('div');
				articleCard.classList.add('article-card');

				// Extract text content from rich text structure
				let textContent = '';
				if (article.content && Array.isArray(article.content)) {
					article.content.forEach(paragraph => {
						if (paragraph.children && Array.isArray(paragraph.children)) {
							paragraph.children.forEach(child => {
								if (child.text) {
									textContent += child.text + ' ';
								}
							});
						}
					});
				}

				// Truncate content for preview
				const previewText =
					textContent.substring(0, 150) +
					(textContent.length > 150 ? '...' : '');

				articleCard.innerHTML = `
                  <h3>${article.title}</h3>
                  <p>${previewText}</p>
                  <small>Published: ${new Date(
										article.publishedAt
									).toLocaleDateString()}</small>
                  <small>ID: ${article.id}</small>
                  <a href="#">Read More</a>
              `;
				articlesContainer.appendChild(articleCard);
			});
		} catch (error) {
			console.error('Failed to fetch articles:', error);
			articlesContainer.innerHTML = `<p style="color: red;">Error loading articles: ${error.message}. Make sure NestJS backend is running and connected to Strapi.</p>`;
		}
	}

	fetchArticles();
});
