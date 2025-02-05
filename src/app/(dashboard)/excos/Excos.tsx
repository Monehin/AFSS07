"use client";
import React from "react";
import { User, Clipboard, DollarSign, Megaphone } from "lucide-react";
import Image from "next/image";

const excos = [
  {
    role: "Coordinator",
    name: "Ini Usen",
    icon: <User size={40} className="text-blue-500" />,
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNxOXdwY2s0ZzYwb211bWk3cHEyODNpeWJvMmhqaDYwYTdiZWZhMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f4wKcybxIKZIJEWCut/giphy.gif",
  },
  {
    role: "Admin Secretary",
    name: "Bolu Salami",
    icon: <Clipboard size={40} className="text-pink-500" />,
    gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExanJ0bm4zZTAxcHppM3JrNDdlNHN1NTBvbGZ5Y3dpMHRwZDJxZ3I4biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vhizKXA3BvjeozRk8A/giphy.gif",
  },
  {
    role: "Treasurer",
    name: "Amaka Osueze",
    icon: <DollarSign size={40} className="text-green-500" />,
    gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHF4bGIyajV5c21hZ3N1MjIxZ3dtbGJ1aDZyczF5bGhrbzQzZWd0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2JeQO72XbrQk4wNdbp/giphy.gif",
  },
  {
    role: "Public Relations Officer",
    name: "Adedotun Somoye",
    icon: <Megaphone size={40} className="text-yellow-500" />,
    gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG9tbHllYmR0bTZ5b3FrbG5hcWIwYTYyZzQ0bzVkeHYwN3c5Y252MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2Y8Iq3xe121Ba3hUAM/giphy.gif",
  },
];

const ExcosDisplay = () => {
  return (
    <div className="min-h-screen bg-gradient-to-rpy-12 px-4">
      <h2 className="text-2xl font-extrabold text-center m-8">
        AFSS07 2025 Excos
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {excos.map((exco, index) => (
          <div
            key={index}
            className="exco-card rounded-xl shadow p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            // Stagger each card's animation by increasing delay
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="mb-4">{exco.icon}</div>
            <div className="mb-4">
              <Image
                height={200}
                width={200}
                src={exco.gif}
                alt={`${exco.role} GIF`}
                className="w-48 h-48 object-cover rounded-md cursor-pointer filter grayscale hover:filter-none"
              />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-black-500">
              {exco.role}
            </h3>
            <p className="text-xl font-bold text-black-200">{exco.name}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .exco-card {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ExcosDisplay;
