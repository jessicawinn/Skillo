"use client";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";

export function InstructorStats({ totalCourses, totalStudents, totalRevenue }) {
  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,
      subtitle: "Published courses",
      icon: BookOpen,
      color: "from-purple-500 to-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Unique Students", 
      value: totalStudents,
      subtitle: "Students enrolled in your courses",
      icon: Users,
      color: "from-purple-500 to-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: `$${typeof totalRevenue === 'number' ? totalRevenue.toFixed(2) : '0.00'}`,
      subtitle: "From course enrollments",
      icon: DollarSign,
      color: "from-purple-500 to-purple-700", 
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Gradient Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-8 translate-x-8`}></div>
            
            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">{stat.title}</div>
                </div>
              </div>
              
              {/* Value */}
              <div className="mb-2">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </div>
              
              {/* Subtitle */}
              <div className="text-sm text-gray-500">{stat.subtitle}</div>
              
              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
