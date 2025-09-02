import React from "react";

const MyCourses = () => {
  const completedWorkshops = [
    {
      month: "March 2025",
      events: [
        {
          date: "Tuesday, March 8",
          title: "DDI Showcase 2025",
          time: "9:00 am - 16:00 pm",
        },
        {
          date: "Thursday, March 10",
          title: "DDI CONNECT 2025",
          time: "9:00 am - 16:00 pm",
        },
      ],
    },
    {
      month: "January 2025",
      events: [
        {
          date: "Tuesday, January 10",
          title: "DDI CONNECT 2025",
          time: "9:00 am - 16:00 pm",
        },
      ],
    },
  ];

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>

      {/* Toggle Buttons */}
      <div className="flex bg-gray-200 rounded-full w-48 mb-6">
        <button className="flex-1 py-1 rounded-full">Upcoming</button>
        <button className="flex-1 py-1 bg-purple-500 text-white rounded-full">Completed</button>
      </div>

      {/* Workshop List */}
      {completedWorkshops.map((monthData) => (
        <div key={monthData.month} className="mb-8">
          <div className="text-center mb-4 text-gray-500">{monthData.month}</div>

          {monthData.events.map((event, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 mb-3 rounded hover:bg-gray-200 cursor-pointer"
            >
              <div className="border-l-4 border-purple-500 pl-3">
                <div className="font-medium">{event.date}</div>
                <div className="">{event.title}</div>
                <div className="text-gray-500 text-sm">{event.time}</div>
              </div>
              <div className="text-purple-500 font-bold text-lg">{">"}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyCourses;
