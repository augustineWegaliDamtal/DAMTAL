import React from "react";
import "./About.css"; // Optional: create this for custom styling
import { Link } from "react-router-dom";

const About = () => {
  return (
   <div className="bg-amber-400 min-h-screen mt-9 p-2">
   <Link to='/'>Home</Link>
     <section className="about-container bg-amber-300">
      <div className="about-header">
        <h1 className="font-bold text-2xl pt-6">About Us-<span className="text-2xl  border bg-amber-400 text-slate-700 outline-0"> Pro Damtal Susu Services</span></h1>
        <p className="font-bold text-slate-700">
          Bringing the trusted Ghanaian Susu tradition into the digital age —
          secure, transparent, and accessible anywhere.
        </p>
      </div>

      <div className="about-section">
        <h2 className="text-2xl font-bold">💡 Who We Are</h2>
        <p className="font-bold text-slate-700">
          We are a trusted digital susu platform designed to empower individuals
          and groups to save together, grow together, and reach financial goals
          faster — with bank‑level security and an easy‑to‑use interface.
        </p>
      </div>

      <div className="about-section">
        <h2 className="text-2xl font-bold">📜 Our Story</h2>
        <p className="font-bold text-slate-700">
          For generations, susu has been a grassroots savings system built on
          trust and shared responsibility. We created <span className="font-bold text-slate-800 text-xl">Pro-Damtal Susu Services</span> to make
          that tradition simpler and safer through technology — so whether
          you're in <span className="text-slate-800 font-black">Accra, Kumasi, or abroad</span>, you can participate from the palm
          of your hand.
        </p>
      </div>

      <div className="about-section">
        <h2 className="text-2xl font-bold">🚀 What We Offer</h2>
        <ul>
          <li className="font-bold text-slate-700">Digital Group Savings — create or join susu groups online</li>
          <li className="font-bold text-slate-700">Automated Tracking — real‑time contribution updates</li>
          <li className="font-bold text-slate-700">Secure Transactions — encrypted and PIN‑protected</li>
          <li className="font-bold text-slate-700">Flexible Cycles — weekly, bi‑weekly, or monthly</li>
          <li className="font-bold text-slate-700">Reminders — never miss a payment date</li>
        </ul>
      </div>

      <div className="about-section">
        <h2 className="text-2xl font-bold">🤝 Why Choose Us</h2>
        <ul>
          <li className="font-bold text-slate-700">Transparency — clear contribution and payout records</li>
          <li className="font-bold text-slate-700">Security — industry‑standard data protection</li>
          <li className="font-bold text-slate-700">Convenience — no physical meetings required</li>
          <li className="font-bold text-slate-700">Community — connect with your group anywhere</li>
        </ul>
      </div>

      <div className="about-section">
        <h2 className="text-2xl font-bold">🌍 Our Vision</h2>
        <p className="font-bold text-slate-700">
          To become Ghana’s most trusted susu platform, blending tradition with
          innovation and enabling financial growth worldwide.
        </p>
      </div>

      <div className="about-contact">
        <h2 className="text-2xl font-bold">📩 Get in Touch</h2>
        <p>Email: support@[prodamtalenterprise@gmail.com]</p>
        <p>Phone/WhatsApp: +233 243278255</p>
      </div>
    </section>
   </div>
  );
};

export default About;
