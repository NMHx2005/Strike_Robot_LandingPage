import Image from "next/image";
import Link from "next/link";
import { FOOTER, SITE_NAME } from "@/lib/constants";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  X: (
    <svg width="18" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  GitHub: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.56v-2.16c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18A10.9 10.9 0 0 1 12 6.03c.98 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.76.12 3.05.73.8 1.17 1.83 1.17 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  GitBook: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 4.5h8.25A2.75 2.75 0 0 1 17.5 7.25v12.25H8.25A2.75 2.75 0 0 1 5.5 16.75V5.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.25 4.5h8.25A2.75 2.75 0 0 1 19.25 7.25v12.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 15.75h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 8.25h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer
      className="relative px-3 py-12 cv-auto md:p-12"
      aria-label="Site footer"
    >
      <div className="mx-auto flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex w-full items-center justify-between md:contents">
          <Link
            href="/"
            className="flex h-[26px] w-[76px] shrink-0 justify-start md:order-1 md:h-[42px] md:w-[320px]"
            aria-label={SITE_NAME}
          >
            <Image
              src="/Logo.svg"
              alt=""
              width={123}
              height={42}
              className="h-[26px] w-[76px] object-contain md:h-[42px] md:w-[123px]"
            />
          </Link>

          <div
            className="flex items-center justify-end gap-3 md:order-3 md:w-[320px]"
            role="list"
            aria-label="Social links"
          >
            {FOOTER.socials.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                role="listitem"
                className="flex size-9 items-center justify-center rounded-[12px] bg-black/[0.06] text-[#3e424d] transition-[background-color,opacity] duration-200 hover:bg-black/[0.1]"
              >
                {SOCIAL_ICONS[label] ?? <span className="text-xs">{label[0]}</span>}
              </Link>
            ))}
          </div>
        </div>

        <p className="max-w-xs text-center text-[12px] leading-normal tracking-[-0.24px] text-[#3e424d]/70 md:order-2 md:flex-1 md:text-sm md:leading-snug md:tracking-normal md:text-black/50">
          {FOOTER.copyright}
        </p>
      </div>
    </footer>
  );
}
