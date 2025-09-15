import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AllCourses from "@/components/AllCourses";

export default function Home() {
    return (
        <>
            <NavBar />
            <AllCourses basePath="/student" fetchEnrollments={true}/>
            <Footer />
        </>
    );
}
