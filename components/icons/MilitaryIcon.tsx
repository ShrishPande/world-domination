
import React from 'react';

const MilitaryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.75l-10 4.5v6.5c0 5.438 4.477 10 10 10s10-4.562 10-10v-6.5l-10-4.5zm-1 9.75h2v6h-2v-6zm0-4h2v2h-2v-2z" clipRule="evenodd" />
    <path d="M9.172 16.828a4 4 0 015.656 0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6.25l-1.5 1.5M12 6.25l1.5 1.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default MilitaryIcon;
