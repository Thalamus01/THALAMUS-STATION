import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'icon' | 'header' | 'hero' | 'footer';
  animate?: boolean;
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'header', 
  animate = true, 
  size,
  className = ''
}) => {
  const getSrc = () => {
    switch (variant) {
      case 'icon': return '/logos/logo-icon.svg';
      case 'header': return '/logos/logo-icon.svg';
      case 'hero': return '/logos/logo-hero.svg';
      case 'footer': return '/logos/logo-icon.svg';
      default: return '/logos/logo-header.svg';
    }
  };

  const getBaseSize = () => {
    switch (variant) {
      case 'icon': return 64;
      case 'header': return 52;
      case 'hero': return 150;
      case 'footer': return 52;
      default: return 52;
    }
  };

  const currentSize = size || getBaseSize();

  const animationProps = animate ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 1 }
  } : {};

  const variantClasses = {
    hero: 'logo-hero',
    icon: 'logo-form',
    header: 'logo-header',
    footer: 'logo-header',
    default: 'logo-header'
  };

  return (
    <motion.div 
      {...animationProps}
      className={`flex items-center justify-center ${className}`}
    >
      <img 
        src={getSrc()} 
        alt="THALAMUS Logo" 
        style={{ height: currentSize, width: 'auto' }}
        className={`${variantClasses[variant]} object-contain`}
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};

export default Logo;
