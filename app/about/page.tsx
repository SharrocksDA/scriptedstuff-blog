export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-white">About</h1>

      <div className="space-y-8 text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-3 text-white">About Me</h2>
          <p>
            Write a short introduction here: who you are, what you do, and what
            brought you to testing, automation, and homelab projects.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-white">What I Work On</h2>
          <p>
            Add a few lines about your day-to-day work, favorite tools, current
            projects, and the kinds of problems you enjoy solving.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-white">Why I Write</h2>
          <p>
            Explain what readers can expect from ScriptedStuff and why sharing
            these notes, guides, and experiments matters to you.
          </p>
        </section>
      </div>
    </div>
  );
}
