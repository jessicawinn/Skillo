"use client";
import { useState, useEffect } from "react";
import LandingNavBar from "@/components/LandingNavBar";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Login from "@/components/modals/Login";
import Signup from "@/components/modals/Signup";
import Image from "next/image";
import Link from "next/link";
import { 
  Code, Palette, Database, Briefcase, Brain, Megaphone, Shield, PenTool, Globe, Atom 
} from "lucide-react";

// Mapping of category names to SVG icons
const categoryIcons = {
  Programming: <Code className="w-6 h-6 text-orange-600" />,
  Design: <Palette className="w-6 h-6 text-purple-600" />,
  "Data Science": <Database className="w-6 h-6 text-green-600" />,
  Business: <Briefcase className="w-6 h-6 text-pink-600" />,
  AI: <Brain className="w-6 h-6 text-purple-600" />,
  Marketing: <Megaphone className="w-6 h-6 text-yellow-600" />,
  Security: <Shield className="w-6 h-6 text-emerald-600" />,
  Art: <PenTool className="w-6 h-6 text-pink-600" />,
  "Web Development": <Globe className="w-6 h-6 text-blue-600" />,
  React: <Atom className="w-6 h-6 text-cyan-600" />,
};


export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalInstructors, setTotalInstructors] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setLoginOpen(true);
        window.history.replaceState({}, '', '/');
      }
    }
  }, [pathname]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        const categoryMap = {};
        (data.courses || []).forEach(course => {
          if (!course.category) return;
          if (!categoryMap[course.category]) {
            categoryMap[course.category] = { name: course.category, count: 1, image: course.image_url || null };
          } else {
            categoryMap[course.category].count += 1;
          }
        });
        setTotalCourses((data.courses || []).length);
        const cats = Object.values(categoryMap).slice(0, 5);
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await fetch('api/users?role=instructor');
        if (!res.ok) throw new Error("Failed to fetch instructors");
        const data = await res.json();
        setTotalInstructors((data.users || []).length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInstructors();
  }, []);

  return (
    <>
      <LandingNavBar
        onLoginClick={() => setLoginOpen(true)}
        onSignupClick={() => setSignupOpen(true)}
      />

      {/* Hero Section */}
      <section className="w-full mt-16 mb-20 px-4 lg:px-0 flex justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl translate-x-14">


          <div className="space-y-8">
            <p className="text-purple-600 text-sm font-medium">Company Introductions</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Start Learning with Skills Hunt Now.</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Explore thousands of courses designed to improve your skills and boost your career.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature Cards */}
              {[
                { color: 'purple', text: 'Start learning from our experts.', icon: categoryIcons.Programming },
                { color: 'yellow', text: 'Enhance your skills with us now.', icon: categoryIcons.Marketing },
                { color: 'green', text: 'Do the professional level Course.', icon: categoryIcons["Data Science"] },
                { color: 'purple', text: 'Get our verified Certificate.', icon: categoryIcons.Security }
              ].map((f, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      f.color === "purple"
                      ? "bg-purple-100"
                      : f.color === "yellow"
                      ? "bg-yellow-100"
                     : f.color === "green"
                     ? "bg-green-100"
                     : "bg-gray-100"
                  }`}
                >
                  {f.icon}
                </div>

                  <h4 className="font-semibold text-gray-900">{f.text}</h4>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mt-4">
              <button onClick={() => setSignupOpen(true)} className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all">Get Started</button>
              <Link href="/courses" className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-lg font-semibold transition-all">View All Courses</Link>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative flex justify-center items-center">
            <div className="w-80 h-80 bg-gradient-to-br from-purple-200 to-purple-700 rounded-3xl shadow-lg flex items-center justify-center">
              <Image src="/Learning.png" alt="Learning" width={300} height={300} className="rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-8">
          <div className="text-center">
            <span className="text-3xl font-bold">{totalCourses}</span>
            <p className="text-sm opacity-90">Online Courses</p>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold">400k</span>
            <p className="text-sm opacity-90">Success Stories</p>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold">{totalInstructors}</span>
            <p className="text-sm opacity-90">Instructors</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto mt-20 px-4 lg:px-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-purple-600 text-sm font-medium mb-2">Popular Categories</p>
            <h2 className="text-3xl font-bold text-gray-900">Popular Category For Learn</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categoryLoading ? (
            <p className="col-span-full text-center">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="col-span-full text-center">No categories found.</p>
          ) : (
            categories.map((cat) => (
              <Link href={`/courses?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="block">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${cat.name === 'Business' ? 'bg-pink-100 group-hover:bg-pink-200' : cat.name === 'Programming' ? 'bg-orange-100 group-hover:bg-orange-200' : cat.name === 'Design' ? 'bg-purple-100 group-hover:bg-purple-200' : cat.name === 'Marketing' ? 'bg-yellow-100 group-hover:bg-yellow-200' : cat.name === 'Security' ? 'bg-emerald-100 group-hover:bg-emerald-200' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                    {categoryIcons[cat.name] || (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2">{cat.name}</h3>
                  <p className="text-gray-500 text-sm">{cat.count} courses</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <Footer />
      <Login
        isOpen={loginOpen}
        onClose={() => { setLoginOpen(false); router.push("/"); }}
        onSwitchToSignup={() => setSignupOpen(true)}
      />
      <Signup
        isOpen={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  );
}
