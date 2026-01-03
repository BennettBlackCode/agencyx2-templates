// GET /api/media/* - Serve media files from R2
interface Env {
  STORAGE: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { STORAGE } = context.env;

  // Get the path from params (could be array or string)
  const pathParam = context.params.path;
  const path = Array.isArray(pathParam) ? pathParam.join('/') : pathParam;

  if (!path) {
    return new Response('Not found', { status: 404 });
  }

  const key = `images/${path}`;

  try {
    const object = await STORAGE.get(key);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    headers.set('Access-Control-Allow-Origin', '*');

    // Add etag for caching
    if (object.etag) {
      headers.set('ETag', object.etag);
    }

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Error serving media:', error);
    return new Response('Error serving file', { status: 500 });
  }
};
