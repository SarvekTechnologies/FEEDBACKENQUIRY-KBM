// import { business, whatsappLink } from "@/config/business";
// import {
//   FaClock,
//   FaDirections,
//   FaMapMarkerAlt,
//   FaPhoneAlt,
//   FaWhatsapp,
// } from "react-icons/fa";

// const fun = () => {
//   // This function currently does nothing
//   return (
//     <>
//       <main className="container py-16">
//         <p className="mb-3 font-bold uppercase tracking-widest text-orange-600">
//           Find us
//         </p>
//         <h1 className="section-title">Visit Krishna Building Material</h1>
//         <p className="muted mt-3 max-w-2xl">
//           We look forward to helping you with your building material
//           requirements.
//         </p>
//         <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.8fr]">
//           <section className="panel min-h-[360px] overflow-hidden">
//             {business.mapsEmbedUrl ? (
//               <iframe
//                 title="Krishna Building Material map"
//                 src={business.mapsEmbedUrl}
//                 width="100%"
//                 height="100%"
//                 className="min-h-[360px] border-0"
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               />
//             ) : (
//               <div className="flex min-h-[360px] flex-col items-center justify-center bg-[#e7e9e8] p-8 text-center">
//                 <FaMapMarkerAlt className="text-5xl text-orange-600" />
//                 <h2 className="mt-4 text-xl font-bold">Map is unavailable</h2>
//                 <p className="muted mt-2 max-w-sm">
//                   Open the verified shop location on Google Maps.
//                 </p>
//                 <a
//                   className="btn-primary mt-5"
//                   href={business.mapsUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   <FaDirections /> Search on Google Maps
//                 </a>
//               </div>
//             )}
//           </section>
//           <section className="panel p-7">
//             <h2 className="text-2xl font-bold">Store information</h2>
//             <div className="mt-7 grid gap-6">
//               <div className="flex gap-4">
//                 <FaMapMarkerAlt className="mt-1 text-xl text-orange-600" />
//                 <div>
//                   <strong>Address</strong>
//                   <a
//                     className="muted mt-1 block hover:text-orange-600"
//                     href={business.mapsUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                   >
//                     {business.address}
//                   </a>
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <FaPhoneAlt className="mt-1 text-xl text-orange-600" />
//                 <div>
//                   <strong>Phone</strong>
//                   <p className="muted mt-1">{business.phoneDisplay}</p>
//                 </div>
//               </div>
//               <div className="flex gap-4">
//                 <FaClock className="mt-1 text-xl text-orange-600" />
//                 <div>
//                   <strong>Opening hours</strong>
//                   <p className="muted mt-1">{business.hours}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-8 flex flex-wrap gap-3">
//               <a
//                 className="btn-primary"
//                 href={business.mapsDirectionsUrl}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <FaDirections /> Get Directions
//               </a>
//               <a
//                 className="btn-outline"
//                 href={whatsappLink()}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 <FaWhatsapp /> WhatsApp
//               </a>
//             </div>
//             <p className="muted mt-6 text-xs">
//               Please confirm the store hours are current before publishing.
//             </p>
//           </section>
//         </div>
//       </main>
//       ;
//     </>
//   );
// };

// export default fun;

//

import { business, whatsappLink } from "@/config/business";
import {
  FaClock,
  FaDirections,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function LocationPage() {
  return (
    <main className="container py-16">
      <p className="mb-3 font-bold uppercase tracking-widest text-orange-600">
        Find us
      </p>

      <h1 className="section-title">Visit Krishna Building Material</h1>

      <p className="muted mt-3 max-w-2xl">
        We look forward to helping you with your building material requirements.
        Visit our store for quality products and assistance.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.8fr]">
        {/* Google Maps */}
        <section className="panel overflow-hidden">
          <div className="relative h-[70vh] min-h-[420px] max-h-[640px]">
            {business.mapsEmbedUrl ? (
              <iframe
                title="Krishna Building Material shop location"
                src={business.mapsEmbedUrl}
                width="100%"
                height="100%"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allow="geolocation"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex min-h-[450px] flex-col items-center justify-center bg-[#e7e9e8] p-8 text-center">
                <FaMapMarkerAlt className="text-5xl text-orange-600" />

                <h2 className="mt-4 text-xl font-bold">Find Our Store</h2>

                <p className="muted mt-2 max-w-sm">
                  Open our verified shop location on Google Maps.
                </p>

                <a
                  className="btn-primary mt-5"
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaDirections /> Open Google Maps
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Store Information */}
        <section className="panel p-7 lg:p-9">
          <p className="font-bold uppercase tracking-widest text-orange-600">
            Our Store
          </p>

          <h2 className="mt-2 text-2xl font-bold">Store Information</h2>

          <div className="mt-8 grid gap-7">
            <div className="flex gap-4">
              <FaMapMarkerAlt className="mt-1 text-xl text-orange-600 shrink-0" />
              <div>
                <strong>Address</strong>
                <a
                  className="muted mt-1 block hover:text-orange-600"
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {business.address}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <FaPhoneAlt className="mt-1 text-xl text-orange-600 shrink-0" />
              <div>
                <strong>Phone</strong>
                <p className="muted mt-1">{business.phoneDisplay}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <FaClock className="mt-1 text-xl text-orange-600 shrink-0" />
              <div>
                <strong>Opening Hours</strong>
                <p className="muted mt-1">{business.hours}</p>
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              className="btn-primary"
              href={business.mapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <FaDirections /> Get Directions
            </a>

            <a
              className="btn-outline"
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>

          <p className="muted mt-6 text-xs">
            Please confirm the store hours are current before publishing.
          </p>
        </section>
      </div>
    </main>
  );
}
