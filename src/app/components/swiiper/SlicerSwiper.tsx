"use client"; 

import { Navigation , EffectFade} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import EffectSlicer from './effect-slicer/effect-slicer.esm';

import 'swiper/css';
import 'swiper/css/navigation';
import './effect-slicer/effect-slicer.css';

import './custom.css'

export default function SlicerSwiper() {
  return (
    <div className='app'>
      <Swiper
        modules={[Navigation, EffectSlicer ,EffectFade ]}
        effect='slicer'
        direction='horizontal'
        speed={600}
        grabCursor={true}
        navigation= {true}
        autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        className='swiper-slicer'
      >
        <SwiperSlide>
          <img  src="/images/02.jpg" alt="Slide 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img  src="/images/01.jpg" alt="Slide 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img  src="/images/02.jpg" alt="Slide 3" />
        </SwiperSlide>
        <SwiperSlide>
          <img  src="/images/01.jpg" alt="Slide 4" />
        </SwiperSlide>
        <SwiperSlide>
          <img  src="/images/02.jpg" alt="Slide 5" />
        </SwiperSlide>
      </Swiper>

      {/* Text below the carousel */}
      <div className="text-center text-white py-4">
        <h2 className="text-2xl font-bold">Welcome to Our Carousel</h2>
        <p className="test">This is a test text to check if the carousel loads properly.</p>
      </div>
    </div>
  );
}
