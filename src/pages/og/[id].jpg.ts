/**
 * OG-Bild pro Fallstudie: Hero-Screenshot, zur Build-Zeit auf 1200x630
 * zugeschnitten (oben ausgerichtet).
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import path from 'node:path';

const quellen: Record<string, { datei: string; position: string }> = {
  odera: { datei: 'odera-start-desktop.webp', position: 'top' },
  musterprojekte: { datei: 'firstlicht-desktop.webp', position: 'top' },
  'geo-quiz': { datei: 'geo-quiz-desktop.webp', position: 'left top' },
  'morgen-check-in': { datei: 'health-dashboard-crop.webp', position: 'top' },
};

export const getStaticPaths: GetStaticPaths = () => Object.keys(quellen).map((id) => ({ params: { id } }));

export const GET: APIRoute = async ({ params }) => {
  const q = quellen[params.id as string];
  const datei = path.resolve(process.cwd(), 'src/assets/screens', q.datei);
  const jpg = await sharp(datei)
    .resize(1200, 630, { fit: 'cover', position: q.position })
    .flatten({ background: '#F2F2EF' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
