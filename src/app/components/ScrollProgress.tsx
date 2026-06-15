import { useScroll, motion } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9998] h-[2px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(90deg, #F99F1B, #FFD36A)',
        transformOrigin: '0% 50%',
      }}
    />
  );
}
