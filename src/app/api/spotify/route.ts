import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

async function getNowPlaying() {
  const { access_token } = await getAccessToken()

  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  })
}

async function getRecentlyPlayed() {
  const { access_token } = await getAccessToken()

  return fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  })
}

export async function GET() {
  try {
    // First try to get currently playing
    const response = await getNowPlaying()

    // If there's nothing playing (204) or error, try to get recently played
    if (response.status === 204 || response.status > 400) {
      const recentlyPlayed = await getRecentlyPlayed()
      const recentData = await recentlyPlayed.json()
      
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
    }

    // Handle currently playing
    const song = await response.json()

    if (!song?.item) {
      return NextResponse.json({ isPlaying: false })
    }

    const isPlaying = song.is_playing
    const title = song.item.name
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ')
    const album = song.item.album.name
    const albumImageUrl = song.item.album.images[0].url
    const songUrl = song.item.external_urls.spotify

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error in Spotify API route:', error)
    return NextResponse.json(
      { isPlaying: false, error: 'Failed to fetch Spotify data' },
      { status: 500 }
    )
  }
}