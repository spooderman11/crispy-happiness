import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const API_KEY = process.env.OPENWEATHERMAP_API_KEY
const CITY = 'Helsinki' // You can change this to any city you want
const COOLDOWN_SECONDS = 30

// In-memory store for cooldowns. In a production app, use a database or Redis.
const cooldowns = new Map<string, number>()

export async function GET(request: Request) {
  if (!API_KEY) {
    console.error('OPENWEATHERMAP_API_KEY is not set')
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 })
  }

  const headersList = headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const now = Date.now()

  // Check if the user is on cooldown
  const lastRequestTime = cooldowns.get(ip)
  if (lastRequestTime && now - lastRequestTime < COOLDOWN_SECONDS * 1000) {
    const remainingCooldown = Math.ceil((COOLDOWN_SECONDS * 1000 - (now - lastRequestTime)) / 1000)
    return NextResponse.json({ error: 'Rate limit exceeded', cooldown: remainingCooldown }, { status: 429 })
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`)
    
    if (!res.ok) {
      throw new Error(`Weather API responded with status ${res.status}`)
    }

    const data = await res.json()

    const weatherData = {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    }

    // Update the cooldown for this user
    cooldowns.set(ip, now)

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Error in weather API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}