// GET /api/service/:slug - Returns single service with FAQs, testimonials, images
interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const slug = context.params.slug as string;

  try {
    const service = await DB.prepare(`
      SELECT * FROM services
      WHERE slug = ? AND is_published = 1
    `).bind(slug).first();

    if (!service) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    // Fetch related data in parallel
    const [faqs, testimonials, heroImage, contentImage, siteInfo] = await Promise.all([
      // FAQs for this service
      DB.prepare(`
        SELECT question, answer FROM faqs
        WHERE service_id = ? AND is_published = 1
        ORDER BY sort_order
      `).bind(service.id).all(),

      // Testimonials for this service (or general ones if none specific)
      DB.prepare(`
        SELECT client_name, client_location, content, rating FROM testimonials
        WHERE (service_id = ? OR service_id IS NULL) AND is_published = 1
        ORDER BY service_id DESC, sort_order
        LIMIT 3
      `).bind(service.id).all(),

      // Hero image for this service
      DB.prepare(`
        SELECT url, alt_text FROM media WHERE slug = ?
      `).bind(`service-hero-${slug}`).first(),

      // Content image for this service
      DB.prepare(`
        SELECT url, alt_text FROM media WHERE slug = ?
      `).bind(`service-content-${slug}`).first(),

      // Site info for phone/CTA
      DB.prepare(`SELECT name, phone, email FROM site_info WHERE id = 1`).first(),
    ]);

    return Response.json({
      ...service,
      faqs: faqs.results,
      testimonials: testimonials.results,
      heroImage,
      contentImage,
      site: siteInfo,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return Response.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
};
