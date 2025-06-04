  const supervisors = [
    {
      id: 1,
      name: "Dr. Ayesha Malik",
      department: "Computer Science",
      expertise: "AI, Machine Learning",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0xBPkBRZtlR1wge89_r8V2zeAvYq7g4Q4tg&s",
    },
    {
      id: 2,
      name: "Prof. Omar Khan",
      department: "Electrical Engineering",
      expertise: "Embedded Systems, IoT",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoIcac5YmSSMTy-Nhul4gKy1SmvF-dYD7dtw&s",
    },

      {
      id: 3,
      name: "Prof. Hammad Ahmed",
      department: "Web Engineering",
      expertise: "JavaScript,React",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4FLcurLMozNI8hBb2z5ro88Ru5zgnNXe51w&s",
    },

  ];

  const SupervisorHighlights = () => {
    return (
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center">Featured Supervisors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supervisors.map(({ id, name, department, expertise, image }) => (
            <div key={id} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <img src={image} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-green-600 font-medium">{department}</p>
              <p className="text-gray-600">{expertise}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  export default SupervisorHighlights;
