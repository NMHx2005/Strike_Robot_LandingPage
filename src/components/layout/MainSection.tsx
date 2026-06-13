import type { ReactNode } from "react";

/**
 * Background gradient từ Figma main container (node 28:398).
 * 0deg → white ở trên fading to transparent ở dưới.
 */
const GRADIENT =
  "linear-gradient(0deg, rgba(242,242,242,0) 0%, rgb(224,224,224) 30.945%, rgb(215,215,215) 45.719%, rgb(255,255,255) 100%)";

/**
 * Wraps the lower half of the landing page (HowItWorks → Footer):
 * - Rounded top corners (32px) + Figma gradient
 * - KHÔNG có scroll-driven motion để giảm tải render
 *   (translateY toàn bộ main containing 4 sections quá nặng)
 */
export function MainSection({ children }: { children: ReactNode }) {
  return (
    <main
      className="relative z-20 rounded-tl-[32px] rounded-tr-[32px] overflow-hidden"
      style={{ backgroundImage: GRADIENT }}
    >
      {children}
    </main>
  );
}
