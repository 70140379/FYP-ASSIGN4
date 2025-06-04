const steps = [
  {
    id: 1,
    title: "Browse Supervisors",
    description: "Explore our curated list of expert supervisors from various fields.",
  },
  {
    id: 2,
    title: "Select Your Interest",
    description: "Choose supervisors who match your project interest and expertise.",
  },
  {
    id: 3,
    title: "Connect & Collaborate",
    description: "Reach out and collaborate on your final year project with ease.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-6 bg-gray-50 text-center max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-10">How It Works</h2>
      <div className="flex flex-col md:flex-row justify-around gap-8">
        {steps.map(({ id, title, description }) => (
          <div key={id} className="bg-white rounded-lg shadow-lg p-6 flex-1">
            <div className="text-3xl font-bold text-green-600 mb-4">{id}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
