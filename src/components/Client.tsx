{/* Reviews Section */}
  <section className="mt-16">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
    What Our Clients Say
      </h2>
      <div className="flex overflow-x-auto gap-8 pb-8">
    {/* Review Cards */}
    {[
      {
        name: "John Doe",
        role: "CEO, ABC Corp",
        review: "System Steel Engineering provided outstanding service and delivered our project ahead of schedule. Highly recommended!"
      },
      {
        name: "Jane Smith",
        role: "Managing Director, XYZ Ltd", 
        review: "Their expertise in steel fabrication is unparalleled. Our facility looks better than ever thanks to their team."
      },
      {
        name: "Michael Brown",
        role: "Project Manager, DEF Industries",
        review: "Professional and reliable. They handled our complex structural engineering needs with ease."
      }
    ].map((review, i) => (
      <div key={i} className="flex-shrink-0 w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-xl">{review.name[0]}</span>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-800">{review.name}</h3>
        <p className="text-sm text-gray-500">{review.role}</p>
      </div>
        </div>
        <p className="text-gray-600">{review.review}</p>
      </div>
    ))}
      </div>
    </div>
  </section>