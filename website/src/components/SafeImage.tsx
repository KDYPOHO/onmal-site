import { useState, useRef, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackText?: string;
  retryText: string;
  aspectRatioClass?: string;
  priority?: boolean;
}

export function SafeImage(props: SafeImageProps) {
  // A different resource must not inherit a previous image's error/loading state.
  return <SafeImageResource key={props.src} {...props} />;
}

function SafeImageResource({
  src,
  alt,
  fallbackText = '이미지를 불러올 수 없습니다.',
  retryText,
  aspectRatioClass = 'aspect-[16/9]',
  priority = true,
  className = '',
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoading(false);
    }
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`w-full ${aspectRatioClass} flex flex-col items-center justify-center bg-[#111625] border border-white/10 rounded-xl p-6 text-center text-slate-400`}
        role="alert"
        aria-label={alt}
      >
        <AlertCircle className="w-8 h-8 text-rose-400/80 mb-2" />
        <p className="text-sm font-medium text-slate-300 mb-1">{alt}</p>
        <p className="text-xs text-slate-500 mb-4">{fallbackText}</p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setHasError(false);
            setIsLoading(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {retryText}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} bg-[#0B0E17] rounded-xl`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#0B0E17] animate-pulse flex items-center justify-center">
          <div className="w-7 h-7 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-contain transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
