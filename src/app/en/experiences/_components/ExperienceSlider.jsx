// @/app/en/experiences/_components/ExperienceSlider.jsx

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import styles from "../experiences.module.scss";

export default function ExperienceSlider({ images = [] }) {
  const displayImages = images.slice(0, 15);

  if (displayImages.length === 0) {
    return null;
  }

  return (
    <div className={styles.experienceSlider}>
      <Swiper
        modules={[Pagination, Autoplay, EffectFade, Navigation]}
        slidesPerView={1}
        loop={displayImages.length > 1}
        effect="fade"
        speed={1200}
        navigation={displayImages.length > 1}
        pagination ={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
      >
      {
        displayImages.map((image) => (
          <SwiperSlide key={image.src}>
          <div className={styles.slideImage}>
            <img src={image.src} alt={image.alt} />
          </div>
          </SwiperSlide>
        ))
      }
      </Swiper>
    </div>
  );
}

