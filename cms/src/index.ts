import type { Core } from '@strapi/strapi';

export default {
	/**
	 * An asynchronous register function that runs before
	 * your application is initialized.
	 *
	 * This gives you an opportunity to extend code.
	 */
	register(/* { strapi }: { strapi: Core.Strapi } */) {},

	/**
	 * An asynchronous bootstrap function that runs before
	 * your application gets started.
	 *
	 * This gives you an opportunity to set up your data model,
	 * run jobs, or perform some special logic.
	 */
	async bootstrap({ strapi }: { strapi: Core.Strapi }) {
		// Check if any articles exist
		const articles = await strapi.entityService.findMany(
			'api::article.article'
		);

		// If no articles exist, create the default article
		if (!articles || articles.length === 0) {
			await strapi.entityService.create('api::article.article', {
				data: {
					title: 'First Article',
					content: [
						{
							type: 'paragraph',
							children: [
								{
									text: 'Some random text for the first article',
									type: 'text',
								},
							],
						},
					],
					publishedAt: new Date('2025-07-12T18:30:48.519Z'),
				},
			});

			console.log('✅ Default article created successfully!');
		}
	},
};
