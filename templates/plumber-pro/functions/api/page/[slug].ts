// GET /api/page/:slug - Returns a specific page with its FAQs
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const slug = context.params.slug as string;

  try {
    const [page, faqs, site] = await Promise.all([
      DB.prepare('SELECT * FROM pages WHERE slug = ? AND is_published = 1').bind(slug).first(),
      DB.prepare('SELECT * FROM faqs WHERE page_slug = ? AND is_published = 1 ORDER BY sort_order').bind(slug).all(),
      DB.prepare('SELECT name, phone, email FROM site_info WHERE id = 1').first(),
    ]);

    if (!page) {
      return Response.json({ error: 'Page not found' }, { status: 404 });
    }

    return Response.json({
      ...page,
      faqs: faqs.results,
      site,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return Response.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
};
