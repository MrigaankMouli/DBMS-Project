import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const student = typeof window !== "undefined" ? localStorage.getItem("student") : null;

    if (!student) {
      router.push("/login");
    } else {
      try {
        const parsedStudent = JSON.parse(student);

        if (!parsedStudent.Dep_ID) {
          throw new Error("Missing Dep_ID in student data");
        }

        router.push(`/register-course?Dep_ID=${parsedStudent.Dep_ID}`);
      } catch (error) {
        console.error("Error parsing or missing student data:", error);
        localStorage.removeItem("student");
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Course Registration System</h1>
      <p>Redirecting...</p>
    </div>
  );
}