import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom') || '18';
  const size = searchParams.get('size') || '640x640';
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  const API_KEY = 'AIzaSyCT5OBTtjWOVXy3a2_dH1yW-Dct-rds5PE';
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=satellite&key=${API_KEY}`;

  try {
    const response = await fetch(googleMapsUrl);
    
    if (!response.ok) {
      console.error('Google Maps API 오류:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Google Maps API 오류', 
        status: response.status,
        message: response.statusText 
      }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('위성사진 로드 오류:', error);
    return NextResponse.json({ error: '위성사진 로드 실패' }, { status: 500 });
  }
}
