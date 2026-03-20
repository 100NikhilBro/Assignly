const steps = [
  {
    title: "Create Assignment",
    desc: "Fill details like subject, class and topics",
  },
  {
    title: "AI Generates",
    desc: "Smart AI creates structured questions",
  },
  {
    title: "Download & Use",
    desc: "Use it directly in classroom",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12">

      <h2 className="text-2xl font-bold text-center mb-8">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm text-center"
          >
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm">{step.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}