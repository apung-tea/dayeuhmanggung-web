import React from 'react';
import { FaImage, FaCampground, FaRobot } from 'react-icons/fa';
import backgroundImage from '../../assets/per-dm.jpg';
import { motion } from 'framer-motion';

const Hero = () => {
  const features = [

    {
      icon: <FaRobot className="w-6 h-6" />,
      count: "24 jam",
      text: "Chatbot"
    }
  ];

  return (
    <div className="relative min-h-[500px] h-screen md:min-h-[700px] bg-black text-white overflow-hidden">
      {/* Background image with overlay */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backgroundBlendMode: 'overlay'
        }}
      >
        {/* Fallback background color */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-b from-black to-gray-800"
        ></motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-3 sm:px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.5
          }}
          className="text-4xl md:text-7xl font-bold mb-4 tracking-wider"
          style={{fontFamily: 'Playfair Display, serif'}}
        >
          Jelajah Dayeuhmanggung
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.9
          }}
          className="text-base sm:text-xl md:text-2xl mb-8 md:mb-12 text-gray-300 font-raleway font-light"
        >
          Destinasi Wisata Alam, Sejarah, dan Petualangan
        </motion.p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 1.1 + (index * 0.2)
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 font-raleway text-sm sm:text-base"
            >
              {feature.icon}
              <span className="font-semibold">{feature.count}</span>
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
