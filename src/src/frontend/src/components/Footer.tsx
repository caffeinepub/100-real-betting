export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  return (
    <footer
      className="border-t border-border mt-16 py-8"
      style={{ background: "oklch(0.10 0.07 285)" }}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-gold font-display font-bold text-lg mb-1">
          100%Real
        </p>
        <p className="text-muted-foreground text-xs mb-3">
          Premium Casino & Betting Platform for Pakistani Users
        </p>
        <p className="text-muted-foreground text-xs">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan hover:underline"
          >
            caffeine.ai
          </a>
        </p>
        <p className="text-muted-foreground/50 text-xs mt-3">
          🔞 18+ Only · Play Responsibly · For Entertainment Purposes
        </p>
      </div>
    </footer>
  );
}
