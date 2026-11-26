import {
  FaFacebook,
  FaInstagram,
  FaGoogle,
  FaArrowRight,
  FaWhatsapp,
} from "react-icons/fa";
import { business, whatsappLink } from "@/config/business";

const cards = [
  {
    title: "Google Reviews",
    subtitle: "Share your experience on Google",
    icon: FaGoogle,
    href: business.googleReviewUrl,
    action: "Write a Google Review",
    tone: "social-google",
  },
  {
    title: "Facebook",
    subtitle: "Open our Facebook page and follow us",
    icon: FaFacebook,
    href: business.facebookUrl,
    action: "Follow on Facebook",
    tone: "social-facebook",
  },
  {
    title: "Instagram",
    subtitle: "Open our Instagram page and follow us",
    icon: FaInstagram,
    href: business.instagramUrl,
    action: "Follow on Instagram",
    tone: "social-instagram",
  },
  {
    title: "WhatsApp",
    subtitle: "Chat with our team for quick help",
    icon: FaWhatsapp,
    href: whatsappLink(),
    action: "Chat on WhatsApp",
    tone: "social-whatsapp",
  },
];

export default function SocialCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, subtitle, icon: Icon, href, action, tone }) => (
        <article key={title} className="social-card panel flex flex-col gap-5 p-5">
          <div className="flex items-center gap-4">
            <span className={`social-card-icon ${tone ?? ""}`}>
              <Icon aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block">{title}</strong>
              <small className="muted">{subtitle}</small>
            </span>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="btn-outline w-full text-sm"
          >
            {action} <FaArrowRight />
          </a>
        </article>
      ))}
    </div>
  );
}
