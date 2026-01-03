// GET /api/service-area/:slug - Returns single service area with FAQs, services
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const slug = context.params.slug as string;

  try {
    const area = await DB.prepare(`
      SELECT * FROM service_areas
      WHERE slug = ? AND is_published = 1
    `).bind(slug).first();

    if (!area) {
      return Response.json({ error: 'Service area not found' }, { status: 404 });
    }

    // Fetch related data in parallel
    const [faqs, services, testimonials, siteInfo] = await Promise.all([
      // FAQs for this service area
      DB.prepare(`
        SELECT question, answer FROM faqs
        WHERE service_area_id = ? AND is_published = 1
        ORDER BY sort_order
      `).bind(area.id).all(),

      // All services (to show "services available in this area")
      DB.prepare(`
        SELECT id, slug, title, short_description, icon FROM services
        WHERE is_published = 1
        ORDER BY sort_order
      `).all(),

      // Featured testimonials
      DB.prepare(`
        SELECT client_name, client_location, content, rating FROM testimonials
        WHERE is_published = 1 AND is_featured = 1
        ORDER BY sort_order
        LIMIT 3
      `).all(),

      // Site info for phone/CTA
      DB.prepare(`SELECT name, phone, email FROM site_info WHERE id = 1`).first(),
    ]);

    return Response.json({
      ...area,
      faqs: faqs.results,
      services: services.results,
      testimonials: testimonials.results,
      site: siteInfo,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching service area:', error);
    return Response.json({ error: 'Failed to fetch service area' }, { status: 500 });
  }
};
