'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Sun, CloudRain, Wind, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type WeatherData = {
  temperature: number
  description: string
  icon: string
}

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  const fetchWeather = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/weather')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setWeatherData(data)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch weather data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 600000) // Update every 10 minutes
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case '01d':
      case '01n':
        return <Sun className="w-8 h-8 text-yellow-400" />
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud className="w-8 h-8 text-gray-400" />
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <CloudRain className="w-8 h-8 text-blue-400" />
      default:
        return <Wind className="w-8 h-8 text-gray-600" />
    }
  }

  if (error) {
    console.error('Weather widget error:', error)
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="weather-widget-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="fixed top-4 right-4 flex flex-col items-end"
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="absolute -top-2 -right-2 w-6 h-6 p-1 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full hover:bg-background/50 z-10 shadow-sm"
              aria-label="Close weather widget"
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg p-4 w-[200px]">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                Weather
                {weatherData && getWeatherIcon(weatherData.icon)}
              </h3>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading weather data...</p>
              ) : weatherData ? (
                <div>
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                  <p className="text-sm text-muted-foreground capitalize">{weatherData.description}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No weather data available</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}