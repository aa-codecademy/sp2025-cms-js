document.addEventListener('DOMContentLoaded', () => {
	const articlesContainer = document.getElementById('articles-container');
	const BACKEND_URL = 'http://localhost:3000/api'; // Your NestJS backend URL

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
