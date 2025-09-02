import Image from "next/image";
import LandingNavBar from "@/components/LandingNavBar";
import Footer from "@/components/Footer";
import CourseDetails from "@/components/CourseDetails";

export default function Home() {
    return (
        <>
            <LandingNavBar />
            <CourseDetails
                course={{
                    image: "/images/ai-course.jpg",
                    category: "AI",
                    title: "Generative AI",
                    price: 800,
                    rating: 5.0,
                    reviews: 201,
                    shortDescription: "Learn about AI and how it works in a fun and interactive way.",
                    lessonCount: 24,
                    duration: "18 hrs",
                    certificate: true,
                    students: 800,
                    about: "This is an in-depth course on AI covering basics to advanced concepts...",
                    learningPoints: [
                        "Understand AI concepts",
                        "Learn machine learning basics",
                        "Work on real projects",
                        "Apply AI in daily life",
                        "Evaluate AI ethics",
                        "Experiment with AI tools"
                    ],
                    tools: ["Python", "TensorFlow", "OpenAI API"],
                    curriculum: [
                        { title: "Interactive Games & Quizzes", percentage: 25 },
                        { title: "Story-Based Lessons & Videos", percentage: 25 },
                        { title: "Hands-On Projects & Crafts", percentage: 20 },
                        { title: "Group Discussions & Show-and-Tell", percentage: 15 },
                        { title: "Creative Challenges & Brain Teasers", percentage: 10 },
                        { title: "Final Show & Tell Project", percentage: 5 },
                    ],
                    modules: [
                        {
                            title: "Module I - Discovering Interactive AI",
                            lessons: [
                                {
                                    title: "Lesson 1 - What is AI?",
                                    points: ["Learn about AI using fun examples"]
                                },
                                {
                                    title: "Lesson 2 - How do Computers Learn?",
                                    points: ["Overview of interactive AI", "Discover how AI can chat, play games, and answer questions"]
                                },
                            ]
                        },
                        {
                            title: "Module II - Building with AI",
                            lessons: []
                        },
                        {
                            title: "Module III - Being Safe and Smart with AI",
                            lessons: []
                        }
                    ]
                }}
            />

            <Footer />

        </>
    );
}
