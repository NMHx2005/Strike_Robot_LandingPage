import type { ReactNode } from "react";

/**
 * Background gradient từ Figma main container (node 28:398).
 * 0deg → white ở trên fading to transparent ở dưới.
 */
const GRADIENT =
  "linear-gradient(0deg, rgba(242,242,242,0) 0%, rgb(224,224,224) 30.945%, rgb(215,215,215) 45.719%, rgb(255,255,255) 100%)";

/**
 * Soft fade ở 100px đầu của main: alpha 0 → 1 để card "trồi lên" mềm mại
 * từ hero bg phía trên, không có hard edge ở 2 góc trên. Dùng mask thay
 * cho rounded corner + shadow vì 2 cái đó luôn để lại đường viền rõ giữa
 * nền trắng của main và hero bg.
 */
const TOP_FADE_MASK =
  "linear-gradient(180deg, transparent 0px, black 100px, black 100%)";

/**
 * Wraps the lower half of the landing page (HowItWorks → Footer):
 * - Figma gradient bg + soft top mask để blend với hero bg phía trên
 * - KHÔNG có scroll-driven motion để giảm tải render
 *   (translateY toàn bộ main containing 4 sections quá nặng)
 */
export function MainSection({ children }: { children: ReactNode }) {
  return (
    <main
      className="relative z-20 overflow-hidden"
      style={{
        backgroundImage: GRADIENT,
        maskImage: TOP_FADE_MASK,
        WebkitMaskImage: TOP_FADE_MASK,
      }}
    >
      {children}
    </main>
  );
}
