"use client"; 

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import EffectSlicer from "./effect-slicer/effect-slicer.esm";

import "swiper/css";
import "swiper/css/navigation";
import "./effect-slicer/effect-slicer.css";
import "./custom.css";

export default function SlicerSwiper() {
  const slides = [
    { img: "/images/swiper1.jpg", title: "Navigating the Unknown", text: "A journey of adventure begins, learning to find the way through the great outdoors." },
    { img: "/images/swiper2.jpg", title: "Campfire Stories & Friendship", text: "Under the starry sky, stories are shared, friendships are built, and memories last a lifetime." },
    { img: "/images/swiper3.jpg", title: "Exploring Nature’s Wonders", text: "From towering trees to flowing rivers, every step is a lesson in resilience and discovery." },
    { img: "/images/swiper4.jpg", title: "Finding the Path Forward", text: "With a map in hand and a goal in mind, every challenge becomes an opportunity to grow." },
    { img: "/images/swiper5.jpg", title: "Stronger Together", text: "Teamwork, problem-solving, and leadership come to life through every new experience." }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="app relative">
      <Swiper
        modules={[Navigation, EffectSlicer, Autoplay]}
        effect="slicer"
        direction="horizontal"
        speed={400}
        grabCursor={true}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="swiper-slicer"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            <img className="swiper-slicer-image" src={slide.img} alt={`Slide ${index + 1}`} />
            <div className={`absolute left-10 top-1/2 -translate-y-1/2 text-white max-w-md transition-opacity duration-2000 ${activeIndex === index ? "opacity-100" : "opacity-0"}`}>
              <h2 className="text-3xl font-bold">{slide.title}</h2>
              <p className="mt-2 text-lg">{slide.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
