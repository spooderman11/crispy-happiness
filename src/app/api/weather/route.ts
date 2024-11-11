import { NextResponse } from 'next/server'

const API_KEY = process.env.OPENWEATHERMAP_API_KEY
const CITY = 'London' // You can change this to any city you want

export async function GET() {
  if (!API_KEY) {
    console.error('OPENWEATHERMAP_API_KEY is not set')
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 })
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

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('Error in weather API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}