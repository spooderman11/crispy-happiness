import { NextResponse } from 'next/server'

const API_KEY = process.env.OPENWEATHERMAP_API_KEY
const CITY = 'Helsinki' // You can change this to any city you want

export async function GET() {
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

    return NextResponse.json(weatherData, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    console.error('Error in weather API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}