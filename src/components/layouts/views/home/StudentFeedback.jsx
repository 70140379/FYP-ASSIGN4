const feedbacks = [
  {
    id: 1,
    name: "Sara Ali",
    feedback: "This platform made finding my FYP supervisor so easy and smooth!",
    image: "https://i.ibb.co/XYZ/student1.jpg",
  },
  {
    id: 2,
    name: "Hamza Iqbal",
    feedback: "Highly recommend it to all final year students!",
    image: "https://i.ibb.co/XYZ/student2.jpg",
  },
];

const StudentFeedback = () => {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto bg-gray-50 rounded-lg">
      <h2 className="text-4xl font-bold mb-10 text-center">What Students Say</h2>
      <div className="space-y-8">
        {feedbacks.map(({ id, name, feedback, image }) => (
          <div key={id} className="flex items-center gap-6 bg-white p-6 rounded-lg shadow-lg">
            <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <p className="italic">"{feedback}"</p>
              <p className="mt-2 font-semibold text-green-700">{name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentFeedback;
