import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * 1. Sacred Tirumala Thiruman / Urdhva Pundra (Lord Venkateshwara Swamy Namam)
 * Features the two pure white upright flanks with the divine golden/saffron central Kasturi tilak.
 */
export const VenkateshwaraNamamIcon: React.FC<IconProps> = ({ 
  className = "w-6 h-6", 
  size,
  ...props 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Base Padmam Platform */}
    <path 
      d="M16 42C16 43.1 19.6 44 24 44C28.4 44 32 43.1 32 42C32 40.9 28.4 40 24 40C19.6 40 16 40.9 16 42Z" 
      fill="#FF9800" 
    />
    {/* Left Sacred White Flank (Shankha Line) */}
    <path 
      d="M13 10C13 10 12 28 17 38C19 39.5 22 40 24 40C21 38 18 34 18 24C18 16 19 10 19 10L13 10Z" 
      fill="#FFFFFF"
      stroke="#2196F3"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Right Sacred White Flank (Chakra Line) */}
    <path 
      d="M35 10C35 10 36 28 31 38C29 39.5 26 40 24 40C27 38 30 34 30 24C30 16 29 10 29 10L35 10Z" 
      fill="#FFFFFF"
      stroke="#2196F3"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Central Sacred Kasturi Tilak (Saffron / Deep Reddish Orange) */}
    <path 
      d="M22.5 12C22.5 12 21.5 28 22 36C22.5 38.5 24 39.5 24 39.5C24 39.5 25.5 38.5 26 36C26.5 28 25.5 12 25.5 12C25.5 12 24.5 10.5 24 10.5C23.5 10.5 22.5 12 22.5 12Z" 
      fill="#FF9800"
      stroke="#E65100"
      strokeWidth="0.8"
    />
    {/* Sacred Golden Dot (Bindu) */}
    <circle cx="24" cy="9" r="2" fill="#FFB74D" stroke="#E65100" strokeWidth="0.5" />
  </svg>
);

/**
 * 2. Sacred Shankha (Panchajanya Divine Conch of Lord Venkateshwara)
 */
export const ShankhaIcon: React.FC<IconProps> = ({ 
  className = "w-6 h-6", 
  size,
  ...props 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Sacred Flame Aureole */}
    <path 
      d="M12 24C12 15 18 8 26 7C32 6.5 37 10 37 16C37 20 33 23 30 25C26 27.5 24 31 24 36L20 41C18 38 14 31 12 24Z" 
      fill="#E1F5FE"
      stroke="#2196F3" 
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Divine Spiral Inner Chamber */}
    <path 
      d="M26 12C28.5 13 31 15.5 30.5 19C30 22 26 23.5 23 26C21 27.5 19 30.5 19 34" 
      stroke="#0288D1" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    {/* Shankha Tip Ornamentation */}
    <path 
      d="M20 41C19.5 42 20 43.5 21 44C22 44.5 23.5 43.5 24 42" 
      stroke="#FF9800" 
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="27" cy="14" r="1.5" fill="#FF9800" />
  </svg>
);

/**
 * 3. Sacred Sudarshana Chakra (Divine Radiant Disc of Lord Venkateshwara)
 */
export const ChakraIcon: React.FC<IconProps> = ({ 
  className = "w-6 h-6", 
  size,
  ...props 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Outer Radiant Flame Petals */}
    <circle cx="24" cy="24" r="18" stroke="#87CEEB" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="24" cy="24" r="14" fill="#E3F2FD" stroke="#2196F3" strokeWidth="2" />
    {/* Inner Hub */}
    <circle cx="24" cy="24" r="6" fill="#FF9800" stroke="#E65100" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
    {/* Radiant Spokes (8 Cardinal Points) */}
    <path d="M24 10V18" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 30V38" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 24H18" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 24H38" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 14L20 20" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M28 28L34 34" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M34 14L28 20" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 28L14 34" stroke="#2196F3" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 4. Divine Lotus (Padmam of Goddess Padmavathi & Lord Venkateshwara)
 */
export const PadmamIcon: React.FC<IconProps> = ({ 
  className = "w-6 h-6", 
  size,
  ...props 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Center Lotus Petal */}
    <path 
      d="M24 10C24 10 20 20 20 28C20 33 24 36 24 36C24 36 28 33 28 28C28 20 24 10 24 10Z" 
      fill="#FFE0B2" 
      stroke="#FF9800" 
      strokeWidth="1.8" 
    />
    {/* Left Petal */}
    <path 
      d="M20 28C17 21 12 18 12 18C12 18 11 26 15 31C18 34 22 35 22 35" 
      fill="#E1F5FE" 
      stroke="#2196F3" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
    />
    {/* Right Petal */}
    <path 
      d="M28 28C31 21 36 18 36 18C36 18 37 26 33 31C30 34 26 35 26 35" 
      fill="#E1F5FE" 
      stroke="#2196F3" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
    />
    {/* Base Calyx */}
    <path 
      d="M16 38C20 40 28 40 32 38" 
      stroke="#87CEEB" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
  </svg>
);

/**
 * 5. Sacred Kireetam (Golden Crown of Lord Venkateshwara)
 */
export const KireetamIcon: React.FC<IconProps> = ({ 
  className = "w-6 h-6", 
  size,
  ...props 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    {/* Crown Base */}
    <path d="M10 38H38L35 32H13L10 38Z" fill="#FFA726" stroke="#E65100" strokeWidth="1.5" />
    {/* Tapering Towering Crown Body */}
    <path 
      d="M13 32L17 14L24 6L31 14L35 32H13Z" 
      fill="#FFF3E0" 
      stroke="#FF9800" 
      strokeWidth="1.8" 
      strokeLinejoin="round" 
    />
    {/* Jewel Ribs */}
    <path d="M24 6V32" stroke="#2196F3" strokeWidth="1.5" />
    <path d="M19 22L29 22" stroke="#2196F3" strokeWidth="1.5" />
    {/* Crest Jewel */}
    <circle cx="24" cy="5" r="2" fill="#2196F3" stroke="#0D47A1" strokeWidth="0.8" />
  </svg>
);

/**
 * 6. Full Sacred Tirumala Sri Venkateshwara Swamy Tri-Emblem (Shankha - Thiruman Namam - Chakra)
 * Primary official emblem for Sri Thirumala Admin Storefront & Portal!
 */
export const VenkateshwaraFullEmblem: React.FC<IconProps> = ({ 
  className = "w-12 h-10", 
  size,
  ...props 
}) => (
  <div className={`inline-flex items-center justify-center gap-1.5 ${className}`}>
    <ShankhaIcon className="w-5 h-5 text-[#2196F3] shrink-0" />
    <VenkateshwaraNamamIcon className="w-7 h-7 shrink-0" />
    <ChakraIcon className="w-5 h-5 text-[#2196F3] shrink-0" />
  </div>
);

export default {
  Namam: VenkateshwaraNamamIcon,
  Shankha: ShankhaIcon,
  Chakra: ChakraIcon,
  Padmam: PadmamIcon,
  Kireetam: KireetamIcon,
  FullEmblem: VenkateshwaraFullEmblem,
};
