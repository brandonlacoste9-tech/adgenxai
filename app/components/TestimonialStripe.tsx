export default function TestimonialStripe() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="shrink-0">
            <div className="h-12 w-12 rounded-full border border-black/10 overflow-hidden">
              <img src="/avatar-gold.svg" alt="" className="h-full w-full" />
            </div>
          </div>
          <blockquote className="text-[#071022]/85 text-lg">
            "AdGenXAI helped us launch reels 10× faster without losing quality. We went from ideas to exports in minutes."
          </blockquote>
          <div className="md:ml-auto text-sm text-[#071022]/60">
            <div className="font-semibold text-[#071022]">Nova Collective</div>
            <div>Global creator studio</div>
          </div>
        </div>
      </div>
    </section>
  );
}
