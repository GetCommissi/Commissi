import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/
Disallow: /admin/
Disallow: /leads/
Disallow: /offers/
Disallow: /orders/
Disallow: /team/
Disallow: /reports/
Disallow: /commission/
Disallow: /incentives/
Disallow: /call-center/
Disallow: /appointments/
Disallow: /calculator/

Sitemap: https://commissi.vercel.app/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
