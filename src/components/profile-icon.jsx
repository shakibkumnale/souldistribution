import React from 'react';

const ProfileIcon = ({ size = 40, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill="black" />
      <path 
        d="M50 55C59.665 55 67.5 47.165 67.5 37.5C67.5 27.835 59.665 20 50 20C40.335 20 32.5 27.835 32.5 37.5C32.5 47.165 40.335 55 50 55ZM50 62.5C37.8125 62.5 13.75 68.5937 13.75 80.625V87.5H86.25V80.625C86.25 68.5937 62.1875 62.5 50 62.5Z" 
        fill="white" 
      />
    </svg>
  );
};

export default ProfileIcon; 