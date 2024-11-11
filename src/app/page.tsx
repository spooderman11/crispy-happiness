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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  X, Github, Twitter, Mail, ExternalLink, Code, History, Globe, Music,
  Maximize2, Minimize2
} from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import {
  SiReact,
  SiNextdotjs,
  SiFastify,
  SiMongodb,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiGraphql,
  SiJavascript,
  SiPython,
  SiDocker,
  SiGit,
  SiRedux,
  SiSass,
  SiPostgresql,
  SiOracle,
} from "react-icons/si"
import Link from 'next/link'
import Image from 'next/image'

// Move AnimatedStars component definition to the top
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
              <span className="sr-only">{label}</span>
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
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10"
        >
          <Icon className="h-6 w-6 text-primary" />
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
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Fastify", icon: SiFastify },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "GraphQL", icon: SiGraphql },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Python", icon: SiPython },
  { name: "Docker", icon: SiDocker },
  { name: "Git", icon: SiGit },
  { name: "Oracle", icon: SiOracle },
  { name: "Redux", icon: SiRedux },
  { name: "Sass", icon: SiSass },
  { name: "PostgreSQL", icon: SiPostgresql }
]

function NowPlaying() {
  const [trackInfo, setTrackInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const prevDataRef = useRef<any>(null)

  const fetchTrackInfo = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/spotify', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log('Spotify API response:', data)

      if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
        setTrackInfo(data)
        prevDataRef.current = data
      }
    } catch (error) {
      console.error('Error fetching Spotify data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      if (!mounted) return
      await fetchTrackInfo()
    }

    fetchData()
    const interval = setInterval(fetchData, 15000) // Poll every 15 seconds

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  if (error) {
    console.error('NowPlaying error:', error)
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="spotify-card-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="fixed bottom-4 left-4 flex flex-col items-start"
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="absolute -top-2 -right-2 w-6 h-6 p-1 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-full hover:bg-background/50 z-10 shadow-sm"
              aria-label="Close Spotify player"
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg p-2 flex items-start space-x-4 overflow-hidden w-[300px]">
              <div className="flex-shrink-0 w-14 h-14 relative">
                <Image
                  src={trackInfo?.albumImageUrl || "https://cdn.vynx.tech/static/placeholder.svg"}
                  alt={trackInfo?.album || "Album placeholder"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md align-middle"
                />
              </div>
              <div className="flex flex-col items-start overflow-hidden flex-grow pt-1">
                <a
                  href={trackInfo?.songUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:underline text-left line-clamp-1"
                >
                  {trackInfo?.title || "Not listening to anything"}
                </a>
                <p className="text-xs text-muted-foreground text-left line-clamp-1">
                  {trackInfo?.artist || "No artist"}
                </p>
                <div className="flex items-center mt-1">
                  <Music className={`w-4 h-4 mr-1 ${trackInfo?.isPlaying ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {isLoading ? 'Updating...' : 
                     trackInfo?.isPlaying ? 'Now playing on Spotify' : 
                     'Not listening to anything'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}



export default function MinimalistPortfolio() {
  const [language, setLanguage] = useState<'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'pt' | 'ru' | 'zh'>('en')

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const translations = {
    en: {
      greeting: "Hi! I'm Spoody",
      description: "A passionate developer crafting digital experiences with modern web technologies. Proudly supported by my amazing girlfriend.",
      viewProjects: "View Projects",
      sourceCode: "Source Code",
      legacyVersion: "Legacy Version",
      skills: "Skills",
    },
    es: {
      greeting: "¡Hola! Soy Spoody",
      description: "Un desarrollador apasionado creando experiencias digitales con tecnologías web modernas. Orgullosamente apoyado por mi increíble novia.",
      viewProjects: "Ver Proyectos",
      sourceCode: "Código Fuente",
      legacyVersion: "Versión Anterior",
      skills: "Habilidades",
    },
    fr: {
      greeting: "Bonjour ! Je suis Spoody",
      description: "Un développeur passionné créant des expériences numériques avec des technologies web modernes. Fièrement soutenu par ma merveilleuse petite amie.",
      viewProjects: "Voir les Projets",
      sourceCode: "Code Source",
      legacyVersion: "Version Précédente",
      skills: "Compétences",
    },
    de: {
      greeting: "Hallo! Ich bin Spoody",
      description: "Ein leidenschaftlicher Entwickler, der digitale Erlebnisse mit modernen Webtechnologien gestaltet. Stolz unterstützt von meiner unglaublichen Freundin.",
      viewProjects: "Projekte ansehen",
      sourceCode: "Quellcode",
      legacyVersion: "Ältere Version",
      skills: "Fähigkeiten",
    },
    it: {
      greeting: "Ciao! Sono Spoody",
      description: "Uno sviluppatore appassionato che crea esperienze digitali con tecnologie web moderne. Orgogliosamente supportato dalla mia fantastica ragazza.",
      viewProjects: "Visualizza Progetti",
      sourceCode: "Codice Sorgente",
      legacyVersion: "Versione Precedente",
      skills: "Competenze",
    },
    ja: {
      greeting: "こんにちは！Spoodyです",
      description: "最新のWeb技術でデジタル体験を作り出す情熱的な開発者です。素晴らしい彼女に支えられています。",
      viewProjects: "プロジェクトを見る",
      sourceCode: "ソースコード",
      legacyVersion: "旧バージョン",
      skills: "スキル",
    },
    ko: {
      greeting: "안녕하세요! 저는 Spoody입니다",
      description: "현대적인 웹 기술로 디지털 경험을 만드는 열정적인 개발자입니다. 멋진 여자친구의 지원을 받고 있습니다.",
      viewProjects: "프로젝트 보기",
      sourceCode: "소스 코드",
      legacyVersion: "이전 버전",
      skills: "기술",
    },
    pt: {
      greeting: "Olá! Eu sou Spoody",
      description: "Um desenvolvedor apaixonado criando experiências digitais com tecnologias web modernas. Orgulhosamente apoiado pela minha incrível namorada.",
      viewProjects: "Ver Projetos",
      sourceCode: "Código Fonte",
      legacyVersion: "Versão Anterior",
      skills: "Habilidades",
    },
    ru: {
      greeting: "Привет! Я Spoody",
      description: "Увлеченный разработчик, создающий цифровые впечатления с помощью современных веб-технологий. С гордостью поддерживаемый моей потрясающей девушкой.",
      viewProjects: "Посмотреть проекты",
      sourceCode: "Исходный код",
      legacyVersion: "Предыдущая версия",
      skills: "Навыки",
    },
    zh: {
      greeting: "你好！我是Spoody",
      description: "一位热衷于使用现代网络技术创造数字体验的开发者。我得到了我令人惊叹的女朋友的大力支持。",
      viewProjects: "查看项目",
      sourceCode: "源代码",
      legacyVersion: "旧版本",
      skills: "技能",
    },
  }

  const t = (key: keyof typeof translations.en) => translations[language][key]

  const greetings = [
    t('greeting'),
    "¡Hola! Soy Spoody",
    "Bonjour ! Je suis Spoody",
    "Ciao! Sono Spoody",
    "こんにちは！Spoodyです",
    "Hallo! Ich bin Spoody",
    "Привет! Я Spoody",
    "你好！我是Spoody",
    "Olá! Eu sou Spoody",
    "안녕하세요! 저는 Spoody입니다"
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <AnimatedStars />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between max-w-6xl mx-auto">
          <Select value={language} onValueChange={(value: typeof language) => setLanguage(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="it">Italiano</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-4">
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
                        {t('legacyVersion')}
                      </Link>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-secondary text-secondary-foreground">
                  <p>{t('legacyVersion')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
            {t('description')}
          </motion.p>

          <motion.div
            className="space-y-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-foreground">{t('skills')}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {skillIcons.map(({ name, icon }) => (
                <SkillIcon key={name} icon={icon} name={name} />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 w-full"
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
                  {t('viewProjects')} <ExternalLink className="ml-2 h-4 w-4" />
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
                  href="https://github.com/spooderman11/crispy-happiness"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code className="mr-2 h-4 w-4" />
                  {t('sourceCode')}
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center gap-4 pt-8 w-full"
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
              label="Email"
            />
            <SocialButton
              icon={FaDiscord}
              href="https://discord.com/users/1260750149446013090"
              label="Discord Profile"
            />
          </motion.div>
        </motion.div>
        <NowPlaying />
      </div>
    </div>
  )
}