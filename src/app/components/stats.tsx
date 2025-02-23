"use client";

import { useState, useEffect, useRef } from "react";

export default function ParallaxStats() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  const stats = [
    { label: "Contributions", value: 1250 },
    { label: "Contributors", value: 340 },
    { label: "Unique Locations Mapped", value: 58 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={statsRef} className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('/images/lebanonovermap.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Stats Content */}
      <div className="relative z-10 text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 bg-white/10 rounded-xl shadow-lg backdrop-blur-md"
            >
              <h3 className="text-3xl font-bold">
                <CountUp target={stat.value} isVisible={isVisible} />
              </h3>
              <p className="text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// CountUp component to animate the numbers
function CountUp({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 30);

    const interval = setInterval(() => {
      start += increment;
      setCount(Math.min(Math.floor(start), target));

      if (start >= target) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible, target]);

  return <>{count}+</>;
}
