// GET /api/services - Returns all services
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;

  try {
    const services = await DB.prepare(`
      SELECT * FROM services
      WHERE is_published = 1
      ORDER BY sort_order
    `).all();

    return Response.json(services.results, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
};
