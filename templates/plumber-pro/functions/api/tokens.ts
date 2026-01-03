// GET /api/tokens - Returns theme tokens
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;

  try {
    const tokens = await DB.prepare(`SELECT * FROM tokens WHERE id = 1`).first();

    if (!tokens) {
      return Response.json({ error: 'Tokens not found' }, { status: 404 });
    }

    return Response.json(tokens, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return Response.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
};
