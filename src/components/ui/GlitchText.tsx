import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
}) => {
  return (
    <Component
      data-text={text}
      className={`glitch-wrapper font-orbitron font-black uppercase tracking-wider ${className}`}
    >
      {text}
    </Component>
  );
};
