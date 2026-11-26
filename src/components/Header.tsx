import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaGoogle,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import { business, whatsappLink } from "@/config/business";

export default function Header() {
  return (
    <>
      <div className="topbar">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              className="flex items-center gap-2 hover:text-orange-300"
              href={business.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaMapMarkerAlt />
              {business.address}
            </a>
            <a
              className="flex items-center gap-2"
              href={`tel:${business.phoneDisplay.replaceAll(" ", "")}`}
            >
              <FaPhoneAlt />
              {business.phoneDisplay}
            </a>
            <span className="flex items-center gap-2">
              <FaClock />
              {business.hours}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Follow us:</span>
            <a
              aria-label="Instagram"
              href={business.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram className="text-lg text-pink-400" />
            </a>
            <a
              aria-label="Facebook"
              href={business.facebookUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook className="text-lg text-blue-400" />
            </a>
            <a
              aria-label="Google reviews"
              href={business.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaGoogle className="text-lg" />
            </a>
          </div>
        </div>
      </div>
      <header className="navbar">
        <div className="container flex min-h-[88px] flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/" className="brand-mark text-[22px]">
            <span className="brand-symbol" />
            <span>
              KRISHNA
              <br />
              <small className="text-[12px] tracking-normal">
                BUILDING MATERIAL
              </small>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-7 text-sm font-semibold">
            <Link
              className="rounded-full bg-orange-500 px-5 py-3 text-white"
              href="/"
            >
              Home
            </Link>
            <Link
              className="px-2 py-3 hover:text-orange-600"
              href="https://krishnabuildingmaterial.shop/"
            >
              Products &amp; Enquiry
            </Link>
            <Link className="px-2 py-3 hover:text-orange-600" href="/location">
              Location
            </Link>
          </nav>
          <a
            className="btn-primary"
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp /> Chat on WhatsApp
          </a>
        </div>
      </header>
    </>
  );
}
