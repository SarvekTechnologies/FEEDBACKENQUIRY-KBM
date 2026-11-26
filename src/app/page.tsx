import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialCards from "@/components/SocialCards";
import Link from "next/link";
import {
  FaShieldAlt,
  FaHandshake,
  FaHeadset,
  FaGem,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import { whatsappLink } from "@/config/business";
// import LocationPage from "./location/page";
import LocationPage from "@/components/LocationPage";

const trust = [
  {
    icon: FaShieldAlt,
    title: "Quality Materials",
    detail: "Materials selected with care",
  },
  {
    icon: FaHandshake,
    title: "Customer Trust",
    detail: "Relationships built over time",
  },
  {
    icon: FaHeadset,
    title: "Local Support",
    detail: "Helpful service in Mahwa",
  },
  {
    icon: FaGem,
    title: "Value & Service",
    detail: "A dependable local partner",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container py-20">
            <p className="mb-5 text-sm font-bold uppercase tracking-[.22em] text-orange-300">
              Krishna Building Material · Mahwa
            </p>
            <h1>
              Building Trust.
              <br />
              <span>Building Better.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-200">
              Your trusted partner for quality building materials in Mahwa and
              beyond.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                className="btn-primary"
                href={whatsappLink(
                  "Hello, I would like to enquire about your building materials.",
                )}
              >
                Explore &amp; Enquire <FaArrowRight />
              </a>
              <Link className="btn-outline" href="/location">
                <FaMapMarkerAlt /> Our Location
              </Link>
            </div>
          </div>
        </section>
        <section className="container relative -mt-8">
          <div className="panel grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex items-center gap-4">
                <Icon className="text-3xl text-orange-600" />
                <div>
                  <strong className="block">{title}</strong>
                  <small className="muted">{detail}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="container py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-3 block h-1 w-10 bg-orange-500" />
              <h2 className="section-title">Reviews &amp; Feedback</h2>
              <p className="muted mt-2">
                Your trust motivates us to do better every day.
              </p>
            </div>
            <Link
              className="font-semibold text-orange-600"
              href="/feedback-enquiry"
            >
              Share feedback <FaArrowRight className="inline" />
            </Link>
          </div>
          <SocialCards />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#20252b] p-6 text-white">
            <div>
              <h3 className="text-xl font-bold">Have a feedback?</h3>
              <p className="mt-1 text-sm text-gray-300">
                Tell us about your experience with our team.
              </p>
            </div>
            <Link className="btn-primary" href="/feedback-enquiry">
              Give Feedback <FaArrowRight />
            </Link>
          </div>
        </section>

        <LocationPage />
      </main>
      <Footer />
    </>
  );
}
