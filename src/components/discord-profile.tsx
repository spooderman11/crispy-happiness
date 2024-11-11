"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Music, Gamepad, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  banner: string | null;
  banner_color: string | null;
  accent_color: number | null;
  presence: {
    status: "online" | "idle" | "dnd" | "offline";
    activities: Array<{
      name: string;
      type: number;
      created_at: number;
      details?: string;
      state?: string;
      assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
      };
    }>;
  };
}

export default function DiscordProfile({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<DiscordProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/discord?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Discord profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError("Error fetching Discord profile");
        console.error(err);
      }
    };

    fetchProfile();
    const interval = setInterval(fetchProfile, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [userId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="text-gray-500">Loading Discord profile...</div>;
  }

  const getActivityIcon = (type: number) => {
    switch (type) {
      case 0:
        return <Gamepad className="w-4 h-4 mr-2" />;
      case 2:
        return <Music className="w-4 h-4 mr-2" />;
      default:
        return <Clock className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg p-4 max-w-sm mx-auto text-white"
    >
      <div className="flex items-center mb-4">
        <Image
          src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`}
          alt={profile.username}
          width={64}
          height={64}
          className="rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-gray-400">
            @{profile.username}#{profile.discriminator}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div
          className={`w-3 h-3 rounded-full inline-block mr-2 ${
            profile.presence.status === "online"
              ? "bg-green-500"
              : profile.presence.status === "idle"
              ? "bg-yellow-500"
              : profile.presence.status === "dnd"
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        ></div>
        <span className="capitalize">{profile.presence.status}</span>
      </div>
      {profile.presence.activities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Activity</h3>
          {profile.presence.activities.map((activity, index) => (
            <div key={index} className="flex items-center mb-2">
              {getActivityIcon(activity.type)}
              <span>{activity.name}</span>
              {activity.details && (
                <span className="ml-2 text-gray-400">{activity.details}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
