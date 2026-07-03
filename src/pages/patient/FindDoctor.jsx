import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Building2,
  MapPin,
  Phone,
  ChevronLeft,
  Star,
  Users,
  Stethoscope,
  AlertCircle,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { SkeletonDoctorCard } from "../../components/common/Skeleton";
import { doctorAPI } from "../../services/api";

// ── Fallback static doctors (DBH Churu) ───────────────────────────
const STATIC_DOCTORS = [
  {
    _id: "s1",
    name: "Dr. Rajendra Kumar Sharma",
    spec: "General & Internal Medicine",
    department: "General Medicine",
    experience: 22,
    avail: "Mon–Sat · 10 AM – 2 PM",
    hospital: " Bhartiya Hospital",
    loc: "Churu, Rajasthan",
    fee: null,
    rating: 4.9,
    ratingCount: 312,
    patients: "8,400+",
    phone: "+91 90990 97329",
    degree: "MBBS, MD",
    tags: [
      "General Medicine",
      "Diabetes",
      "Hypertension",
      "Fever",
      "Internal Medicine",
    ],
    edu: [
      { d: "MBBS – PDU Medical College, Churu", y: "2000" },
      { d: "MD General Medicine – SMS Medical College", y: "2004" },
    ],
    slots: ["10:00", "11:00", "12:00", "1:00"],
    availability: true,
    isHead: true,
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
  },
  {
    _id: "s2",
    name: "Dr. Priya Mehta",
    spec: "Gynaecology & Obstetrics",
    department: "Gynecology",
    experience: 15,
    avail: "Mon–Fri · 9 AM – 1 PM",
    hospital: " Bhartiya Hospital",
    loc: "Churu, Rajasthan",
    fee: null,
    rating: 4.8,
    ratingCount: 245,
    patients: "6,200+",
    phone: "+91 90990 97329",
    degree: "MBBS, MS (Obs & Gynae)",
    tags: [
      "Pregnancy Care",
      "PCOS",
      "Infertility",
      "Normal Delivery",
      "Laparoscopy",
    ],
    edu: [
      { d: "MBBS – PDU Medical College, Churu", y: "2006" },
      { d: "MS Gynaecology – SMS Medical College", y: "2010" },
    ],
    slots: ["9:00", "10:00", "11:00", "12:00"],
    availability: true,
    isHead: false,
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
  },
  {
    _id: "s3",
    name: "Dr. Suresh Agarwal",
    spec: "Orthopaedics & Trauma",
    department: "Orthopedics",
    experience: 18,
    avail: "Tue, Thu, Sat · 11 AM – 3 PM",
    hospital: " Bhartiya Hospital",
    loc: "Churu, Rajasthan",
    fee: null,
    rating: 4.7,
    ratingCount: 198,
    patients: "5,800+",
    phone: "+91 90990 97329",
    degree: "MBBS, MS (Ortho)",
    tags: [
      "Joint Replacement",
      "Fractures",
      "Spine Surgery",
      "Arthritis",
      "Sports Injury",
    ],
    edu: [
      { d: "MBBS – PDU Medical College, Churu", y: "2003" },
      { d: "MS Orthopedics – SMS Medical College", y: "2007" },
    ],
    slots: ["11:00", "12:00", "2:00", "3:00"],
    availability: true,
    isHead: true,
    img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face",
  },
  {
    _id: "s4",
    name: "Dr. Anita Joshi",
    spec: "Paediatrics & Neonatology",
    department: "Pediatrics",
    experience: 12,
    avail: "Mon–Sat · 9 AM – 12 PM",
    hospital: " Bhartiya Hospital",
    loc: "Churu, Rajasthan",
    fee: null,
    rating: 4.9,
    ratingCount: 280,
    patients: "7,100+",
    phone: "+91 90990 97329",
    degree: "MBBS, MD (Paediatrics)",
    tags: [
      "Vaccination",
      "Newborn Care",
      "Fever",
      "Asthma",
      "Nutrition",
      "SNCU",
    ],
    edu: [
      { d: "MBBS – PDU Medical College, Churu", y: "2009" },
      { d: "MD Paediatrics – AIIMS, Jodhpur", y: "2013" },
    ],
    slots: ["9:00", "10:00", "11:00"],
    availability: true,
    isHead: false,
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
  },
  {
    _id: "s5",
    name: "Dr. Vikram Singh",
    spec: "Cardiology",
    department: "Cardiology",
    experience: 14,
    avail: "Mon, Wed, Fri · 10 AM – 2 PM",
    hospital: " Bhartiya Hospital",
    loc: "Churu, Rajasthan",
    fee: null,
    rating: 4.8,
    ratingCount: 176,
    patients: "4,900+",
    phone: "+91 90990 97329",
    degree: "MBBS, MD, DM (Cardiology)",
    tags: ["Heart Failure", "Hypertension", "ECG", "Angioplasty", "Arrhythmia"],
    edu: [
      { d: "MBBS – SMS Medical College, Jaipur", y: "2007" },
      { d: "DM Cardiology – PGI Chandigarh", y: "2014" },
    ],
    slots: ["10:00", "11:00", "12:00", "1:00"],
    availability: true,
    isHead: true,
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
  },
  {
    _id: "s6",
    name: "Dr. Meena Gupta",
    spec: "Neurology",
    department: "Neurology",
    experience: 11,
    avail: "Tue & Thu · 2 PM – 6 PM",
    hospital: " Bhartiya Hospital",
    loc: "Churu, Rajasthan",
    fee: null,
    rating: 4.7,
    ratingCount: 142,
    patients: "3,600+",
    phone: "+91 90990 97329",
    degree: "MBBS, MD, DM (Neurology)",
    tags: ["Epilepsy", "Migraine", "Stroke", "Parkinson's", "Vertigo"],
    edu: [
      { d: "MBBS – PDU Medical College, Churu", y: "2010" },
      { d: "DM Neurology – NIMHANS Bangalore", y: "2016" },
    ],
    slots: ["2:00", "3:00", "4:00", "5:00"],
    availability: true,
    isHead: false,
    img: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=face",
  },
  {
    _id: "s7",
    name: "Dr. Ramesh Bohra",
    spec: "ENT Specialist",
    department: "ENT",
    experience: 9,
    avail: "Mon–Sat · 8 AM – 12 PM",
    hospital: " Bhartiya Hospital",
    loc: "Churu, Rajasthan",
    fee: null,
    rating: 4.6,
    ratingCount: 118,
    patients: "3,100+",
    phone: "+91 90990 97329",
    degree: "MBBS, MS (ENT)",
    tags: [
      "Sinusitis",
      "Hearing Loss",
      "Tonsillitis",
      "Nasal Polyps",
      "Vertigo",
    ],
    edu: [
      { d: "MBBS – PDU Medical College, Churu", y: "2012" },
      { d: "MS ENT – SMS Medical College, Jaipur", y: "2016" },
    ],
    slots: ["8:00", "9:00", "10:00", "11:00"],
    availability: true,
    isHead: false,
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
  },
];

const DEPARTMENTS = [
  "All",
  "General Medicine",
  "Gynecology",
  "Orthopedics",
  "Pediatrics",
  "Cardiology",
  "Neurology",
  "ENT",
  "Ophthalmology",
  "Dermatology",
];

// ── Helpers ────────────────────────────────────────────────────────
function getInitials(name) {
  return name
    .split(" ")
    .filter((_, i) => i > 0)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

function normaliseDoctor(d) {
  return {
    _id: d._id,
    name: d.name,
    spec: d.spec || d.specialty || d.department || "Doctor",
    department: d.department || "",
    experience: d.experience || 0,
    avail:
      d.avail || d.availability ? "Available Today" : "Check with hospital",
    hospital: d.hospital || " Bhartiya Hospital",
    loc: d.loc || "Churu, Rajasthan",
    fee: null,
    rating: d.rating || 4.5,
    ratingCount: d.ratingCount || 0,
    patients: d.patients || `${(d.ratingCount || 0) * 12}+`,
    phone: d.phone || "+91 90990 97329",
    degree: d.degree || d.qualification || "MBBS",
    tags: d.tags || [d.department].filter(Boolean),
    edu: d.edu || [],
    slots: d.slots || ["10:00", "11:00", "12:00", "2:00"],
    availability: d.availability !== false,
    isHead: d.isHead || false,
    img: d.img || d.photo || null,
  };
}

// ── Doctor Card ────────────────────────────────────────────────────
function DoctorCard({ doc, onView }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(13,107,200,0.12)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col"
    >
      {/* Photo */}
      <div className="w-full h-44 bg-blue-50 flex items-center justify-center overflow-hidden relative">
        {!imgErr && doc.img ? (
          <img
            src={doc.img}
            alt={doc.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl font-bold text-blue-700">
            {getInitials(doc.name)}
          </span>
        )}
        {doc.isHead && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Dept. Head
          </span>
        )}
        {!doc.availability && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Unavailable
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="font-bold text-gray-900 text-[15px] leading-snug">
          {doc.name}
        </p>
        <p className="text-xs font-semibold text-blue-600">{doc.spec}</p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-gray-700">{doc.rating}</span>
          <span className="text-xs text-gray-400">
            ({doc.ratingCount} reviews)
          </span>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <InfoRow icon={<Clock size={12} />}>{doc.avail}</InfoRow>
          <InfoRow icon={<Building2 size={12} />}>{doc.hospital}</InfoRow>
          <InfoRow icon={<MapPin size={12} />}>{doc.loc}</InfoRow>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end px-4 py-3 border-t border-blue-50 bg-blue-50/40">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onView(doc)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          View Details →
        </motion.button>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, children }) {
  return (
    <div className="flex items-start gap-2 text-xs text-gray-500">
      <span className="text-blue-400 mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

// ── Detail Page ────────────────────────────────────────────────────
function DetailPage({ doc, onBack, onBook }) {
  const [imgErr, setImgErr] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingDone, setRatingDone] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  function handleBook() {
    onBook({ department: doc.department, doctorName: doc.name, time: selectedSlot });
  }

  async function handleRate(val) {
    setRating(val);
    try {
      await doctorAPI.rate(doc._id, { rating: val });
    } catch {
      /* fallback ok */
    }
    setRatingDone(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-blue-100 px-4 py-3 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={18} /> Back to Doctors
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-16 flex flex-col gap-4">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-blue-100 overflow-hidden"
        >
          <div className="p-5 flex gap-4 items-start flex-wrap">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 bg-blue-50 flex items-center justify-center shrink-0">
              {!imgErr && doc.img ? (
                <img
                  src={doc.img}
                  alt={doc.name}
                  onError={() => setImgErr(true)}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-3xl font-bold text-blue-700">
                  {getInitials(doc.name)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{doc.name}</h2>
              <p className="text-xs font-semibold text-blue-600 mb-3">
                {doc.spec} · {doc.degree}
              </p>
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge color="blue">{doc.experience} Yrs Experience</Badge>
                <Badge color="amber">
                  <Star
                    size={10}
                    className="inline mr-0.5 fill-amber-500 text-amber-500"
                  />
                  {doc.rating}
                </Badge>
                {doc.isHead && <Badge color="purple">Dept. Head</Badge>}
                {doc.availability ? (
                  <Badge color="green">Available Today</Badge>
                ) : (
                  <Badge color="red">Not Available</Badge>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleBook}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Book Appointment
                </motion.button>
                <a
                  href={`tel:${doc.phone}`}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors no-underline"
                >
                  <Phone size={14} /> Call
                </a>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 divide-x divide-blue-50 border-t border-blue-50">
            {[
              {
                icon: <Users size={14} />,
                label: "Patients",
                val: doc.patients,
              },
              {
                icon: <Stethoscope size={14} />,
                label: "Experience",
                val: `${doc.experience} Yrs`,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center py-3 gap-0.5"
              >
                <span className="text-blue-500">{s.icon}</span>
                <span className="text-xs text-gray-400">{s.label}</span>
                <span className="text-sm font-bold text-gray-800">{s.val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Clinic Details */}
        <InfoSection title="Clinic Details" delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { l: "Hospital", v: doc.hospital },
              { l: "Location", v: doc.loc },
              { l: "Timing", v: doc.avail },
              { l: "Phone", v: doc.phone, green: true },
            ].map((r) => (
              <div key={r.l}>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                  {r.l}
                </p>
                <p
                  className={`text-sm font-medium ${r.green ? "text-blue-600" : "text-gray-800"}`}
                >
                  {r.v}
                </p>
              </div>
            ))}
          </div>
        </InfoSection>

        {/* Expertise */}
        {doc.tags.length > 0 && (
          <InfoSection title="Expertise" delay={0.15}>
            <div className="flex flex-wrap gap-2">
              {doc.tags.map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-1 text-xs text-blue-700 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </InfoSection>
        )}

        {/* Education */}
        {doc.edu.length > 0 && (
          <InfoSection title="Education" delay={0.2}>
            {doc.edu.map((e, i) => (
              <div
                key={i}
                className="flex gap-3 py-2.5 border-b border-blue-50 last:border-0"
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="text-sm text-gray-800">{e.d}</p>
                  <p className="text-xs font-semibold text-blue-500">{e.y}</p>
                </div>
              </div>
            ))}
          </InfoSection>
        )}

        {/* Time Slots */}
        <InfoSection title="Available Slots — Today" delay={0.25}>
          <div className="flex flex-wrap gap-2">
            {doc.slots.map((s) => {
              const sel = selectedSlot === s;
              return (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedSlot(sel ? null : s)}
                  className={`border-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    sel
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-blue-500 text-blue-600 bg-white hover:bg-blue-50"
                  }`}
                >
                  {s}
                </motion.button>
              );
            })}
          </div>
          {selectedSlot && (
            <p className="text-xs text-blue-600 font-semibold mt-2">
              Selected: {selectedSlot} — click "Book Appointment" above
            </p>
          )}
        </InfoSection>

        {/* Rate Doctor */}
        <InfoSection title="Rate this Doctor" delay={0.3}>
          {ratingDone ? (
            <p className="text-sm text-blue-600 font-semibold">
              ✓ Thanks for your rating!
            </p>
          ) : (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => handleRate(v)}
                  className={`transition-transform hover:scale-125 ${v <= rating ? "text-amber-400" : "text-gray-300"}`}
                >
                  <Star
                    size={24}
                    className={v <= rating ? "fill-amber-400" : ""}
                  />
                </button>
              ))}
              <span className="text-xs text-gray-400 ml-1">Tap to rate</span>
            </div>
          )}
        </InfoSection>

        {/* Emergency */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-4"
        >
          <AlertCircle className="text-red-500 shrink-0" size={22} />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Emergency Helpline</p>
            <p className="text-xl font-bold text-red-600">
              102 &nbsp;|&nbsp; 108
            </p>
            <p className="text-xs text-gray-500">
              {doc.hospital} · {doc.phone}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoSection({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-blue-100 overflow-hidden"
    >
      <div className="px-5 pt-4 pb-1">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">
          {title}
        </p>
        {children}
      </div>
      <div className="h-4" />
    </motion.div>
  );
}

function Badge({ color, children }) {
  const s = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <span
      className={`text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${s[color] || s.blue}`}
    >
      {children}
    </span>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function FindDoctor() {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState(STATIC_DOCTORS);
  const [filtered, setFiltered] = useState(STATIC_DOCTORS);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [availOnly, setAvailOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  function handleBook({ department, doctorName, time }) {
    const params = new URLSearchParams({
      department: department || '',
      doctorName: doctorName || '',
      ...(time ? { time } : {}),
    });
    navigate(`/patient/book-appointment?${params.toString()}`);
  }

  // Fetch from backend; fallback to static
  useEffect(() => {
    doctorAPI
      .getAll()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllDoctors(data.map(normaliseDoctor));
        }
      })
      .catch(() => {
        /* keep static data */
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter + sort
  useEffect(() => {
    let d = [...allDoctors];
    if (search)
      d = d.filter(
        (doc) =>
          doc.name.toLowerCase().includes(search.toLowerCase()) ||
          doc.spec.toLowerCase().includes(search.toLowerCase()) ||
          doc.department.toLowerCase().includes(search.toLowerCase()),
      );
    if (dept !== "All") d = d.filter((doc) => doc.department === dept);
    if (availOnly) d = d.filter((doc) => doc.availability);
    if (sortBy === "rating") d.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "exp") d.sort((a, b) => b.experience - a.experience);
    else if (sortBy === "fee")
      d.sort((a, b) => parseInt(a.fee) - parseInt(b.fee));
    setFiltered(d);
  }, [search, dept, availOnly, sortBy, allDoctors]);

  // Detail view
  if (selected) {
    return <DetailPage doc={selected} onBack={() => setSelected(null)} onBook={handleBook} />;
  }

  // List view
  return (
    <div className="min-h-screen bg-hospital-bg">
      <Navbar showMenu={false} />

      {/* Header */}
      <div className="page-header text-white text-center px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">🏥 Find a Doctor</h1>
        <p className="text-sm opacity-80">
          Bhartiya Hospital, Churu &nbsp;|&nbsp; OPD: 8 AM – 10 PM
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, specialty or department..."
              className="input-field pl-10"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500 shrink-0">
              <Filter size={12} /> Department:
            </span>
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  dept === d ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={availOnly} onChange={(e) => setAvailOnly(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <span className="text-sm text-gray-600">Available today only</span>
            </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-field w-auto text-xs py-2">
              <option value="rating">Sort: Top Rated</option>
              <option value="exp">Sort: Most Experienced</option>
            </select>
          </div>
        </div>

        <p className="text-sm font-semibold text-gray-500 mb-4">{filtered.length} doctors found</p>

        {loading ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {[...Array(6)].map((_, i) => <SkeletonDoctorCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No doctors found</p>
            <p className="text-sm mt-1">Try adjusting filters</p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {filtered.map((doc) => (
              <DoctorCard key={doc._id} doc={doc} onView={setSelected} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
