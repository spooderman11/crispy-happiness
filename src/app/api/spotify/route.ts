import { NextResponse } from 'next/server'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

const getAccessToken = async () => {
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error('Missing Spotify credentials')
  }

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }).toString(),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error getting access token:', error)
    throw error
  }
}

const getNowPlaying = async () => {
  try {
    const { access_token } = await getAccessToken()

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok && response.status !== 204) {
      throw new Error(`Now playing request failed: ${response.status} ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error('Error getting now playing:', error)
    throw error
  }
}

export async function GET() {
  try {
    const response = await getNowPlaying()

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false })
    }

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

export const runtime = 'edge'