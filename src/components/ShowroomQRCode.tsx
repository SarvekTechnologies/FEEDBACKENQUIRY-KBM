"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { FaDownload, FaPrint, FaCopy, FaCheck, FaQrcode } from "react-icons/fa";
import { business } from "@/config/business";

interface ShowroomQRCodeProps {
  className?: string;
  showCard?: boolean;
}

export default function ShowroomQRCode({
  className = "",
  showCard = true,
}: ShowroomQRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const targetUrl = business.welcomeUrl;
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#20252b",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [targetUrl]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "krishna-building-material-welcome-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const content = (
    <div className={`grid gap-6 ${className}`}>
      {/* Standee Preview */}
      <div
        ref={printRef}
        id="printable-qr-standee"
        className="rounded-3xl border-2 border-orange-500/20 bg-white p-6 sm:p-8 text-center shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />

        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[.25em] text-orange-600 block">
            NAMASTE &amp; WELCOME
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#20252b] tracking-tight mt-1">
            Krishna Building Material
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Opposite old RTDC Midway, Mahwa, Rajasthan
          </p>
        </div>

        {/* QR Code Canvas/Image */}
        <div className="my-5 inline-block rounded-2xl bg-white p-3 border-2 border-gray-100 shadow-md">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt="Scan QR code to open Krishna Building Material customer welcome portal"
              className="size-48 sm:size-56 object-contain"
            />
          ) : (
            <div className="size-48 sm:size-56 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
              <span className="text-sm">Generating QR...</span>
            </div>
          )}
        </div>

        <div className="max-w-xs mx-auto">
          <p className="text-sm font-extrabold text-[#20252b]">
            📱 Scan karein &amp; Welcome Form bharein
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Camera ya kisi bhi UPI/QR scanner se scan karke details share karein
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-mono break-all">
          <span>{targetUrl}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 no-print">
        <button
          onClick={handleDownload}
          disabled={!dataUrl}
          className="btn-primary text-sm font-bold shadow-xs"
        >
          <FaDownload /> Download QR (PNG)
        </button>
        <button
          onClick={handlePrint}
          className="btn-outline text-sm font-bold border-gray-300 hover:border-orange-500"
        >
          <FaPrint /> Print Standee
        </button>
        <button
          onClick={handleCopy}
          className="btn-outline text-sm font-bold border-gray-300 hover:border-orange-500"
        >
          {copied ? (
            <>
              <FaCheck className="text-green-600" /> Copied!
            </>
          ) : (
            <>
              <FaCopy /> Copy URL
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <div className="panel p-6 sm:p-8 bg-white rounded-3xl border border-gray-100 shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <span className="size-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg">
          <FaQrcode />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-[#20252b]">
            Showroom QR Standee
          </h2>
          <p className="text-xs text-gray-500">
            Showroom counter par lagane ke liye QR code download ya print
            karein.
          </p>
        </div>
      </div>
      {content}
    </div>
  );
}
