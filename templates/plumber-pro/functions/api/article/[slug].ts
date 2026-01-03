// GET /api/article/:slug - Get article by slug (public)
interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const slug = context.params.slug as string;

  try {
    const article = await DB.prepare(
      'SELECT * FROM articles WHERE slug = ? AND is_published = 1'
    )
      .bind(slug)
      .first();

    if (!article) {
      return Response.json({ error: 'Article not found' }, { status: 404 });
    }

    // Get site info for the page
    const site = await DB.prepare('SELECT * FROM site_info WHERE id = 1').first();

    return Response.json(
      { ...article, site },
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    return Response.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
