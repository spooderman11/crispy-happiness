import { NextResponse } from 'next/server'

async function getAccessToken() {
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
  const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
  
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || '',
    }),
  })

  return response.json()
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken()

    const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      const recentlyPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      const recentData = await recentlyPlayedResponse.json()
      
      if (recentData?.items?.[0]) {
        const track = recentData.items[0].track
        return NextResponse.json({
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((_artist: any) => _artist.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0].url,
          songUrl: track.external_urls.spotify,
          lastPlayed: recentData.items[0].played_at
        })
      }
    } else {
      const song = await nowPlayingResponse.json()

      if (song?.item) {
        return NextResponse.json({
          isPlaying: song.is_playing,
          title: song.item.name,
          artist: song.item.artists.map((_artist: any) => _artist.name).join(', '),
          album: song.item.album.name,
          albumImageUrl: song.item.album.images[0].url,
          songUrl: song.item.external_urls.spotify,
        })
      }
    }

    return NextResponse.json({ isPlaying: false })
  } catch (error) {
    console.error('Error in Spotify API route:', error)
    return NextResponse.json(
      { isPlaying: false, error: 'Failed to fetch Spotify data' },
      { status: 500 }
    )
  }
}