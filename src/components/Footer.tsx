import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaGoogle,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { business } from "@/config/business";

export default function Footer() {
  return (
    <footer className="footer mt-16">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="brand-mark text-2xl">
            <span className="brand-symbol" />
            <span>
              KRISHNA
              <br />
              <small className="text-xs tracking-normal">
                BUILDING MATERIAL
              </small>
            </span>
          </div>
          <p className="mt-5 text-sm text-gray-300">
            Building Trust.{" "}
            <strong className="text-orange-400">Building Better.</strong>
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Quick Links</h3>
          <div className="grid gap-3 text-sm text-gray-300">
            <Link href="/">Home</Link>
            <Link href="/welcome">Customer Welcome</Link>
            <Link href="/feedback-enquiry">Feedback &amp; Enquiry</Link>
            <Link href="/location">Location</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Connect With Us</h3>
          <div className="flex gap-4 text-2xl">
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href={business.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Google Reviews"
            >
              <FaGoogle />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Visit Our Store</h3>
          <a
            className="mb-3 flex gap-3 text-sm text-gray-300 hover:text-orange-300"
            href={business.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FaMapMarkerAlt className="mt-1 text-orange-400" />
            {business.address}
          </a>
          <p className="flex gap-3 text-sm text-gray-300">
            <FaClock className="mt-1 text-orange-400" />
            {business.hours}
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container flex flex-wrap justify-between gap-3 py-5 text-xs text-gray-300">
          <span>
            © {new Date().getFullYear()} {business.name}. All Rights Reserved.
          </span>
          <span>Designed for our customers.</span>
        </div>
      </div>
    </footer>
  );
}
