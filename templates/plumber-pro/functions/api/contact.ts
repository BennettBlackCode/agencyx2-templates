// POST /api/contact - Submit contact form
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (context.request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await context.request.json() as {
      name: string;
      email: string;
      phone?: string;
      message?: string;
      source_page?: string;
    };

    // Basic validation
    if (!body.name || !body.email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Insert submission
    await DB.prepare(`
      INSERT INTO contact_submissions (name, email, phone, message, source_page)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      body.name,
      body.email,
      body.phone || null,
      body.message || null,
      body.source_page || null
    ).run();

    return Response.json({ success: true, message: 'Thank you! We will contact you soon.' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return Response.json({ error: 'Failed to submit form' }, { status: 500 });
  }
};
