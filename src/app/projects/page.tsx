'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, OrbitControls } from "@react-three/drei"
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info, ExternalLink } from "lucide-react"
import { SiReact, SiNodedotjs, SiFastify } from "react-icons/si"
import Link from 'next/link'

function useDarkMode() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])
}

function AnimatedStars() {
  const starsRef = useRef<any>()

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x -= delta / 10
      starsRef.current.rotation.y -= delta / 15
    }
  })

  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  )
}

const projects = [
  {
    title: "Renderize.app",
    description: "Convert images to text with AI - a powerful tool for extracting text from images using advanced AI technology.",
    technologies: [
      { name: "React", icon: SiReact },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Fastify", icon: SiFastify }
    ],
    live: "https://renderize.app",
    details: `
      <h2>Renderize.app: AI-Powered Image to Text Conversion</h2>
      <p>Renderize.app is an innovative web application that leverages artificial intelligence to convert images into text with high accuracy. This tool is perfect for extracting text from screenshots, documents, or any image containing text.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Advanced AI text recognition</li>
        <li>Support for multiple image formats</li>
        <li>Fast and accurate text extraction</li>
        <li>User-friendly interface</li>
      </ul>
      <h3>Technical Implementation:</h3>
      <p>Built with a modern tech stack including React for the frontend, Node.js and Fastify for the backend, the application provides a seamless and efficient user experience. The AI integration ensures accurate text extraction while maintaining fast processing times.</p>
      <h3>Future Plans:</h3>
      <p>We're continuously working on improving the AI model's accuracy and adding support for more languages and special use cases.</p>
    `
  },
  {
    title: "Atlas Reselling",
    description: "Learn the fundamentals of reselling with a comprehensive suite of utilities and learning materials.",
    technologies: [
      { name: "React", icon: SiReact },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Fastify", icon: SiFastify }
    ],
    live: "https://atlasreselling.lol",
    details: `
      <h2>Atlas Reselling: Complete Reselling Education Platform</h2>
      <p>Atlas Reselling is a comprehensive platform designed to teach the fundamentals of reselling through practical utilities and in-depth learning materials. The platform helps users understand and succeed in the reselling market.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Comprehensive learning materials</li>
        <li>Practical reselling utilities</li>
        <li>Market analysis tools</li>
        <li>Community features</li>
      </ul>
      <h3>Technical Implementation:</h3>
      <p>The platform is built using React for a responsive frontend, with Node.js and Fastify powering the backend. This architecture ensures smooth performance and scalability as the user base grows.</p>
      <h3>Future Plans:</h3>
      <p>We're working on expanding our educational content and adding more advanced tools for experienced resellers.</p>
    `
  },
  {
    title: "Vynx Solutions",
    description: "An organization focused on web development and AI applications, delivering cutting-edge solutions.",
    technologies: [
      { name: "React", icon: SiReact },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Fastify", icon: SiFastify }
    ],
    live: "https://vynx.tech",
    details: `
      <h2>Vynx Solutions: Web Development & AI Applications</h2>
      <p>Vynx Solutions is an innovative organization specializing in web development and AI applications. We focus on creating cutting-edge solutions that help businesses leverage modern technology effectively.</p>
      <h3>Key Features:</h3>
      <ul>
        <li>Custom web development solutions</li>
        <li>AI integration services</li>
        <li>Modern technology stack</li>
        <li>Scalable architecture</li>
      </ul>
      <h3>Technical Implementation:</h3>
      <p>Our projects are built using React for frontend development, Node.js for backend services, and Fastify for high-performance server implementations. This stack allows us to deliver fast, reliable, and scalable solutions.</p>
      <h3>Future Vision:</h3>
      <p>We're constantly exploring new technologies and methodologies to provide even better solutions for our clients.</p>
    `
  }
]

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 h-full flex flex-col border border-primary/20">
        <CardHeader className="flex-none">
          <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
          <CardDescription className="text-sm mt-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="flex items-center gap-1.5 px-3 py-1 text-sm bg-primary/20 text-primary"
              >
                <tech.icon className="w-4 h-4" />
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 bg-primary/20 text-primary hover:bg-primary/30">
                <Info className="mr-2 h-4 w-4" />
                Project Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] w-11/12">
              <DialogHeader>
                <DialogTitle>{project.title}</DialogTitle>
                <DialogDescription>Detailed information about the project</DialogDescription>
              </DialogHeader>
              <ScrollArea className="mt-4 h-[60vh] border rounded-md p-4">
                <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: project.details }} />
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" asChild className="flex-1 bg-primary/20 text-primary hover:bg-primary/30">
            <Link href={project.live} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function ProjectsPage() {
  useDarkMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <AnimatedStars />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">My Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild className="bg-primary/20 text-primary hover:bg-primary/30">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}