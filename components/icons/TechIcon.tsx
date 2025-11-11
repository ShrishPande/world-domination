
import React from 'react';

const TechIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM3.75 12a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zM15.75 12a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
  </svg>
);

export default TechIcon;
