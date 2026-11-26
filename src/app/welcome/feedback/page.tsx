import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeFeedbackSection from "@/components/WelcomeFeedbackSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You & Feedback | Krishna Building Material",
  description:
    "Dhanyavaad! Share your feedback with Krishna Building Material, Mahwa.",
};

export default function WelcomeFeedbackPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-140px)] bg-[#f3f4f2] py-8 sm:py-12 md:py-16">
        <div className="container">
          <Suspense
            fallback={
              <div className="panel p-12 text-center max-w-xl mx-auto bg-white rounded-3xl shadow-sm">
                <div className="size-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm font-medium">
                  Loading feedback portal...
                </p>
              </div>
            }
          >
            <WelcomeFeedbackSection />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
