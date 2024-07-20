import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = new URL(request.url);
  const quote = url.searchParams.get('quote');
  const lang = url.searchParams.get('lang');
  const image = url.searchParams.get('image');

  if (quote && lang && image) {
    const response = NextResponse.next();
    const html = response.text();

    const updatedHtml = html
      .replace(/<meta property="og:title".*?>/g, `<meta property="og:title" content="${lang} Proverb - ${quote}">`)
      .replace(/<meta property="og:description".*?>/g, `<meta property="og:description" content="${quote}">`)
      .replace(/<meta property="og:image".*?>/g, `<meta property="og:image" content="${image}">`)
      .replace(/<meta name="twitter:title".*?>/g, `<meta name="twitter:title" content="${lang} Proverb - ${quote}">`)
      .replace(/<meta name="twitter:description".*?>/g, `<meta name="twitter:description" content="${quote}">`)
      .replace(/<meta name="twitter:image".*?>/g, `<meta name="twitter:image" content="${image}">`);

    return new Response(updatedHtml, {
      status: response.status,
      headers: response.headers,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};