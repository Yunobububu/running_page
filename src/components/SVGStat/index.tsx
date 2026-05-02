import { lazy, Suspense, useEffect, useRef, useCallback } from 'react';
import { totalStat } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import { initSvgColorAdjustments } from '@/utils/colorUtils';

// Lazy load both github.svg and grid.svg
const GithubSvg = lazy(() => loadSvgComponent(totalStat, './github.svg'));

const GridSvg = lazy(() => loadSvgComponent(totalStat, './grid.svg'));

const SVGStat = () => {
  const githubRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize SVG color adjustments when component mounts
    const timer = setTimeout(() => {
      initSvgColorAdjustments();
    }, 100); // Small delay to ensure SVG is rendered

    return () => clearTimeout(timer);
  }, []);

  const downloadSvg = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
      const svgEl = ref.current?.querySelector('svg');
      if (!svgEl) return;

      const clone = svgEl.cloneNode(true) as SVGElement;
      const svgString = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    []
  );

  return (
    <div id="svgStat">
      <style>{`
        .svg-container .download-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .svg-container:hover .download-btn {
          opacity: 1;
        }
      `}</style>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <div ref={githubRef} className="svg-container relative">
          <button
            onClick={() => downloadSvg(githubRef, 'github.svg')}
            className="download-btn absolute right-2 top-6 z-10 rounded bg-black/50 px-2 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:bg-black/70 hover:text-white"
            title="Download SVG"
          >
            ⬇
          </button>
          <GithubSvg className="github-svg mt-4 h-auto w-full" />
        </div>
        <div ref={gridRef} className="svg-container relative">
          <button
            onClick={() => downloadSvg(gridRef, 'grid.svg')}
            className="download-btn absolute right-2 top-6 z-10 rounded bg-black/50 px-2 py-1 text-xs text-white/70 backdrop-blur transition-colors hover:bg-black/70 hover:text-white"
            title="Download SVG"
          >
            ⬇
          </button>
          <GridSvg className="grid-svg mt-4 h-auto w-full" />
        </div>
      </Suspense>
    </div>
  );
};

export default SVGStat;
