export default function FooterMinimal() {
  return (
    <footer className="bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-black/70 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} AdGenXAI</div>
        <nav className="flex gap-4">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="mailto:hello@adgenxai.com" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
