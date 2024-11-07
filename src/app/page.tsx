"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Twitter, Mail } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

function useDarkMode() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
}

function AnimatedStars() {
  const starsRef = useRef<any>();

  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x -= delta / 10;
      starsRef.current.rotation.y -= delta / 15;
    }
  });

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
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const socialButtonVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.9 },
};

const SocialButton = ({
  icon: Icon,
  href,
  color,
}: {
  icon: any;
  href: string;
  color: string;
}) => (
  <motion.div variants={socialButtonVariants} whileHover="hover" whileTap="tap">
    <Button
      variant="outline"
      size="icon"
      className={`bg-${color} hover:bg-${color}/80 text-white border-none`}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Icon className="h-5 w-5" />
      </a>
    </Button>
  </motion.div>
);

function Typewriter({ texts }: { texts: string[] }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = 30; // Faster typing speed
    const deleteSpeed = 15; // Faster deleting speed
    const pauseDelay = 2000; // Shorter pause between phrases

    const timeout = setTimeout(
      () => {
        if (!isDeleting && currentIndex < texts[textIndex].length) {
          setCurrentText(
            (prevText) => prevText + texts[textIndex][currentIndex]
          );
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else if (isDeleting && currentIndex > 0) {
          setCurrentText((prevText) => prevText.slice(0, -1));
          setCurrentIndex((prevIndex) => prevIndex - 1);
        } else if (currentIndex === texts[textIndex].length) {
          setTimeout(() => setIsDeleting(true), pauseDelay);
        } else if (currentIndex === 0 && isDeleting) {
          setIsDeleting(false);
          setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textIndex, texts]);

  return (
    <span className="inline-flex items-center">
      {currentText}
      <AnimatePresence>
        <motion.span
          key="caret"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="inline-block w-2 h-2 ml-1 bg-primary rounded-full"
        />
      </AnimatePresence>
    </span>
  );
}

export default function StarfieldPortfolio() {
  useDarkMode();

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <AnimatedStars />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Card className="w-full max-w-[800px] bg-background/60">
            <motion.div variants={itemVariants}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage
                    src="https://cdn.discordapp.com/avatars/1260750149446013090/70d2ff6237503b4f171731a2db99f2fa.webp?size=128"
                    alt="spoody"
                  />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl">Spoody</CardTitle>
                  <CardDescription className="text-xl">
                    <Typewriter
                      texts={[
                        "Web Developer",
                        "Full Stack Engineer",
                        "UI/UX Enthusiast",
                      ]}
                    />
                  </CardDescription>
                </div>
              </CardHeader>
            </motion.div>
            <Separator className="my-2" />
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 [&>*:nth-child(2)]:space-y-6">
              <motion.div className="space-y-4" variants={itemVariants}>
                <div>
                  <h3 className="font-semibold text-lg mb-2">About Me</h3>
                  <p className="text-sm text-muted-foreground">
                    I'm a passionate web developer focused on creating fast,
                    efficient, and visually engaging applications. With
                    expertise in both frontend and backend technologies, I
                    deliver seamless user experiences. My approach emphasizes
                    modularity and scalability, using Next.js, Fastify, and
                    MongoDB to craft responsive, high-performance platforms.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Skills</h3>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      "React",
                      "Next.js",
                      "Fastify",
                      "MongoDB",
                      "Tailwind CSS",
                      "TypeScript",
                      "Node.js",
                      "GraphQL",
                    ].map((skill) => (
                      <motion.div key={skill} variants={itemVariants}>
                        <Badge variant="secondary">{skill}</Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
              <motion.div className="space-y-4" variants={itemVariants}>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Experience</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>CEO at Atlas Reselling (2024-Present)</li>
                    <li>CEO at Vynx Solutions (2024-Present)</li>
                    <li>CEO at Astoris Chat (2024-Present)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Education</h3>
                  <p className="text-sm text-muted-foreground">
                    Specialized Vocational Training in Information Technology
                    and Software Development (2024-Present)
                  </p>
                </div>
              </motion.div>
            </CardContent>
            <Separator className="my-2" />
            <motion.div variants={itemVariants}>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
                <motion.div
                  className="flex space-x-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <SocialButton
                    icon={Github}
                    href="https://github.com/spooderman11"
                    color="gray-700"
                  />
                  <SocialButton
                    icon={Twitter}
                    href="https://x.com/therealspoody"
                    color="blue-400"
                  />
                  <SocialButton
                    icon={Mail}
                    href="mailto:michael@vynx.tech"
                    color="red-500"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://discord.com/users/1260750149446013090",
                        "_blank"
                      )
                    }
                    variant="outline"
                  >
                    <FaDiscord className="mr-2 h-4 w-4" /> Contact on Discord
                  </Button>
                </motion.div>
              </CardFooter>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
