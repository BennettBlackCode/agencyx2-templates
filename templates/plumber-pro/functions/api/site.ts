// GET /api/site - Returns all site data for rendering
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;

  try {
    // Fetch all data in parallel
    const [
      siteInfo,
      services,
      serviceAreas,
      testimonials,
      globalFaqs,
      tokens,
      globalContent,
      pages,
      team
    ] = await Promise.all([
      DB.prepare('SELECT * FROM site_info WHERE id = 1').first(),
      DB.prepare('SELECT * FROM services WHERE is_published = 1 ORDER BY sort_order').all(),
      DB.prepare('SELECT * FROM service_areas WHERE is_published = 1 ORDER BY sort_order').all(),
      DB.prepare('SELECT * FROM testimonials WHERE is_published = 1 ORDER BY sort_order').all(),
      DB.prepare('SELECT * FROM faqs WHERE is_published = 1 AND page_slug IS NULL ORDER BY sort_order').all(),
      DB.prepare('SELECT * FROM tokens WHERE id = 1').first(),
      DB.prepare('SELECT key, value FROM global_content').all(),
      DB.prepare('SELECT slug, title, nav_label, show_in_nav, sort_order FROM pages WHERE is_published = 1 AND show_in_nav = 1 ORDER BY sort_order').all(),
      DB.prepare('SELECT * FROM team WHERE is_published = 1 ORDER BY sort_order').all(),
    ]);

    // Convert global_content array to object for easy access
    const content: Record<string, string> = {};
    for (const row of globalContent.results) {
      content[row.key as string] = row.value as string;
    }

    return Response.json({
      site: siteInfo,
      services: services.results,
      serviceAreas: serviceAreas.results,
      testimonials: testimonials.results,
      faqs: globalFaqs.results,
      tokens,
      content,
      pages: pages.results,
      team: team.results,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching site data:', error);
    return Response.json({ error: 'Failed to fetch site data' }, { status: 500 });
  }
};
