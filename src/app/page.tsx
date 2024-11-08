'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, OrbitControls } from "@react-three/drei"
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Github, Twitter, Mail, ExternalLink, Code, History } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { 
  SiReact, 
  SiNextdotjs, 
  SiFastify, 
  SiMongodb, 
  SiTailwindcss, 
  SiTypescript, 
  SiNodedotjs, 
  SiGraphql 
} from "react-icons/si"
import Link from 'next/link'
import Image from 'next/image'

function AnimatedStars() {
  const starsRef = useRef<any>()

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x -= delta / 20
      starsRef.current.rotation.y -= delta / 25
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

const SocialButton = ({ icon: Icon, href, label }: { icon: any, href: string, label: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Icon className="h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-secondary text-secondary-foreground">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const SkillIcon = ({ icon: Icon, name }: { icon: any, name: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-secondary text-secondary-foreground">
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

function Typewriter({ texts }: { texts: string[] }) {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typeSpeed = 100
    const deleteSpeed = 50
    const pauseDelay = 2000

    const timeout = setTimeout(() => {
      if (!isDeleting && currentIndex < texts[textIndex].length) {
        setCurrentText(prevText => prevText + texts[textIndex][currentIndex])
        setCurrentIndex(prevIndex => prevIndex + 1)
      } else if (isDeleting && currentIndex > 0) {
        setCurrentText(prevText => prevText.slice(0, -1))
        setCurrentIndex(prevIndex => prevIndex - 1)
      } else if (currentIndex === texts[textIndex].length) {
        setTimeout(() => setIsDeleting(true), pauseDelay)
      } else if (currentIndex === 0 && isDeleting) {
        setIsDeleting(false)
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentIndex, isDeleting, textIndex, texts])

  return (
    <span className="inline-flex items-center">
      {currentText}
      <AnimatePresence>
        <motion.span
          key="caret"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[3px] h-6 ml-1 bg-primary"
        />
      </AnimatePresence>
    </span>
  )
}

const skillIcons = [
  { name: "React", icon: SiReact, url: "https://reactjs.org/" },
  { name: "Next.js", icon: SiNextdotjs, url: "https://nextjs.org/" },
  { name: "Fastify", icon: SiFastify, url: "https://www.fastify.io/" },
  { name: "MongoDB", icon: SiMongodb, url: "https://www.mongodb.com/" },
  { name: "Tailwind CSS", icon: SiTailwindcss, url: "https://tailwindcss.com/" },
  { name: "TypeScript", icon: SiTypescript, url: "https://www.typescriptlang.org/" },
  { name: "Node.js", icon: SiNodedotjs, url: "https://nodejs.org/" },
  { name: "GraphQL", icon: SiGraphql, url: "https://graphql.org/" }
]

export default function MinimalistPortfolio() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const greetings = [
    "Hi! I'm Spoody",
    "¡Hola! Soy Spoody",
    "Bonjour ! Je suis Spoody",
    "Ciao! Sono Spoody",
    "こんにちは！Spoodyです",
    "Hallo! Ich bin Spoody"
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <AnimatedStars />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute top-4 right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/20"
                    asChild
                  >
                    <Link href="/legacy">
                      <History className="mr-2 h-4 w-4" />
                      Legacy Version
                    </Link>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-secondary text-secondary-foreground">
                <p>View the legacy version of the portfolio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src="https://cdn.discordapp.com/avatars/1260750149446013090/70d2ff6237503b4f171731a2db99f2fa.webp?size=128" alt="Spoody" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Typewriter texts={greetings} />
          </motion.h1>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-[600px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            A passionate developer crafting digital experiences with modern web technologies.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {skillIcons.map(({ name, icon, url }) => (
              <SkillIcon key={name} icon={icon} name={name} />
            ))}
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/20"
                asChild
              >
                <Link href="/projects">
                  View Projects <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/20"
                asChild
              >
                <a
                  href="https://github.com/yourusername/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code className="mr-2 h-4 w-4" />
                  Source Code
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex justify-center gap-2 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <SocialButton 
              icon={Github} 
              href="https://github.com/spooderman11" 
              label="GitHub Profile" 
            />
            <SocialButton 
              icon={Twitter} 
              href="https://x.com/therealspoody" 
              label="Twitter Profile" 
            />
            <SocialButton 
              icon={Mail} 
              href="mailto:michael@vynx.tech" 
              label="Send Email" 
            />
            <SocialButton 
              icon={FaDiscord} 
              href="https://discord.com/users/1260750149446013090" 
              label="Discord Profile" 
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}