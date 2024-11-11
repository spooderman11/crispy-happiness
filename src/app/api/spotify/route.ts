import { NextResponse } from 'next/server'

const SPOTIFY_NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

async function getAccessToken() {
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || '',
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to get access token')
  }

  return response.json()
}

async function getNowPlaying(accessToken: string) {
  return fetch(SPOTIFY_NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken()

    const nowPlayingResponse = await getNowPlaying(access_token)

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status > 400) {
      return NextResponse.json({ isPlaying: false }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

    const song = await nowPlayingResponse.json()

    if (song.is_playing && song.item) {
      return NextResponse.json({
        isPlaying: true,
        title: song.item.name,
        artist: song.item.artists.map((_artist: any) => _artist.name).join(', '),
        album: song.item.album.name,
        albumImageUrl: song.item.album.images[0].url,
        songUrl: song.item.external_urls.spotify
      }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    } else {
      return NextResponse.json({ isPlaying: false }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

  } catch (error) {
    console.error('Error in Spotify API route:', error)
    return NextResponse.json(
      { isPlaying: false, error: 'Failed to fetch Spotify data' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}