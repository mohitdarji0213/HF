import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone, Clock, MapPin, Globe, Menu, X, Hospital,
  HeartPulse, Stethoscope, Activity, Baby, Bone, Brain,
  Droplet, LogIn, LogOut, Users, Award, Star,
  Shield, Zap, FlaskConical, Building2, CheckCircle,
  ArrowRight, Heart, Ambulance, UserCircle,
  ChevronRight, Eye, Microscope, Calendar, FileText,
  AlertTriangle, Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PHONE      = "+919099097329";
const PHONE_DISP = "+91 90990 97329";
const MAPS_URL   = "https://maps.google.com/?cid=8179899585808977079";

const ROLE_LABELS = {
  patient: "Patient",
  district_admin: "District Admin",
  hospital_manager: "Hospital Manager",
  doctor_head: "Dept. Head Doctor",
  doctor: "Doctor",
  lab_assistant: "Lab Assistant",
};

const ROLE_DASHBOARD = {
  district_admin: "/admin",
  hospital_manager: "/manager",
  doctor_head: "/doctor-head",
  doctor: "/doctor",
  lab_assistant: "/lab",
};

// ── Bilingual text ─────────────────────────────────────────────────
const T = {
  en: {
    brand: " Bhartiya Hospital",
    brandSub: "Government District Hospital · Churu, Rajasthan",
    ticker: "🚨 24×7 Emergency Available  •  📞 +91 90990 97329  •  🏥 OPD: 8 AM – 10 PM Daily  •  🩸 Blood Bank On Campus  •  ✅ Ayushman Bharat & RGHS Accepted",
    nav: { home: "Home", about: "About", services: "Services", doctors: "Doctors", contact: "Contact" },
    langBtn: "हिंदी",
    loginBtn: "Login / Register",
    profile: "My Profile",
    dashboard: "My Dashboard",
    logout: "Logout",
    hero: {
      eyebrow: "Government of Rajasthan  ·  Attached to PDU Medical College",
      h1: ["Rajasthan's Most", "Trusted Hospital"],
      sub: "The largest government hospital in Churu district — premium healthcare at accessible cost, serving lakhs of families every year.",
      cta1: "Call Now", cta2: "Get Directions",
      badge: "24 × 7  Emergency Open",
    },
    quickTitle: "Quick Services",
    quick: [
      { label: "Find Doctor",       desc: "Browse specialists",   color: "from-blue-500 to-blue-600" },
      { label: "Book Appointment",  desc: "Schedule a visit",     color: "from-sky-500 to-cyan-600" },
      { label: "Ambulance",         desc: "Emergency service",    color: "from-red-500 to-rose-600" },
      { label: "My Reports",        desc: "Download reports",     color: "from-blue-600 to-indigo-700" },
      { label: "Submit Issue",      desc: "Report a problem",     color: "from-violet-500 to-purple-600" },
      { label: "Head Doctors",      desc: "Department heads",     color: "from-amber-500 to-orange-500" },
    ],
    stats: ["Hospital Beds", "Specialist Doctors", "Emergency Care", "Medical Specialties"],
    catEyebrow: "Our Core Departments",
    catTitle: "4 Pillars of Care",
    aboutEyebrow: "About Us",
    aboutTitle: " Bhartiya Hospital, Churu",
    aboutBody: [
      " Bhartiya Hospital (DBH) is Churu district's largest and most trusted government hospital, formally attached to PDU Medical College (PDUMC). For decades, it has delivered quality healthcare to millions of patients across Churu and the surrounding region.",
      "From 24×7 emergency trauma care to specialised services in cardiology, orthopaedics, neurology, gynaecology and more — DBH brings world-class government medicine under one roof, at zero to minimal cost for eligible patients.",
    ],
    whyTitle: "Why Choose DBH?",
    why: [
      "Government rates — affordable care for every income group",
      "Attached to PDU Medical College — teaching-hospital standards",
      "Blood Bank & advanced diagnostics on campus",
      "Cashless treatment under Ayushman Bharat & RGHS",
    ],
    docEyebrow: "Medical Excellence",
    docTitle: "Meet Our Expert Doctors",
    docExp: "yrs exp.",
    svcEyebrow: "Departments & Services",
    svcTitle: "30+ Specialties Under One Roof",
    emergTitle: "Medical Emergency?",
    emergSub: "Our emergency team is available round the clock. Call immediately — every second matters.",
    emergBtn: "Call Emergency Now",
    contactEyebrow: "Find Us",
    contactTitle: "Contact & Location",
    addr: "RJ SH 69, Naya Bass, Churu, Rajasthan – 331001",
    hours: "Open all 7 days  ·  8:00 AM – 10:00 PM",
    note: "Online info may change. Please confirm by phone before visiting.",
    mapBtn: "Open in Google Maps",
    ftAbout: "Rajasthan's premier government district hospital, attached to PDU Medical College. Quality, accessible healthcare for every citizen.",
    ftLinks: "Quick Links",
    ftContact: "Get In Touch",
    copyright: "© 2025  Bhartiya Hospital, Churu  ·  Government of Rajasthan",
  },
  hi: {
    brand: "डेडराज भारतीय हॉस्पिटल",
    brandSub: "सरकारी जिला अस्पताल · चूरू, राजस्थान",
    ticker: "🚨 24×7 आपातकालीन सेवा उपलब्ध  •  📞 +91 90990 97329  •  🏥 OPD: सुबह 8 – रात 10  •  🩸 ब्लड बैंक परिसर में  •  ✅ आयुष्मान भारत और RGHS स्वीकृत",
    nav: { home: "होम", about: "हमारे बारे में", services: "सेवाएं", doctors: "डॉक्टर", contact: "संपर्क" },
    langBtn: "English",
    loginBtn: "लॉगिन / पंजीकरण",
    profile: "मेरी प्रोफ़ाइल",
    dashboard: "मेरा डैशबोर्ड",
    logout: "लॉगआउट",
    hero: {
      eyebrow: "राजस्थान सरकार  ·  पीडीयू मेडिकल कॉलेज से संबद्ध",
      h1: ["राजस्थान का सबसे", "विश्वसनीय अस्पताल"],
      sub: "चूरू जिले का सबसे बड़ा सरकारी अस्पताल — किफायती कीमत पर बेहतरीन इलाज, हर साल लाखों परिवारों की सेवा।",
      cta1: "अभी कॉल करें", cta2: "रास्ता देखें",
      badge: "24 × 7  आपातकाल खुला",
    },
    quickTitle: "त्वरित सेवाएं",
    quick: [
      { label: "डॉक्टर खोजें",       desc: "विशेषज्ञ देखें",      color: "from-blue-500 to-blue-600" },
      { label: "अपॉइंटमेंट लें",     desc: "विजिट शेड्यूल करें", color: "from-sky-500 to-cyan-600" },
      { label: "एम्बुलेंस",           desc: "आपातकालीन सेवा",     color: "from-red-500 to-rose-600" },
      { label: "मेरी रिपोर्ट",        desc: "रिपोर्ट डाउनलोड करें", color: "from-blue-600 to-indigo-700" },
      { label: "समस्या बताएं",        desc: "शिकायत दर्ज करें",    color: "from-violet-500 to-purple-600" },
      { label: "मुख्य डॉक्टर",        desc: "विभाग प्रमुख",        color: "from-amber-500 to-orange-500" },
    ],
    stats: ["अस्पताल बेड", "विशेषज्ञ डॉक्टर", "आपातकालीन सेवा", "चिकित्सा विशेषताएं"],
    catEyebrow: "हमारे मुख्य विभाग",
    catTitle: "देखभाल के 4 स्तंभ",
    aboutEyebrow: "हमारे बारे में",
    aboutTitle: "डेडराज भारतीय हॉस्पिटल, चूरू",
    aboutBody: [
      "डेडराज भारतीय हॉस्पिटल (DBH) चूरू जिले का सबसे बड़ा और विश्वसनीय सरकारी अस्पताल है, जो पीडीयू मेडिकल कॉलेज (PDUMC) से संबद्ध है। दशकों से यह चूरू और आसपास के क्षेत्र के लाखों मरीज़ों को गुणवत्तापूर्ण स्वास्थ्य सेवाएं दे रहा है।",
      "24×7 ट्रॉमा केयर से लेकर कार्डियोलॉजी, ऑर्थोपेडिक्स, न्यूरोलॉजी और स्त्री रोग जैसी विशेष सेवाओं तक — DBH एक ही छत के नीचे सर्वोत्तम सरकारी चिकित्सा सेवाएं उपलब्ध कराता है।",
    ],
    whyTitle: "DBH क्यों चुनें?",
    why: [
      "सरकारी दरें — हर आय वर्ग के लिए किफायती इलाज",
      "PDU मेडिकल कॉलेज से संबद्ध — टीचिंग हॉस्पिटल मानक",
      "ब्लड बैंक और उन्नत जांच सुविधाएं परिसर में",
      "आयुष्मान भारत और RGHS से कैशलेस इलाज",
    ],
    docEyebrow: "चिकित्सा उत्कृष्टता",
    docTitle: "हमारे विशेषज्ञ डॉक्टर",
    docExp: "वर्ष अनुभव",
    svcEyebrow: "विभाग और सेवाएं",
    svcTitle: "एक छत के नीचे 30+ विशेषताएं",
    emergTitle: "चिकित्सा आपातकाल?",
    emergSub: "हमारी आपातकालीन टीम चौबीसों घंटे उपलब्ध है। तुरंत कॉल करें — हर पल कीमती है।",
    emergBtn: "अभी आपातकालीन कॉल करें",
    contactEyebrow: "हमें ढूंढें",
    contactTitle: "संपर्क और स्थान",
    addr: "RJ SH 69, नया बास, चूरू, राजस्थान – 331001",
    hours: "सातों दिन खुला  ·  सुबह 8:00 – रात 10:00",
    note: "ऑनलाइन जानकारी बदल सकती है। आने से पहले फ़ोन से पुष्टि करें।",
    mapBtn: "गूगल मैप पर खोलें",
    ftAbout: "PDU मेडिकल कॉलेज से संबद्ध राजस्थान का प्रमुख सरकारी जिला अस्पताल।",
    ftLinks: "त्वरित लिंक",
    ftContact: "संपर्क करें",
    copyright: "© 2025 डेडराज भारतीय हॉस्पिटल, चूरू  ·  राजस्थान सरकार",
  },
};

const STATS_DATA = [
  { value: "500+", icon: Building2 },
  { value: "50+",  icon: Users     },
  { value: "24×7", icon: Zap       },
  { value: "30+",  icon: Award     },
];

const QUICK_LINKS = [
  { to: "/patient/find-doctor",      icon: Search,        requireAuth: true  },
  { to: "/patient/book-appointment", icon: Calendar,      requireAuth: true  },
  { to: "/patient/ambulance",        icon: Ambulance,     requireAuth: true  },
  { to: "/patient/reports",          icon: FileText,      requireAuth: true  },
  { to: "/patient/submit-issue",     icon: AlertTriangle, requireAuth: true  },
  { to: "/patient/head-doctors",     icon: Star,          requireAuth: true  },
];

const CATEGORIES = [
  {
    icon: Ambulance,
    from: "from-red-500", to: "to-rose-600",
    title: { en: "Emergency & Trauma", hi: "आपातकाल और ट्रॉमा" },
    desc: { en: "Round-the-clock trauma centre with dedicated ICU, ventilator support and on-call specialist response within minutes.", hi: "24×7 ट्रॉमा सेंटर — ICU, वेंटिलेटर सपोर्ट और मिनटों में विशेषज्ञ।" },
    badge: { en: "12 Specialists  ·  ICU Available", hi: "12 विशेषज्ञ  ·  ICU उपलब्ध" },
    features: { en: ["24×7 Trauma Response", "Ventilator & ICU", "Ambulance Service"], hi: ["24×7 ट्रॉमा प्रतिक्रिया", "वेंटिलेटर और ICU", "एम्बुलेंस सेवा"] },
    dot: "bg-red-400",
  },
  {
    icon: Stethoscope,
    from: "from-blue-600", to: "to-indigo-700",
    title: { en: "OPD & Consultations", hi: "ओपीडी और परामर्श" },
    desc: { en: "Daily outpatient services across 30+ specialties with experienced consultants. Walk-in 8 AM – 10 PM.", hi: "30+ विशेषताओं में अनुभवी सलाहकारों के साथ रोज़ाना OPD।" },
    badge: { en: "30+ Specialties  ·  Daily OPD", hi: "30+ विशेषताएं  ·  रोज़ाना OPD" },
    features: { en: ["Walk-in & Prior Booking", "Senior Specialists", "Low Cost Medicines"], hi: ["वॉक-इन और पूर्व बुकिंग", "वरिष्ठ विशेषज्ञ", "कम लागत की दवाएं"] },
    dot: "bg-blue-400",
  },
  {
    icon: Baby,
    from: "from-pink-500", to: "to-rose-600",
    title: { en: "Maternity & Child Care", hi: "मातृत्व और बाल स्वास्थ्य" },
    desc: { en: "Complete maternal health — safe deliveries, SNCU neonatal care, lactation support and full paediatric services.", hi: "संपूर्ण मातृत्व सेवाएं — सुरक्षित प्रसव, SNCU नवजात देखभाल।" },
    badge: { en: "8 Specialists  ·  SNCU Unit", hi: "8 विशेषज्ञ  ·  SNCU यूनिट" },
    features: { en: ["Safe Delivery 24×7", "Neonatal ICU (SNCU)", "Paediatric OPD"], hi: ["24×7 सुरक्षित प्रसव", "नवजात ICU (SNCU)", "बाल रोग OPD"] },
    dot: "bg-pink-400",
  },
  {
    icon: FlaskConical,
    from: "from-sky-500", to: "to-blue-600",
    title: { en: "Diagnostics & Laboratory", hi: "जांच और प्रयोगशाला" },
    desc: { en: "Advanced imaging (X-Ray, USG, ECG, CT Scan), high-speed pathology lab and a fully functional Blood Bank.", hi: "एक्स-रे, USG, ECG, CT स्कैन, तेज़ पैथोलॉजी और ब्लड बैंक।" },
    badge: { en: "Blood Bank  ·  24×7 Lab", hi: "ब्लड बैंक  ·  24×7 लैब" },
    features: { en: ["CT Scan & X-Ray", "Pathology Lab", "Blood Bank On Campus"], hi: ["CT स्कैन और एक्स-रे", "पैथोलॉजी लैब", "परिसर में ब्लड बैंक"] },
    dot: "bg-sky-400",
  },
];

const DOCTORS = [
  { initials: "RKS", grad: "from-red-500 to-red-700", name: { en: "Dr. Rajendra Kumar Sharma", hi: "डॉ. राजेन्द्र कुमार शर्मा" }, role: { en: "Chief Medical Officer", hi: "मुख्य चिकित्सा अधिकारी" }, spec: { en: "General & Internal Medicine", hi: "सामान्य व आंतरिक चिकित्सा" }, qualif: "MBBS, MD", exp: 22, avail: { en: "Mon – Sat · 10 AM – 2 PM", hi: "सोम–शनि · सुबह 10 – दोपहर 2" }, rating: 4.9, specIcon: Stethoscope },
  { initials: "PM", grad: "from-pink-500 to-rose-600", name: { en: "Dr. Priya Mehta", hi: "डॉ. प्रिया मेहता" }, role: { en: "Senior Consultant", hi: "वरिष्ठ सलाहकार" }, spec: { en: "Gynaecology & Obstetrics", hi: "स्त्री रोग एवं प्रसूति" }, qualif: "MBBS, MS (Obs & Gynae)", exp: 15, avail: { en: "Mon – Fri · 9 AM – 1 PM", hi: "सोम–शुक्र · सुबह 9 – दोपहर 1" }, rating: 4.8, specIcon: Heart },
  { initials: "SA", grad: "from-blue-500 to-indigo-700", name: { en: "Dr. Suresh Agarwal", hi: "डॉ. सुरेश अग्रवाल" }, role: { en: "Senior Consultant", hi: "वरिष्ठ सलाहकार" }, spec: { en: "Orthopaedics & Trauma", hi: "हड्डी रोग एवं ट्रॉमा" }, qualif: "MBBS, MS (Ortho)", exp: 18, avail: { en: "Tue, Thu, Sat · 11 AM – 3 PM", hi: "मंगल, गुरु, शनि · 11 – 3" }, rating: 4.7, specIcon: Bone },
  { initials: "AJ", grad: "from-amber-500 to-orange-600", name: { en: "Dr. Anita Joshi", hi: "डॉ. अनिता जोशी" }, role: { en: "Consultant", hi: "सलाहकार" }, spec: { en: "Paediatrics & Neonatology", hi: "बाल रोग एवं नवजात शिशु" }, qualif: "MBBS, MD (Paediatrics)", exp: 12, avail: { en: "Mon – Sat · 9 AM – 12 PM", hi: "सोम–शनि · सुबह 9 – दोपहर 12" }, rating: 4.9, specIcon: Baby },
  { initials: "VS", grad: "from-violet-500 to-purple-700", name: { en: "Dr. Vikram Singh", hi: "डॉ. विक्रम सिंह" }, role: { en: "Consultant", hi: "सलाहकार" }, spec: { en: "Cardiology", hi: "हृदय रोग" }, qualif: "MBBS, MD, DM (Cardiology)", exp: 14, avail: { en: "Mon, Wed, Fri · 10 AM – 2 PM", hi: "सोम, बुध, शुक्र · 10 – 2" }, rating: 4.8, specIcon: HeartPulse },
  { initials: "MG", grad: "from-teal-500 to-emerald-600", name: { en: "Dr. Meena Gupta", hi: "डॉ. मीना गुप्ता" }, role: { en: "Consultant", hi: "सलाहकार" }, spec: { en: "Neurology", hi: "तंत्रिका रोग" }, qualif: "MBBS, MD, DM (Neurology)", exp: 11, avail: { en: "Tue & Thu · 2 PM – 6 PM", hi: "मंगल और गुरु · दोपहर 2 – शाम 6" }, rating: 4.7, specIcon: Brain },
];

const SERVICES = [
  { icon: Stethoscope, en: "General Medicine",       hi: "सामान्य चिकित्सा"     },
  { icon: Baby,        en: "Paediatrics",             hi: "बाल रोग"              },
  { icon: HeartPulse,  en: "Cardiology",              hi: "हृदय रोग"             },
  { icon: Bone,        en: "Orthopaedics",            hi: "हड्डी रोग"            },
  { icon: Brain,       en: "Neurology",               hi: "तंत्रिका रोग"         },
  { icon: Heart,       en: "Gynaecology",             hi: "स्त्री रोग"           },
  { icon: Eye,         en: "Ophthalmology",           hi: "नेत्र रोग"            },
  { icon: Activity,    en: "ENT",                     hi: "कान-नाक-गला"          },
  { icon: FlaskConical,en: "Pathology Lab",           hi: "पैथोलॉजी लैब"         },
  { icon: Microscope,  en: "Radiology & Imaging",     hi: "रेडियोलॉजी और इमेजिंग"},
  { icon: Droplet,     en: "Blood Bank",              hi: "ब्लड बैंक"            },
  { icon: Shield,      en: "Psychiatry",              hi: "मनोचिकित्सा"          },
  { icon: Activity,    en: "Dermatology",             hi: "त्वचा रोग"            },
  { icon: Stethoscope, en: "Surgery (General)",       hi: "जनरल सर्जरी"          },
  { icon: HeartPulse,  en: "Emergency & Trauma",      hi: "आपातकाल और ट्रॉमा"   },
  { icon: Users,       en: "Physiotherapy",           hi: "फिजियोथेरेपी"         },
];

// ── Sub-components ─────────────────────────────────────────────────

function Eyebrow({ children, light = false }) {
  return (
    <span className={`inline-block text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3 ${light ? "text-sky-300" : "text-blue-600"}`}>
      {children}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
      ))}
      <span className="ml-1 text-xs font-bold text-slate-500">{rating}</span>
    </span>
  );
}

function DoctorCard({ doc, lang }) {
  const Icon = doc.specIcon;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-blue-100">
      <div className={`h-1.5 w-full bg-gradient-to-r ${doc.grad}`} />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br ${doc.grad} flex items-center justify-center shadow-lg`}>
            <span className="text-xl font-extrabold text-white">{doc.initials}</span>
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-[15px] leading-tight">{doc.name[lang]}</p>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{doc.role[lang]}</p>
            <Stars rating={doc.rating} />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 mb-4 border border-blue-100">
          <Icon size={15} className="text-blue-600 shrink-0" />
          <span className="text-[13px] font-bold text-slate-700">{doc.spec[lang]}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-semibold">{doc.qualif}</span>
            <span className="font-extrabold text-red-600">{doc.exp} {lang === "en" ? "yrs exp." : "वर्ष अनुभव"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-slate-500 bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-100">
            <Clock size={11} className="text-amber-500 shrink-0" />
            <span className="font-semibold">{doc.avail[lang]}</span>
          </div>
        </div>
        <a href={`tel:${PHONE}`}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold py-2.5 rounded-xl transition-colors">
          <Phone size={13} />
          {lang === "en" ? "Book Appointment" : "अपॉइंटमेंट लें"}
        </a>
      </div>
    </div>
  );
}

function CategoryCard({ cat, lang }) {
  const Icon = cat.icon;
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-blue-100">
      <div className={`bg-gradient-to-br ${cat.from} ${cat.to} p-7 relative overflow-hidden`}>
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <Icon size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white leading-tight">{cat.title[lang]}</h3>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-[11px] font-bold text-white">
            <span className={`inline-block h-1.5 w-1.5 rounded-full bg-white`} />
            {cat.badge[lang]}
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-[14px] text-slate-600 leading-relaxed mb-5">{cat.desc[lang]}</p>
        <ul className="space-y-2">
          {cat.features[lang].map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13px] font-semibold text-slate-700">
              <CheckCircle size={14} className="text-blue-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <a href={`tel:${PHONE}`}
          className={`mt-5 flex items-center justify-center gap-2 w-full bg-gradient-to-r ${cat.from} ${cat.to} text-white text-[13px] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity`}>
          {lang === "en" ? "Enquire Now" : "जानकारी लें"} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState("hi");
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const t = T[lang];
  const toggleLang = () => setLang(l => l === "hi" ? "en" : "hi");

  const handleLogout = () => {
    logout();
    setDropOpen(false);
  };

  const navItems = [
    { key: "home",     href: "#home"     },
    { key: "about",    href: "#about"    },
    { key: "services", href: "#services" },
    { key: "doctors",  href: "#doctors"  },
    { key: "contact",  href: "#contact"  },
  ];

  return (
    <div className="min-h-screen font-sans antialiased bg-white text-slate-800">

      {/* ── Ticker ─────────────────────────────────────────────── */}
      <div className="bg-blue-900 text-blue-100 text-[12px] font-semibold overflow-hidden py-2">
        <div className="ticker-track whitespace-nowrap">{t.ticker}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t.ticker}</div>
      </div>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/98 border-b border-blue-100 backdrop-blur-xl shadow-sm shadow-blue-100/60">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 shrink-0 no-underline">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-200">
              <Hospital size={22} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[15px] font-extrabold text-slate-900 leading-tight">{t.brand}</div>
              <div className="text-[11px] text-slate-400 font-semibold">{t.brandSub}</div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a key={item.key} href={item.href}
                className="px-3.5 py-2 text-[14px] font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors no-underline">
                {t.nav[item.key]}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors">
              <Globe size={14} /> {t.langBtn}
            </button>

            {user ? (
              <div className="relative flex items-center gap-2">
                {/* Dashboard shortcut for non-patient */}
                {user.role !== "patient" && ROLE_DASHBOARD[user.role] && (
                  <Link to={ROLE_DASHBOARD[user.role]}
                    className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                    <Activity size={14} /> {t.dashboard}
                  </Link>
                )}
                {/* Patient portal shortcut */}
                {user.role === "patient" && (
                  <Link to="/patient"
                    className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                    <Activity size={14} /> {lang === "en" ? "Patient Portal" : "पेशेंट पोर्टल"}
                  </Link>
                )}
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-[13px] font-bold text-blue-700 transition-colors">
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-extrabold">{user.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="max-w-[100px] truncate">{user.name?.split(" ")[0]}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-blue-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-blue-50">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[11px] text-blue-600 font-semibold">{ROLE_LABELS[user.role]}</p>
                    </div>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut size={15} /> {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-xl transition-colors no-underline">
                  <LogIn size={14} /> {lang === "en" ? "Login" : "लॉगिन"}
                </Link>
                <Link to="/register"
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl transition-colors shadow-sm no-underline">
                  {t.loginBtn}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={toggleLang}
              className="px-2.5 py-1.5 text-[12px] font-bold text-blue-700 border border-blue-200 bg-blue-50 rounded-lg">
              {t.langBtn}
            </button>
            {user && (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow">
                <span className="text-white text-xs font-extrabold">{user.name?.charAt(0)?.toUpperCase()}</span>
              </div>
            )}
            <button onClick={() => setMenuOpen(o => !o)} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 pb-4 pt-2 shadow-xl">
            {navItems.map((item) => (
              <a key={item.key} href={item.href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-3 text-[15px] font-semibold border-b border-slate-100 no-underline last:border-0 text-slate-700">
                <ChevronRight size={14} className="text-blue-400" /> {t.nav[item.key]}
              </a>
            ))}
            {user ? (
              <>
                {user.role !== "patient" && ROLE_DASHBOARD[user.role] && (
                  <Link to={ROLE_DASHBOARD[user.role]} onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-3 text-[15px] font-semibold text-blue-700 border-b border-slate-100 no-underline">
                    <Activity size={16} /> {t.dashboard}
                  </Link>
                )}
                {user.role === "patient" && (
                  <Link to="/patient" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-3 text-[15px] font-semibold text-blue-700 border-b border-slate-100 no-underline">
                    <UserCircle size={16} /> {lang === "en" ? "Patient Portal" : "पेशेंट पोर्टल"}
                  </Link>
                )}
                <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 py-3 w-full text-[15px] font-semibold text-slate-500">
                  <LogOut size={16} /> {t.logout}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="w-full text-center border border-blue-200 text-blue-700 font-bold py-3 rounded-xl text-[14px] no-underline">
                  {lang === "en" ? "Login" : "लॉगिन"}
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl text-[14px] no-underline">
                  {t.loginBtn}
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section id="home" className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://lh3.googleusercontent.com/gps-cs-s/APNQkAEFnh8xuimth6ojEOmN48OLXAJBl8ylTtGV3y9bFliuqcucOxMYlpqG9CYWE_xlkfIcmA090i7kX6OGBs1qj1ZcH1OMDZJGwcbmxMdJlwsL0-Y6E8hOahOmmcP7Ef8XS2rgDtxCGA=s1360-w1360-h1020-rw)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-950/30 to-slate-900/40" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300 bg-sky-500/30 backdrop-blur-sm px-4 py-1.5 mb-6">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-sky-300" />
              <span className="text-[12px] font-bold tracking-wide text-white">{t.hero.eyebrow}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-white drop-shadow-lg">
              {t.hero.h1[0]}<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-300">
                {t.hero.h1[1]}
              </span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-xl text-white drop-shadow-lg">{t.hero.sub}</p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-xl transition-colors">
                <Phone size={18} /> {t.hero.cta1}
              </a>
              <a href={MAPS_URL} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 border-2 border-white/40 hover:border-white/60 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-2xl backdrop-blur-sm transition-all">
                <MapPin size={18} /> {t.hero.cta2}
              </a>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-sm border bg-green-500/30 border-green-300/60">
              <span className="h-2 w-2 rounded-full animate-pulse bg-green-300" />
              <span className="text-[13px] font-bold text-white drop-shadow">{t.hero.badge}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70">
          <div className="h-8 w-5 rounded-full flex items-start justify-center pt-1.5 border border-white/50">
            <div className="h-1.5 w-1 rounded-full animate-bounce bg-white/70" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-blue-100 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS_DATA.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`flex items-center gap-4 px-8 py-7 ${i < 3 ? "border-r border-blue-100" : ""} ${i < 2 ? "border-b md:border-b-0" : ""}`}>
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold leading-tight text-slate-900">{s.value}</div>
                    <div className="text-[12px] font-semibold mt-0.5 text-slate-400">{t.stats[i]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── QUICK SERVICES ─────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <Eyebrow>{t.quickTitle}</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              {lang === "en" ? "Access Hospital Services" : "अस्पताल सेवाओं तक पहुंचें"}
            </h2>
            {!user && (
              <p className="mt-3 text-slate-500 text-sm">
                {lang === "en"
                  ? "Login or register to access patient services"
                  : "पेशेंट सेवाओं के लिए लॉगिन या पंजीकरण करें"}
                {" · "}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  {lang === "en" ? "Login now" : "अभी लॉगिन करें"}
                </Link>
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_LINKS.map((link, i) => {
              const Icon = link.icon;
              const q = t.quick[i];
              const el = (
                <div className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer
                  ${user ? "border-blue-100 hover:border-blue-300" : "border-slate-100 opacity-75 hover:opacity-90"}`}>
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${q.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-slate-800">{q.label}</p>
                    <p className="text-[11px] text-slate-500">{q.desc}</p>
                  </div>
                </div>
              );
              if (user) {
                return <Link key={link.to} to={link.to} className="no-underline">{el}</Link>;
              }
              return <Link key={link.to} to="/login" className="no-underline">{el}</Link>;
            })}
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ──────────────────────────────────────── */}
      <section className="bg-white px-5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Eyebrow>{t.svcEyebrow}</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">{t.svcTitle}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i} className="group flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-2xl px-4 py-3.5 cursor-default transition-all">
                  <div className="h-9 w-9 rounded-xl bg-white group-hover:bg-blue-200 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={16} className="text-blue-600" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 group-hover:text-blue-700 leading-tight">
                    {svc[lang]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      <section id="services" className="bg-gradient-to-b from-white to-blue-50 px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <Eyebrow>{t.catEyebrow}</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">{t.catTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => <CategoryCard key={i} cat={cat} lang={lang} />)}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────── */}
      <section id="about" className="bg-white px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>{t.aboutEyebrow}</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">{t.aboutTitle}</h2>
            {t.aboutBody.map((p, i) => (
              <p key={i} className="text-[16px] text-slate-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-3xl p-8 shadow-lg border border-blue-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-6">{t.whyTitle}</h3>
            <ul className="space-y-4">
              {t.why.map((w, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={13} className="text-white" />
                  </div>
                  <span className="text-[15px] text-slate-700 leading-snug">{w}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, en: "0.75 km from Churu Station", hi: "चूरू स्टेशन से 0.75 कि.मी." },
                { icon: Clock,  en: "OPD: 8 AM – 10 PM",          hi: "OPD: सुबह 8 – रात 10"      },
                { icon: Shield, en: "Est. Government Hospital",     hi: "स्थापित सरकारी अस्पताल"    },
                { icon: Award,  en: "PDUMC Affiliated",            hi: "PDUMC से संबद्ध"           },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 bg-white/60 rounded-xl px-3 py-2.5">
                    <Icon size={14} className="text-blue-600 shrink-0" />
                    <span className="text-[12px] text-slate-700 font-semibold">{item[lang]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCTORS ────────────────────────────────────────────── */}
      <section id="doctors" className="bg-gradient-to-b from-blue-50 to-white px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <Eyebrow>{t.docEyebrow}</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">{t.docTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.map((doc, i) => <DoctorCard key={i} doc={doc} lang={lang} />)}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY BANNER ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-5 py-16">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            <span className="text-white text-[12px] font-bold tracking-widest uppercase">
              {lang === "en" ? "Always Available" : "हमेशा उपलब्ध"}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">{t.emergTitle}</h2>
          <p className="text-red-100 text-lg mb-8 max-w-xl mx-auto">{t.emergSub}</p>
          <a href={`tel:${PHONE}`}
            className="inline-flex items-center gap-3 bg-white text-red-600 hover:bg-red-50 font-extrabold text-lg px-10 py-5 rounded-2xl shadow-2xl transition-colors">
            <Phone size={22} className="animate-bounce" /> {t.emergBtn}
          </a>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────── */}
      <section id="contact" className="bg-slate-900 px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14">
            <Eyebrow light>{t.contactEyebrow}</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">{t.contactTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: MapPin, label: lang === "en" ? "Address" : "पता",  value: t.addr  },
              { icon: Phone,  label: lang === "en" ? "Phone" : "फ़ोन",   value: PHONE_DISP, href: `tel:${PHONE}` },
              { icon: Clock,  label: lang === "en" ? "Hours" : "समय",   value: t.hours },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-6 transition-colors">
                <div className="h-11 w-11 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-1">{label}</div>
                  {href
                    ? <a href={href} className="text-white font-bold text-base hover:text-blue-300 transition-colors no-underline">{value}</a>
                    : <div className="text-slate-200 font-semibold text-[15px] leading-snug">{value}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <a href={MAPS_URL} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl transition-colors">
              <MapPin size={16} /> {t.mapBtn}
            </a>
            <a href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-bold px-6 py-3.5 rounded-xl transition-colors">
              <Phone size={16} /> {PHONE_DISP}
            </a>
          </div>
          <p className="mt-6 text-slate-500 text-[13px]">{t.note}</p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-[#060b18] border-t-4 border-blue-700">

        {/* Emergency strip */}
        <div className="bg-red-700/90 px-5 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Ambulance size={18} className="text-red-200 shrink-0" />
              <span>🚨 24×7 Medical Emergency</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a href="tel:108" className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm px-3 py-1.5 rounded-lg transition-colors no-underline">
                <Phone size={13} /> 108 — Free Ambulance
              </a>
              <a href={`tel:${PHONE}`} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm px-3 py-1.5 rounded-lg transition-colors no-underline">
                <Phone size={13} /> {PHONE_DISP}
              </a>
              <a href="mailto:dbhchuru@rajasthan.gov.in" className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm px-3 py-1.5 rounded-lg transition-colors no-underline">
                📧 dbhchuru@rajasthan.gov.in
              </a>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="max-w-7xl mx-auto px-5 pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

            {/* Col 1 — Hospital Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shrink-0">
                  <Hospital size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-extrabold text-[15px] leading-tight">{t.brand}</div>
                  <div className="text-blue-400 text-[11px] font-semibold">Govt. District Hospital · Churu</div>
                </div>
              </div>
              <p className="text-slate-400 text-[13px] leading-relaxed mb-5">{t.ftAbout}</p>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["Ayushman Bharat", "RGHS", "PDU Medical College"].map(b => (
                  <span key={b} className="text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">{b}</span>
                ))}
              </div>
              {/* Quick call */}
              <a href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-colors no-underline">
                <Phone size={13} /> {PHONE_DISP}
              </a>
            </div>

            {/* Col 2 — Patient Services */}
            <div>
              <h4 className="text-white font-bold text-[13px] uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-blue-500" /> Patient Portal
              </h4>
              <ul className="space-y-2">
                {[
                  { to: "/patient/find-doctor",      icon: Search,        label: "Find Doctor",       color: "text-blue-400" },
                  { to: "/patient/book-appointment", icon: Calendar,      label: "Book Appointment",  color: "text-sky-400" },
                  { to: "/patient/ambulance",        icon: Ambulance,     label: "Book Ambulance",    color: "text-red-400" },
                  { to: "/patient/reports",          icon: FileText,      label: "My Reports",        color: "text-indigo-400" },
                  { to: "/patient/submit-issue",     icon: AlertTriangle, label: "Submit Issue",      color: "text-violet-400" },
                  { to: "/patient/head-doctors",     icon: Star,          label: "Head Doctors",      color: "text-amber-400" },
                  { to: "/login",                    icon: LogIn,         label: "Login / Register",  color: "text-green-400" },
                ].map(({ to, icon: Icon, label, color }) => (
                  <li key={to}>
                    <Link to={to}
                      className={`flex items-center gap-2.5 text-slate-400 hover:text-white text-[13px] font-semibold transition-colors no-underline group`}>
                      <Icon size={13} className={`${color} shrink-0 group-hover:scale-110 transition-transform`} />
                      {label}
                      <ChevronRight size={11} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-white/5">
                <h4 className="text-white font-bold text-[13px] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-slate-600" /> Quick Links
                </h4>
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.key}>
                      <a href={item.href}
                        className="text-slate-500 hover:text-blue-400 text-[12px] font-semibold transition-colors no-underline flex items-center gap-1.5">
                        <ChevronRight size={10} /> {t.nav[item.key]}
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link to="/developer"
                      className="text-slate-500 hover:text-blue-400 text-[12px] font-semibold transition-colors no-underline flex items-center gap-1.5">
                      <ChevronRight size={10} /> Developer Team
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Col 3 — Department Head Doctors */}
            <div>
              <h4 className="text-white font-bold text-[13px] uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-blue-500" /> Our Doctors
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Dr. Rajendra Kumar", dept: "General Medicine", qual: "MBBS, MD", exp: 22, avail: true  },
                  { name: "Dr. Rajesh Sharma",  dept: "Orthopedics",      qual: "MBBS, MS (Ortho)", exp: 15, avail: true  },
                  { name: "Dr. Priya Mehta",    dept: "Gynecology",       qual: "MBBS, MS (OBG)", exp: 15, avail: true  },
                  { name: "Dr. Sunita Patel",   dept: "Pediatrics",       qual: "MBBS, MD (Peds)", exp: 18, avail: true  },
                  { name: "Dr. Arjun Mehta",    dept: "Cardiology",       qual: "MBBS, DM (Card)", exp: 20, avail: false },
                  { name: "Dr. Pradeep Nair",   dept: "Neurology",        qual: "MBBS, DM (Neuro)", exp: 16, avail: true  },
                ].map((doc) => (
                  <li key={doc.name} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-extrabold">{doc.name.split(" ").slice(1).map(w => w[0]).join("").slice(0,2)}</span>
                    </div>
                    <div>
                      <p className="text-white text-[12px] font-bold leading-tight">{doc.name}</p>
                      <p className="text-blue-400 text-[10px] font-semibold">{doc.dept} · {doc.exp}y exp</p>
                      <p className="text-slate-600 text-[10px]">{doc.qual}</p>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${doc.avail ? 'bg-green-900/50 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                        {doc.avail ? '● Available' : '● On Leave'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/patient/find-doctor"
                className="mt-5 inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-[12px] font-bold transition-colors no-underline">
                View all doctors <ChevronRight size={12} />
              </Link>
              <Link to="/patient/head-doctors"
                className="mt-2 ml-4 inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-[12px] font-bold transition-colors no-underline">
                Dept. Heads <ChevronRight size={12} />
              </Link>
            </div>

            {/* Col 4 — Contact, Ambulance, Hours */}
            <div>
              <h4 className="text-white font-bold text-[13px] uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-red-500" /> Contact & Help
              </h4>

              {/* Emergency numbers */}
              <div className="bg-red-950/60 border border-red-800/50 rounded-xl p-3.5 mb-5">
                <p className="text-red-400 text-[10px] font-extrabold uppercase tracking-widest mb-2">Emergency Helplines</p>
                <div className="space-y-2">
                  <a href="tel:108" className="flex items-center gap-2 text-white font-bold text-[13px] hover:text-red-300 transition-colors no-underline">
                    <Ambulance size={14} className="text-red-400 shrink-0" />
                    108 — Free Ambulance (Govt.)
                  </a>
                  <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-white font-bold text-[13px] hover:text-blue-300 transition-colors no-underline">
                    <Phone size={14} className="text-blue-400 shrink-0" />
                    {PHONE_DISP} — Hospital
                  </a>
                  <a href="tel:102" className="flex items-center gap-2 text-slate-400 text-[12px] hover:text-white transition-colors no-underline">
                    <Phone size={13} className="text-slate-500 shrink-0" />
                    102 — Ambulance (Maternal)
                  </a>
                  <a href="tel:104" className="flex items-center gap-2 text-slate-400 text-[12px] hover:text-white transition-colors no-underline">
                    <Phone size={13} className="text-slate-500 shrink-0" />
                    104 — Medical Helpline
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="mb-4 space-y-2">
                <a href="mailto:dbhchuru@rajasthan.gov.in"
                  className="flex items-start gap-2.5 text-slate-400 hover:text-blue-400 text-[13px] font-semibold transition-colors no-underline">
                  <span className="text-blue-500 mt-0.5 shrink-0">✉</span>
                  dbhchuru@rajasthan.gov.in
                </a>
                <a href="mailto:help.dbhchuru@gmail.com"
                  className="flex items-start gap-2.5 text-slate-400 hover:text-blue-400 text-[13px] font-semibold transition-colors no-underline">
                  <span className="text-blue-500 mt-0.5 shrink-0">✉</span>
                  help.dbhchuru@gmail.com
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5 mb-3">
                <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 text-[13px] font-semibold leading-snug no-underline transition-colors">
                  RJ SH 69, Naya Bass, Churu, Rajasthan – 331001
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-2.5 mb-4">
                <Clock size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[13px] font-semibold">OPD: 8:00 AM – 10:00 PM daily</span>
                  <br />
                  <span className="text-green-400 text-[11px] font-bold">Emergency: 24 × 7 open</span>
                </div>
              </div>

              {/* Ambulance booking link */}
              <Link to="/patient/ambulance"
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold py-2.5 rounded-xl transition-colors no-underline">
                <Ambulance size={15} />
                Book Ambulance Online
              </Link>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-[12px] font-semibold">{t.copyright}</p>
            <div className="flex items-center gap-4">
              <Link to="/developer"
                className="text-slate-500 hover:text-blue-400 text-[12px] font-semibold transition-colors no-underline flex items-center gap-1.5">
                👨‍💻 Developer Team
              </Link>
              <span className="text-slate-700">|</span>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
                className="text-slate-500 hover:text-blue-400 text-[12px] font-semibold transition-colors no-underline">
                📍 Google Maps
              </a>
              <span className="text-slate-700">|</span>
              <a href={`tel:${PHONE}`}
                className="text-slate-500 hover:text-red-400 text-[12px] font-semibold transition-colors no-underline">
                📞 Emergency
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
