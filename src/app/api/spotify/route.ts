import { NextResponse } from 'next/server'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token || '',
    }).toString(),
  })

  return response.json()
}

const getNowPlaying = async () => {
  const { access_token } = await getAccessToken()

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  })
}

export async function GET() {
  const response = await getNowPlaying()

  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ isPlaying: false }, { status: 200 })
  }

  const song = await response.json()

  if (!song || !song.item) {
    return NextResponse.json({ isPlaying: false }, { status: 200 })
  }

  const isPlaying = song.is_playing
  const title = song.item.name
  const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ')
  const album = song.item.album.name
  const albumImageUrl = song.item.album.images[0].url
  const songUrl = song.item.external_urls.spotif


  return NextResponse.json({
    isPlaying,
    title,
    artist,
    album,
    albumImageUrl,
    songUrl,
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}

export const runtime = 'edge'