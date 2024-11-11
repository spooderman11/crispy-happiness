'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Sun, CloudRain, Wind, X, RotateCw } from "lucide-react"
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
  const [cooldownTime, setCooldownTime] = useState(0)

  const fetchWeather = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/weather')
      if (!res.ok) {
        const data = await res.json()
        if (res.status === 429 && data.cooldown) {
          setCooldownTime(data.cooldown)
          throw new Error(`Rate limit exceeded. Try again in ${data.cooldown} seconds.`)
        }
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setWeatherData(data)
      setCooldownTime(30) // Reset cooldown timer on successful fetch
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

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldownTime])

  const handleRefresh = () => {
    if (cooldownTime === 0) {
      fetchWeather()
    }
  }

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case '01d':
      case '01n':
        return <Sun className="w-6 h-6 text-yellow-400" />
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud className="w-6 h-6 text-muted-foreground" />
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <CloudRain className="w-6 h-6 text-blue-400" />
      default:
        return <Wind className="w-6 h-6 text-muted-foreground" />
    }
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
            <div className="bg-black/90 backdrop-blur-sm border border-white/10 rounded-xl p-4 w-[180px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white/80">Weather</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isLoading || cooldownTime > 0}
                  className="w-8 h-8 hover:bg-white/10 relative"
                  aria-label="Refresh weather data"
                >
                  {cooldownTime > 0 ? (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/80">
                      {cooldownTime}
                    </span>
                  ) : (
                    <RotateCw className={`w-4 h-4 text-white/80 ${isLoading ? 'animate-spin' : ''}`} />
                  )}
                </Button>
              </div>
              {isLoading ? (
                <p className="text-sm text-white/60">Loading...</p>
              ) : error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : weatherData ? (
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl font-semibold text-white">
                      {weatherData.temperature}°C
                    </span>
                    {getWeatherIcon(weatherData.icon)}
                  </div>
                  <p className="text-sm text-white/60 capitalize">
                    {weatherData.description}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-white/60">No data available</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}