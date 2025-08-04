"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import { Quote } from 'lucide-react';

const testimonials2 = [
  {
    message: "Hardik's work is outstanding. He provided exactly what we needed and delivered ahead of schedule. Truly impressed by his dedication.",
    name: "Darren",
    title: "Allure Firm",
    image: "testimonials/Allure_Firm_logo.png", 
  },  
  {
    message: "Hardik consistently delivers top-notch work, blending creativity with technical expertise. Our project was completed on time and exceeded expectations. Can't recommend him highly enough!",
    name: "Liam",
    title: "Credit Cars",
    image: "testimonials/credit_cars_logo.png", 
  },  
  {
    message: "Hardik's attention to detail and commitment to quality propelled our project forward seamlessly. His full-stack proficiency made him an invaluable asset. Highly satisfied!",
    name: "Ankur",
    title: "Edlighten AI",
    image: "testimonials/edlighten_circle.png", 
  },  
  {
    message: "Trustworthy, knowledgeable, and responsive, Hardik transformed our ideas into a fully functional application. His work ethic and ability to solve challenges impressed us deeply.",
    name: "Musa",
    title: "Fortify Logic",
    image: "testimonials/fortify.png", 
  },
  {
    message: "Working with Hardik was a pleasure. He took the time to understand our needs and delivered a robust solution that exceeded expectations. Highly recommend",
    name: "Musa",
    title: "Hola Home",
    image: "testimonials/holahome.png", 
  },
  {
    message: "An outstanding developer and manager, Hardik guided our project with precision and insight. His commitment to excellence ensured our ultimate satisfaction.",
    name: "Jacob",
    title: "IDealer",
    image: "testimonials/iDealer_Logo.png", 
  },
  {
    message: "Professional, efficient, and highly skilled, Hardik turned our project challenges into achievements. Our entire team is grateful for his outstanding work.",
    name: "Asim Namre",
    title: "Property Dictionary",
    image: "testimonials/pd_app_icon_circle.png", 
  },
  {
    message: "Collaborating with Hardik was a game-changer. His technical skills and problem-solving capabilities were exceptional. Delivered our project flawlessly!",
    name: "Akbar",
    title: "Renovation For U",
    image: "testimonials/renovation_for_u.jpg", 
  },
  {
    message: "Great experience working with Hardik. His innovative solutions and solid management skills were instrumental in delivering our project on time.",
    name: "Eric",
    title: "Sustainability Ledger",
    image: "testimonials/sl.png", 
  },
  {
    message: "Hardik provided top-tier development and management support. His skilled execution and commitment to quality were vital in making our project successful.",
    name: "Ashiq Alli",
    title: "Sign N Drive",
    image: "testimonials/snd_circle.png", 
  },
  {
    message: "Hardik's work ethic, skill, and attention to detail made our project a triumph. His technical brilliance and leadership were key to our satisfaction.",
    name: "Rushab",
    title: "Zambad Jewellers",
    image: "testimonials/zambad.png", 
  },
  
];


const Testimonials = () => {
  const router = useRouter()
  return (
    <div className="mx-auto max-w-7xl px-6 w-full pb-10 pt-10 overflow-hidden">
     <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Testimonials</h2>
        <p className="text-black">Get started in minutes with our simple process</p>
      </div>
      <Swiper 
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 3000, 
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Pagination, Navigation, Autoplay]}
        className="px-20 py-30 mt-10"
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials2.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gradient-to-b from-[#2563EB] to-[#153885] mb-12 p-6 rounded-lg shadow-lg h-full min-h-[350px] flex flex-col justify-between">
              <div className='flex justify-end '><Quote className='text-indigo-900' size={30}/></div>
              <p className="text-sm md:text-base mb-4 text-white leading-relaxed">
                {testimonial.message}
              </p>
              <div className="flex items-center mt-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Testimonials;