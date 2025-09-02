import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MyLearning from "@/components/MyLearning";

export default function Home() {
    return (
        <>
            <NavBar />
            <MyLearning/>
            <Footer />
        </>
    );
}
