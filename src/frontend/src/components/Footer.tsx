import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  const footerLinks = [
    "About",
    "Terms",
    "Responsible Gambling",
    "Contact",
    "FAQ",
  ];

  return (
    <footer className="footer-gradient text-white/70 mt-16">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-navy-deep flex items-center justify-center">
                <span className="text-emerald-brand font-black text-xs">%</span>
              </div>
              <span className="font-black text-white text-base">
                <span className="text-emerald-brand">100%</span>Real
              </span>
            </div>
            <nav
              className="flex flex-wrap gap-4 text-xs"
              aria-label="Footer navigation"
            >
              {footerLinks.map((link) => (
                <span
                  key={link}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {link}
                </span>
              ))}
            </nav>
            <div className="flex gap-3">
              <span
                aria-label="X"
                className="hover:text-white transition-colors cursor-pointer"
              >
                <SiX className="h-4 w-4" />
              </span>
              <span
                aria-label="Facebook"
                className="hover:text-white transition-colors cursor-pointer"
              >
                <SiFacebook className="h-4 w-4" />
              </span>
              <span
                aria-label="Instagram"
                className="hover:text-white transition-colors cursor-pointer"
              >
                <SiInstagram className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20">
              <span className="font-bold text-white">18+</span>
              <span>Responsible Gaming</span>
            </div>
            <p className="text-white/50">
              &copy; {year}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
