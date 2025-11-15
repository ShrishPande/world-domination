import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to = '/',
  label = 'Back to Dashboard',
  className = ''
}) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(to)}
      className={`bg-gray-600 hover:bg-gray-700 ${className}`}
    >
      ← {label}
    </Button>
  );
};

export default BackButton;