import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import MyCourses from "@/components/MyCourses";
import RecommendedCourses from "@/components/RecommendedCourses";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero/>
      <Stats/>
      <MyCourses/>
      {/* <RecommendedCourses basePath="/student"/> */}
      <Footer />
    </>
  );
}
