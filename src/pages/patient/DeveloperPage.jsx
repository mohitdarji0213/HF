import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaCode } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiFirebase,
  SiGraphql,
  SiRedux,
  SiCplusplus,
  SiDjango,
  SiFlutter,
  SiKotlin,
  SiRust,
  SiVuedotjs,
} from "react-icons/si";
import { MdLocalHospital } from "react-icons/md";
import Navbar from "../../components/common/Navbar";

// ── Module-level GSAP singleton (prevents duplicate script loads) ──
let _gsapReady = false;
let _pending = [];

function loadGSAP(cb) {
  if (window.gsap && window.ScrollTrigger) {
    cb(window.gsap, window.ScrollTrigger);
    return;
  }
  _pending.push(cb);
  if (_gsapReady) return;
  _gsapReady = true;
  const s1 = document.createElement("script");
  s1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  s1.onload = () => {
    const s2 = document.createElement("script");
    s2.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
    s2.onload = () => {
      window.gsap.registerPlugin(window.ScrollTrigger);
      _pending.forEach((fn) => fn(window.gsap, window.ScrollTrigger));
      _pending = [];
    };
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
}

// eslint-disable-next-line react-hooks/exhaustive-deps
function useGSAP(callback) {
  useEffect(() => { loadGSAP(callback); }, []);
}

// ── Team data ────────────────────────────────────────────────────
const team = [
  {
    name: "Mohit Darji",
    role: "Full Stack Developer",
    url: "/assets/imge.jpeg",
    initials: "MD",
    gradient: "from-blue-500 to-cyan-400",
    bio: "MERN stack expert with 2+ years building scalable web apps.",
    languages: [
      { icon: SiJavascript, label: "JS" },
      { icon: SiTypescript, label: "TS" },
      { icon: SiReact, label: "React" },
      { icon: SiNodedotjs, label: "Node" },
      { icon: SiMongodb, label: "Mongo" },
      { icon: SiRedux, label: "Redux" },
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Satish kumar",
    role: "Frontend Engineer",
    url: "/assets/mohit.png",
    initials: "SK",
    gradient: "from-blue-400 to-indigo-500",
    bio: "UI/UX focused developer crafting pixel-perfect React interfaces.",
    languages: [
      { icon: SiReact, label: "React" },
      { icon: SiNextdotjs, label: "Next.js" },
      { icon: SiTailwindcss, label: "Tailwind" },
      { icon: SiTypescript, label: "TS" },
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
  {
    name: "Himanshu Janghara ",
    role: "Backend & DevOps",
    url: "/assets/rohan.jpg",
    initials: "HG",
    gradient: "from-cyan-500 to-blue-600",
    bio: "Systems engineer specializing in Python, APIs & cloud infrastructure.",
    languages: [
      { icon: SiNodedotjs, label: "Node" },
      { icon: SiReact, label: "React" },
      { icon: SiNextdotjs, label: "Next.js" },
      { icon: SiTailwindcss, label: "Tailwind" },
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Ishwar Suthar",
    role: "frontend Developer",
    url: null,
    initials: "IS",
    gradient: "from-indigo-400 to-blue-500",
    bio: "Cross-platform mobile apps using Flutter & native Android (Kotlin).",
    languages: [
      
      { icon: SiReact, label: "React" },
      { icon: SiNextdotjs, label: "Next.js" },
      { icon: SiTailwindcss, label: "Tailwind" },
      { icon: SiGit, label: "Git" },
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },  {
    name: "prince ",
    role: "frontend Developer",
    url: null,
    initials: "p",
    gradient: "from-indigo-400 to-blue-500",
    bio: "Cross-platform mobile apps using Flutter & native Android (Kotlin).",
    languages: [
      
      { icon: SiReact, label: "React" },
      { icon: SiNextdotjs, label: "Next.js" },
      { icon: SiTailwindcss, label: "Tailwind" },
      { icon: SiGit, label: "Git" },
    ],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      instagram: "https://instagram.com",
    },
  },
];

// ── Social icon ──────────────────────────────────────────────────
function SocialIcon({ type, url }) {
  const icons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    instagram: FaInstagram,
  };
  const Icon = icons[type];
  if (!Icon) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-500 border border-blue-100 hover:border-blue-400 flex items-center justify-center text-blue-400 hover:text-white transition-all duration-300 hover:scale-110"
    >
      <Icon size={15} />
    </a>
  );
}

// ── Team card ────────────────────────────────────────────────────
function Card({ member, index }) {
  const cardRef = useRef(null);
  const [imgErr, setImgErr] = useState(false);
  const showInitials = !member.url || imgErr;

  useGSAP((gsap, ScrollTrigger) => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
        delay: index * 0.15,
        scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
      }
    );

    const pills = cardRef.current.querySelectorAll(".lang-pill");
    if (pills.length) {
      gsap.fromTo(
        pills,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.4,
          ease: "power2.out",
          delay: index * 0.15 + 0.4,
          scrollTrigger: { trigger: cardRef.current, start: "top 85%" },
        }
      );
    }
  });

  return (
    <div
      ref={cardRef}
      style={{ opacity: 0 }}
      className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
    >
      {/* Top gradient strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${member.gradient}`} />

      <div className="p-6">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center gap-4 mb-4 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-md ring-2 ring-blue-100 shrink-0">
            {showInitials ? (
              <div
                className={`w-full h-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-black text-2xl`}
              >
                {member.initials}
              </div>
            ) : (
              <img
                src={member.url}
                alt={member.name}
                onError={() => setImgErr(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="text-slate-800 font-semibold text-base leading-tight">
              {member.name}
            </h3>
            <span
              className={`text-xs font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}
            >
              {member.role}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-slate-500 text-sm leading-relaxed mb-5 text-center">
          {member.bio}
        </p>

        {/* Tech Stack */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <FaCode size={11} /> Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {member.languages.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="lang-pill flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors duration-200 cursor-default"
                style={{ opacity: 0 }}
              >
                <Icon size={12} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-50 mb-4" />

        {/* Social links */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Connect</span>
          {Object.entries(member.social).map(([type, url]) => (
            <SocialIcon key={type} type={type} url={url} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function DeveloperPage() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const dotRef = useRef(null);

  useGSAP((gsap) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(dotRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 })
      .fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.2")
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
  });

  return (
    <div className="min-h-screen bg-blue-50/60">
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #bfdbfe 1px, transparent 0)",
          backgroundSize: "32px 32px",
          opacity: 0.35,
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
        <Navbar />
      </div>

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative z-10 text-center pt-14 pb-16 px-6">
        <div
          ref={dotRef}
          className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-sm"
          style={{ opacity: 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Open to Freelance Projects
        </div>

        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight mb-4"
          style={{ opacity: 0 }}
        >
          We Build{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Digital
          </span>{" "}
          Products
        </h1>

        <p
          ref={subRef}
          className="text-slate-500 text-lg max-w-xl mx-auto mb-8"
          style={{ opacity: 0 }}
        >
          A tight-knit team of four developers who turn ideas into fast,
          beautiful, production-ready software — powering{" "}
          <span className="text-blue-600 font-semibold">DBH, Churu</span>.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-colors no-underline"
          >
            <MdLocalHospital size={16} />
            Visit Hospital
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300 px-6 py-3 rounded-2xl text-sm font-bold transition-colors no-underline"
          >
            Login to HMS
          </Link>
        </div>
      </section>

      {/* ─── Team Cards ─── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 pb-20">
        <div className="text-center mb-12">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-2">
            The Builders
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
            Meet the Team
          </h2>
          <p className="text-slate-500 text-sm">
            The developers behind DBH MediCare HMS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <Card key={member.name} member={member} index={i} />
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 bg-white border-t border-blue-100 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <MdLocalHospital className="text-white text-sm" />
          </div>
          <span className="text-slate-700 font-bold text-sm">
            DBH · MediCare HMS
          </span>
        </div>
        <p className="text-slate-400 text-xs">
          Near Bus Stand, Churu – 331001, Rajasthan
        </p>
        <p className="text-slate-300 text-xs mt-1">
          Built with{" "}
          <span className="text-blue-400">♥</span> by devteam — 2025
        </p>
      </footer>
    </div>
  );
}
