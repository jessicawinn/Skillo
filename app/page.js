"use client";
import { useState, useEffect } from "react";
import LandingNavBar from "@/components/LandingNavBar";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Login from "@/components/modals/Login";
import Signup from "@/components/modals/Signup";
import Image from "next/image";
import Link from "next/link";

// Mapping of category names to SVG icons
const categoryIcons = {
  Programming: (
    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Design: (
    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  "Data Science": (
    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Business: (
    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  AI: (
    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Marketing: (
    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Security: (
    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Art: (
    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
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
        // Optionally, remove the query param after opening
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

        // Group courses by category with counts and first image
        const categoryMap = {};
        (data.courses || []).forEach(course => {
          if (!course.category) return;
          if (!categoryMap[course.category]) {
            categoryMap[course.category] = {
              name: course.category,
              count: 1,
              image: course.image_url || null
            };
          } else {
            categoryMap[course.category].count += 1;
          }
        });

        setTotalCourses((data.courses || []).length);

        // Convert to array and limit to 5 categories
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
        onSignupClick={() => setSignupOpen(true)} // FIXED
      />
      {/* Hero */}
      <div className="flex text-left p-8 ">
        <div className="w-2/3 m-10 flex flex-col gap-10">
          <h1 className="text-3xl font-bold">Access Your Class From Anywhere & Anytime</h1>
          <p className="text-gray-600">
            A learning system based on formalized teaching but with the help of electronic resourse of your knowledge.
          </p>
          <button onClick={() => setSignupOpen(true)} className="w-30 bg-purple-700 hover:bg-purple-600 transition-colors px-3 py-2 rounded-lg text-white">
            Get Started
          </button>
        </div>

        <div className="w-1/3 flex items-center justify-center">
          <Image
            src="/Hero.png"   // Direct path from /public
            alt="Hero banner"
            width={300}       // Must provide width
            height={300}      // Must provide height
            className="rounded-lg object-cover"
          />
        </div>
      </div>


      <div className="bg-purple-700 w-full flex justify-evenly text-white">
        <div className="flex flex-col items-center px-16 py-8">
          <span className="text-3xl font-bold">{totalCourses}</span>
          <span className="text-sm opacity-90">Online Course</span>
        </div>
        

        {/* Vertical divider with custom height */}
        <div className="h-12 w-px bg-white self-center"></div>

        <div className="flex flex-col items-center px-16 py-8">
          <span className="text-3xl font-bold">400k</span>
          <span className="text-sm opacity-90">Success Stories</span>
        </div>

        {/* Vertical divider with custom height */}
        <div className="h-12 w-px bg-white self-center"></div>

        <div className="flex flex-col items-center px-16 py-8">
          <span className="text-3xl font-bold">{totalInstructors}</span>
          <span className="text-sm opacity-90">Instructors</span>
        </div>
      </div>



      {/* Dynamic Category */}
      <div className="max-w-6xl mx-auto mt-30">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-purple-600 text-sm font-medium mb-2">Popular Category</p>
            <h2 className="text-3xl font-bold text-gray-900">Popular Category For Learn</h2>
          </div>
          {/* <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {categoryLoading ? (
            <div className="col-span-full text-center">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center">No categories found.</div>
          ) : (
            categories.map((cat) => (
              <Link href={`/courses?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="block">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
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
      </div>



      <div className="max-w-7xl mx-auto mt-30">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-3">Company Introductions</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Start Learning with Skills Hunt Now.
              </h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              There are many variations of passages of lorem ipsum available but the majority have suffered alteration in some form by injected humour or randomised words which don't look.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Start learning from our experts.</h4>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Enhance your skills with us now.</h4>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Do the professional level Course.</h4>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Get our verified Certificate.</h4>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/courses" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                View All Courses
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-200 rounded-full opacity-60"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-pink-200 rounded-full opacity-60"></div>
            <div className="absolute top-1/2 -right-4 w-16 h-16 bg-yellow-200 rounded-full opacity-60"></div>

            <div className="relative">
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-2 mb-4 transform rotate-2 shadow-lg">
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <p className="text-blue-600 font-medium">Learning in Progress</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl p-2 transform -rotate-3 shadow-lg">
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="h-32 w-40 bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                      </div>
                      <p className="text-orange-600 text-sm font-medium">Study Session</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Login
        isOpen={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          router.push("/");
        }}
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
