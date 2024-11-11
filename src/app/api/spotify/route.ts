import { NextResponse } from 'next/server'

const SPOTIFY_NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const SPOTIFY_RECENT_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played'
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

async function getRecentlyPlayed(accessToken: string) {
  return fetch(`${SPOTIFY_RECENT_TRACKS_ENDPOINT}?limit=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken()

    // Try to get currently playing track
    const nowPlayingResponse = await getNowPlaying(access_token)

    // If there's a currently playing track
    if (nowPlayingResponse.status === 200) {
      const song = await nowPlayingResponse.json()
      
      // If not actually playing, get recently played
      if (!song.is_playing) {
        const recentlyPlayedResponse = await getRecentlyPlayed(access_token)
        const recentlyPlayed = await recentlyPlayedResponse.json()
        
        if (recentlyPlayed.items?.length > 0) {
          const mostRecent = recentlyPlayed.items[0]
          return NextResponse.json({
            isPlaying: false,
            title: mostRecent.track.name,
            artist: mostRecent.track.artists.map((_artist: any) => _artist.name).join(', '),
            album: mostRecent.track.album.name,
            albumImageUrl: mostRecent.track.album.images[0].url,
            songUrl: mostRecent.track.external_urls.spotify,
            lastPlayed: mostRecent.played_at
          }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
        }
      }
      
      // Return currently playing song
      return NextResponse.json({
        isPlaying: song.is_playing,
        title: song.item.name,
        artist: song.item.artists.map((_artist: any) => _artist.name).join(', '),
        album: song.item.album.name,
        albumImageUrl: song.item.album.images[0].url,
        songUrl: song.item.external_urls.spotify
      }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

    // If no track is playing, get recently played
    const recentlyPlayedResponse = await getRecentlyPlayed(access_token)
    const recentlyPlayed = await recentlyPlayedResponse.json()

    if (!recentlyPlayed.items?.length) {
      return NextResponse.json({ 
        isPlaying: false 
      }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

    const mostRecent = recentlyPlayed.items[0]
    return NextResponse.json({
      isPlaying: false,
      title: mostRecent.track.name,
      artist: mostRecent.track.artists.map((_artist: any) => _artist.name).join(', '),
      album: mostRecent.track.album.name,
      albumImageUrl: mostRecent.track.album.images[0].url,
      songUrl: mostRecent.track.external_urls.spotify,
      lastPlayed: mostRecent.played_at
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })

  } catch (error) {
    console.error('Error in Spotify API route:', error)
    return NextResponse.json(
      { isPlaying: false, error: 'Failed to fetch Spotify data' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}