import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
  }

  const API_KEY = 'AIzaSyCT5OBTtjWOVXy3a2_dH1yW-Dct-rds5PE';
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}&region=kr&language=ko`;

  try {
    const response = await fetch(geocodeUrl);
    
    if (!response.ok) {
      console.error('Google Geocoding API 오류:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Google Geocoding API 오류', 
        status: response.status,
        message: response.statusText 
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      return NextResponse.json({
        success: true,
        address: result.formatted_address,
        lat: location.lat,
        lng: location.lng,
        place_id: result.place_id
      });
    } else {
      return NextResponse.json({ 
        error: '주소를 찾을 수 없습니다', 
        status: data.status 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Geocoding 오류:', error);
    return NextResponse.json({ error: 'Geocoding 실패' }, { status: 500 });
  }
}
