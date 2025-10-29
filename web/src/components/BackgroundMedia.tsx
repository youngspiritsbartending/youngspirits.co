import { ReactNode } from 'react';

interface BackgroundMediaProps {
  type: 'image' | 'video';
  src: string;
  posterSrc?: string;
  opacity?: number;
  overlay?: string;
  children: ReactNode;
  className?: string;
}

export default function BackgroundMedia({
  type,
  src,
  posterSrc,
  opacity = 0.3,
  overlay = 'bg-gradient-to-b from-[#fdfcf8]/95 via-[#fdfcf8]/90 to-[#f5f3ed]/95',
  children,
  className = '',
}: BackgroundMediaProps) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {type === 'video' ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            opacity,
          }}
        />
      )}

      <div className={`absolute inset-0 ${overlay}`}></div>

      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
