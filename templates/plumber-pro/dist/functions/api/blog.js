// functions/api/blog.ts
var onRequest = async (context) => {
  const { DB } = context.env;
  try {
    const posts = await DB.prepare(`
      SELECT id, title, slug, excerpt, category, author, published_at
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC
    `).all();
    return Response.json(posts.results, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return Response.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
};
export {
  onRequest
};
