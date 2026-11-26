import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeSlideshow from "@/components/WelcomeSlideshow";
import WelcomeRegistrationForm from "@/components/WelcomeRegistrationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome | Krishna Building Material Mahwa",
  description:
    "Namaste! Welcome to Krishna Building Material, Mahwa. Quality materials, trusted guidance, and best service.",
};

export default function WelcomePage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-140px)] bg-[#f3f4f2] py-6 sm:py-10 md:py-14">
        <div className="container max-w-6xl">
          {/* Main Card */}
          <section className="grid overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-12 border border-gray-100">
            {/* Left Column: Shop Image Slideshow */}
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:col-span-5 lg:min-h-[640px] xl:col-span-5 bg-[#20252b]">
              <WelcomeSlideshow />
            </div>

            {/* Right Column: Welcome Form */}
            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:col-span-7 xl:col-span-7">
              <div className="max-w-xl mx-auto w-full">
                {/* Brand Tag */}
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700 mb-3 border border-orange-200">
                  <span className="size-2 rounded-full bg-orange-500 animate-pulse" />
                  Krishna Building Material · Mahwa
                </div>

                {/* Headings */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#20252b] tracking-tight leading-tight">
                  Namaste! Krishna Building Material mein aapka swagat hai.
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  Humein khushi hai ki aap humse jude hain. Bas apni kuch
                  details share karein.
                </p>

                {/* Welcome Registration Form */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <WelcomeRegistrationForm />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
