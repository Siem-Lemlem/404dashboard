import React from 'react';

// interface LogoProps {
//   size?: number;
//   variant?: 'horizontal' | 'grid' | 'abstract' | 'mixed';
//   className?: string;
// }

// export default function Logo({ size = 48, variant = 'horizontal', className = '' }: LogoProps) {
//   if (variant === 'horizontal') {
//     return (
//       <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
//         <defs>
//           <linearGradient id="grad-h" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" style={{ stopColor: '#946dee', stopOpacity: 1 }} />
//             <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
//           </linearGradient>
//         </defs>
//         <rect width="48" height="48" rx="12" fill="#18181b" />
//         <line x1="10" y1="11" x2="22" y2="11" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
//         <line x1="26" y1="11" x2="38" y2="11" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
//         <line x1="10" y1="17" x2="18" y2="17" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
//         <line x1="22" y1="17" x2="38" y2="17" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
//         <line x1="10" y1="23" x2="28" y2="23" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
//         <line x1="32" y1="23" x2="38" y2="23" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
//         <line x1="10" y1="29" x2="16" y2="29" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
//         <line x1="20" y1="29" x2="38" y2="29" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
//         <line x1="10" y1="35" x2="24" y2="35" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
//         <line x1="28" y1="35" x2="38" y2="35" stroke="url(#grad-h)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
//       </svg>
//     );
//   }

//   if (variant === 'grid') {
//     return (
//       <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
//         <defs>
//           <linearGradient id="grad-g" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" style={{ stopColor: '#946dee', stopOpacity: 1 }} />
//             <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
//           </linearGradient>
//         </defs>
//         <rect width="48" height="48" rx="12" fill="#18181b" />
//         <line x1="10" y1="12" x2="38" y2="12" stroke="url(#grad-g)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
//         <line x1="10" y1="20" x2="38" y2="20" stroke="url(#grad-g)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
//         <line x1="10" y1="28" x2="38" y2="28" stroke="url(#grad-g)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
//         <line x1="10" y1="36" x2="38" y2="36" stroke="url(#grad-g)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
//         <line x1="14" y1="8" x2="14" y2="40" stroke="url(#grad-g)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
//         <line x1="24" y1="8" x2="24" y2="40" stroke="url(#grad-g)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
//         <line x1="34" y1="8" x2="34" y2="40" stroke="url(#grad-g)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
//       </svg>
//     );
//   }

//   if (variant === 'abstract') {
//     return (
//       <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
//         <defs>
//           <linearGradient id="grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
//             <stop offset="0%" style={{ stopColor: '#946dee', stopOpacity: 1 }} />
//             <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
//           </linearGradient>
//         </defs>
//         <rect width="48" height="48" rx="12" fill="#18181b" />
//         <line x1="8" y1="10" x2="18" y2="10" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
//         <line x1="22" y1="14" x2="40" y2="14" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
//         <line x1="8" y1="20" x2="14" y2="20" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
//         <line x1="18" y1="24" x2="32" y2="24" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
//         <line x1="36" y1="20" x2="40" y2="20" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
//         <line x1="12" y1="30" x2="26" y2="30" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
//         <line x1="30" y1="34" x2="40" y2="34" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
//         <line x1="8" y1="38" x2="20" y2="38" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
//         <line x1="24" y1="38" x2="36" y2="38" stroke="url(#grad-a)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
//       </svg>
//     );
//   }

//   // mixed variant
//   return (
//     <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
//       <defs>
//         <linearGradient id="grad-m" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" style={{ stopColor: '#946dee', stopOpacity: 1 }} />
//           <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
//         </linearGradient>
//       </defs>
//       <rect width="48" height="48" rx="12" fill="#18181b" />
//       <line x1="10" y1="12" x2="20" y2="12" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
//       <line x1="24" y1="12" x2="38" y2="12" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
//       <line x1="10" y1="20" x2="16" y2="20" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
//       <line x1="20" y1="20" x2="38" y2="20" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
//       <line x1="10" y1="28" x2="26" y2="28" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
//       <line x1="32" y1="18" x2="32" y2="38" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
//       <line x1="38" y1="24" x2="38" y2="36" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
//       <line x1="10" y1="34" x2="22" y2="34" stroke="url(#grad-m)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
//     </svg>
//   );
// }


const Logo = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#946dee', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="2" fill="#18181b" />
    {/* Bento grid inspired */}
    <rect x="2" y="2" width="16" height="8" rx="1.5" fill="url(#grad2)" opacity="0.9" />
    <rect x="10" y="11" width="17" height="8" rx="1.5" fill="url(#grad2)" opacity="0.6" />
    <rect x="2" y="11" width="7" height="16" rx="1.5" fill="url(#grad2)" opacity="0.5" />
    <rect x="28" y="2" width="18" height="18" rx="1.5" fill="url(#grad2)" opacity="0.8" />

    <rect x="10" y="20" width="7" height="16" rx="1.5" fill="url(#grad2)" opacity="0.9" />
    <rect x="19" y="2" width="8" height="8" rx="1.5" fill="url(#grad2)" opacity="0.6" />
    <rect x="3" y="28" width="6" height="8" rx="1.5" fill="url(#grad2)" opacity="0.5" />
    <rect x="2" y="37" width="35" height="9" rx="1.5" fill="url(#grad2)" opacity="0.8" />
    <rect x="38" y="21" width="8" height="25" rx="1.5" fill="url(#grad2)" opacity="0.8" />
    <rect x="18" y="21" width="19" height="15" rx="1.5" fill="url(#grad2)" opacity="0.8" />
  </svg>
);

export default function LogoShowcase() {

  return (
    <div className="">
      <div className="max-w-6xl mx-auto">

            {/* <div className="flex items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-2">
                <Logo size={64} />
                <span className="text-xs text-gray-500">Large</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Logo size={48} />
                <span className="text-xs text-gray-500">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Logo size={32} />
                <span className="text-xs text-gray-500">Small</span>
              </div>
            </div> */}

            <div className="bg-zinc-950 rounded-lg px-1 border border-zinc-800">
              <div className="flex items-center p-2 gap-2">
               <a
                 href="/"
               >
                <Logo size={50} />
               </a>
                <span className="text-white font-semibold">404Dashboard</span>
              </div>
            </div>
          </div>
     </div>
                );
}