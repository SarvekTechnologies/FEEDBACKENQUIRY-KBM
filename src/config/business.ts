const googlePlaceId = "ChIJpcf44mJFcjkREczG6kBGmbw";
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Krishna+Building+Material%2C+Mahwa%2C+Rajasthan&query_place_id=${googlePlaceId}`;
const businessAddress =
  "Opposite old RTDC Midway, Mahwa, Tekra, Rajasthan 321608";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://www.krishnabuildingmaterial.shop";

export const business = {
  name: "Krishna Building Material",
  shortName: "KRISHNA",
  tagline: "Building Trust. Building Better.",
  description:
    "Your trusted partner for quality building materials in Mahwa and beyond.",
  phoneDisplay: "+91 7728869226",
  whatsappNumber: "917728869226",
  address: businessAddress,
  hours: "Mon – Sat: 8:00 AM – 8:00 PM",
  googlePlaceId,
  websiteUrl: "https://www.krishnabuildingmaterial.shop/",
  welcomeUrl: `${baseUrl}/welcome`,
  instagramUrl: "https://www.instagram.com/krishnabuildingmaterialmahwa/",
  facebookUrl:
    "https://www.facebook.com/people/Krishna-Building-Material/61594785867994/",
  googleReviewUrl: `https://search.google.com/local/writereview?placeid=${googlePlaceId}`,
  mapsUrl: googleMapsUrl,
  mapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=Krishna+Building+Material%2C+Mahwa%2C+Rajasthan&destination_place_id=${googlePlaceId}`,
  mapsEmbedUrl: `https://www.google.com/maps?output=embed&q=${encodeURIComponent(`Krishna Building Material, ${businessAddress}`)}&z=16`,
};

export const whatsappLink = (
  message = "Hello Krishna Building Material, I would like to know more.",
) =>
  `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const welcomeWhatsappMessage = (name = "ji") => `Namaste ${name}!

Krishna Building Material mein aapka swagat hai.

Humse judne ke liye dhanyavaad. Aapko tiles, granite, marble, bathroom fittings aur building materials se judi kisi bhi jaankari ya assistance ki zarurat ho, toh humse sampark karein.

Aapka bharosa humare liye bahut maayne rakhta hai.

Krishna Building Material
Mahwa, Rajasthan`;

export const whatsappWelcomeLink = (name = "ji") =>
  `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(welcomeWhatsappMessage(name))}`;
