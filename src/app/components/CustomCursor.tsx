import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest('a, button, [data-cursor-hover]');
      setIsHovering(!!hoverable);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', checkHover);

    const animate = () => {
      dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.12;
      dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 3}px, ${dotPos.current.y - 3}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', checkHover);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `1.5px solid rgba(249,159,27,${isHovering ? 0.9 : 0.5})`,
          boxShadow: `0 0 ${isHovering ? 20 : 12}px rgba(249,159,27,${isHovering ? 0.4 : 0.2})`,
          transform: 'translate(-100px, -100px)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, box-shadow 0.2s',
          scale: isHovering ? '1.4' : '1',
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#F99F1B',
          transform: 'translate(-100px, -100px)',
        }}
      />
    </>
  );
}
