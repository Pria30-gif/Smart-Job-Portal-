<<<<<<< HEAD
import React, { useState, useRef, useCallback } from "react";

const validators = {
  fullName: (v) => {
    if (!v.trim()) return "Full name is required";
    if (!/^[A-Za-z\s]+$/.test(v)) return "Only alphabets allowed";
    if (v.trim().length < 2) return "Name must be at least 2 characters";
    return null;
  },
  jobTitle: (v) => {
    if (!v.trim()) return "Job title is required";
    if (!/^[A-Za-z\s]+$/.test(v)) return "Only alphabets allowed";
    return null;
  },
  email: (v) => {
    if (!v.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email";
    return null;
  },
  phone: (v) => {
    if (!v.trim()) return "Phone number is required";
    if (!/^\+?[0-9]{10,15}$/.test(v)) return "Enter valid phone number";
    return null;
  },
  location: (v) => {
    if (!v.trim()) return "Location is required";
    if (!/^[A-Za-z\s,]+$/.test(v)) return "Only alphabets allowed";
    return null;
  },
  summary: (v) => {
    if (!v.trim()) return "Summary is required";
    if (v.trim().length < 30) return "Summary should be at least 30 characters";
    return null;
  },
};

const validateExp = (exp) => {
  const errs = {};
  if (!exp.title.trim()) errs.title = "Job title required";
  if (!exp.company.trim()) errs.company = "Company required";
  if (!exp.date.trim()) errs.date = "Date range required";
  if (!exp.desc.trim()) errs.desc = "Description required";
  return errs;
};

const css = {
  teal: "#0ea5a0",
  tealLight: "#e6faf9",
  coral: "#f05a38",
  violet: "#6c4fe0",
  white: "#ffffff",
  slate: "#374151",
  slateLight: "#6b7280",
  border: "#e5e7eb",
  borderFocus: "#0ea5a0",
  errorBg: "#fff5f5",
  errorBorder: "#fc8181",
  errorText: "#c53030",
};

const FieldInput = ({ label, id, type = "text", value, onChange, error, placeholder, multiline, rows = 3 }) => {
  const base = {
    width: "100%",
    padding: "8px 11px",
    borderRadius: 7,
    border: `1.5px solid ${error ? css.errorBorder : "#d1d5db"}`,
    background: error ? css.errorBg : css.white,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: css.slate,
    outline: "none",
    transition: "border 0.18s, box-shadow 0.18s",
    resize: "vertical",
    lineHeight: 1.55,
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: css.slateLight,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea id={id} value={value} onChange={onChange} rows={rows} placeholder={placeholder} style={base} />
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} style={base} />
      )}
      {error && (
        <p style={{ fontSize: 11, color: css.errorText, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 13 }}>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

const SectionLabel = ({ children, accent = css.teal }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 10px" }}>
    <span style={{ width: 3, height: 14, background: accent, borderRadius: 2, flexShrink: 0 }} />
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: accent,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {children}
    </span>
    <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}33, transparent)` }} />
  </div>
);

const TemplateNexus = ({ data }) => (
  <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
    <div
      style={{
        background: "linear-gradient(135deg, #0d1f3c 0%, #1a3a5c 100%)",
        padding: "28px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "rgba(14,165,160,0.12)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -40, left: 60, width: 120, height: 120, background: "rgba(108,79,224,0.12)", borderRadius: "50%" }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: 1, lineHeight: 1.1, fontFamily: "'Syne', sans-serif" }}>
          {data.fullName.split(" ")[0]} <span style={{ color: "#0ea5a0" }}>{data.fullName.split(" ").slice(1).join(" ")}</span>
        </div>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#0ea5a0", letterSpacing: 3, textTransform: "uppercase", marginTop: 5 }}>
          {data.jobTitle}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
          {[data.email, data.phone, data.location].filter(Boolean).map((c, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'DM Mono', monospace",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span style={{ width: 4, height: 4, background: "#0ea5a0", borderRadius: "50%", flexShrink: 0 }} />{c}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr" }}>
      <div style={{ padding: "20px 20px", borderRight: "1px solid #f0f0f0" }}>
        <SectionLabel accent="#0ea5a0">Profile</SectionLabel>
        <p style={{ fontSize: 11, color: "#555", lineHeight: 1.65, marginBottom: 16 }}>{data.summary}</p>
        <SectionLabel accent="#0ea5a0">Education</SectionLabel>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{data.education.degree}</div>
          <div style={{ fontSize: 10, color: "#0ea5a0", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{data.education.institution}</div>
          <div style={{ fontSize: 10, color: "#888", fontFamily: "'DM Mono', monospace" }}>{data.education.year}</div>
        </div>
        <SectionLabel accent="#0ea5a0">Skills</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {data.skills.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
                padding: "3px 8px",
                borderRadius: 3,
                background: "#e6faf9",
                border: "1px solid #b2ecea",
                color: "#0a7370",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: "20px 22px" }}>
        <SectionLabel accent="#0ea5a0">Experience</SectionLabel>
        {data.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < data.experience.length - 1 ? "1px solid #f3f4f6" : "none" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{e.title}</div>
            <div style={{ fontSize: 10, color: "#0ea5a0", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{e.company}</div>
            <div style={{ fontSize: 9, color: "#aaa", fontFamily: "'DM Mono', monospace" }}>{e.date}</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 5, lineHeight: 1.55 }}>{e.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TemplateCipher = ({ data }) => {
  const initials = data.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
      <div
        style={{
          background: "linear-gradient(100deg, #f8f0ff 0%, #ede8ff 100%)",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          borderBottom: "2px solid #d8ceff",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6c4fe0, #9b87f5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Syne', sans-serif" }}>{data.fullName}</div>
          <div style={{ fontSize: 11, color: "#6c4fe0", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginTop: 3 }}>{data.jobTitle}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {[data.email, data.phone, data.location].filter(Boolean).map((c, i) => (
              <span
                key={i}
                style={{
                  fontSize: 9,
                  fontFamily: "'DM Mono', monospace",
                  color: "#6c4fe0",
                  background: "rgba(108,79,224,0.1)",
                  border: "1px solid rgba(108,79,224,0.2)",
                  padding: "2px 8px",
                  borderRadius: 3,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #f3f0ff" }}>
          <SectionLabel accent="#6c4fe0">Profile</SectionLabel>
          <p style={{ fontSize: 11, color: "#555", lineHeight: 1.65 }}>{data.summary}</p>
        </div>
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #f3f0ff" }}>
          <SectionLabel accent="#6c4fe0">Experience</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {data.experience.map((e, i) => (
              <div key={i} style={{ padding: "10px 12px", background: "#f8f5ff", borderRadius: 8, border: "1px solid #e8e0ff" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{e.title}</div>
                <div style={{ fontSize: 10, color: "#6c4fe0", fontFamily: "'DM Mono', monospace" }}>{e.company} · {e.date}</div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 5, lineHeight: 1.5 }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div style={{ padding: "16px 28px", borderRight: "1px solid #f3f0ff" }}>
            <SectionLabel accent="#6c4fe0">Education</SectionLabel>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{data.education.degree}</div>
            <div style={{ fontSize: 10, color: "#6c4fe0", fontFamily: "'DM Mono', monospace" }}>{data.education.institution} · {data.education.year}</div>
          </div>
          <div style={{ padding: "16px 28px" }}>
            <SectionLabel accent="#6c4fe0">Skills</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {data.skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 9,
                    fontFamily: "'DM Mono', monospace",
                    padding: "3px 8px",
                    borderRadius: 3,
                    background: "#f0edff",
                    border: "1px solid #d8ceff",
                    color: "#4a33b0",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateSolar = ({ data }) => {
  const bars = [88, 92, 78, 72, 68, 83, 75, 70, 85, 80];
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)",
          padding: "28px 32px",
          borderBottom: "2px solid rgba(240,90,56,0.35)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: -60, top: -60, width: 250, height: 250, background: "radial-gradient(circle, rgba(240,90,56,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: 1 }}>
            {data.fullName.split(" ")[0]} <span style={{ color: "#f05a38" }}>{data.fullName.split(" ").slice(1).join(" ")}</span>
          </div>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#f05a38", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>{data.jobTitle}</div>
          <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
            {[data.email, data.phone, data.location].filter(Boolean).map((c, i) => (
              <span key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 4, height: 4, background: "#f05a38", borderRadius: "50%" }} />{c}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
        <div style={{ background: "#fff8f6", borderRight: "1px solid #fde0d8", padding: "20px 16px" }}>
          <SectionLabel accent="#f05a38">Skills</SectionLabel>
          {data.skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#555", marginBottom: 3 }}>{s}</div>
              <div style={{ height: 3, background: "#fde0d8", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${bars[i % bars.length]}%`, background: "linear-gradient(90deg, #f05a38, #ff8c6b)", borderRadius: 2 }} />
              </div>
            </div>
          ))}
          <SectionLabel accent="#f05a38">Education</SectionLabel>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e" }}>{data.education.degree}</div>
          <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#f05a38", marginTop: 2 }}>{data.education.institution}</div>
          <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#aaa" }}>{data.education.year}</div>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <SectionLabel accent="#f05a38">Profile</SectionLabel>
          <p style={{ fontSize: 11, color: "#555", lineHeight: 1.65, marginBottom: 16 }}>{data.summary}</p>
          <SectionLabel accent="#f05a38">Experience</SectionLabel>
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < data.experience.length - 1 ? "1px solid #fde8e4" : "none" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e" }}>{e.title}</div>
              <div style={{ fontSize: 10, color: "#f05a38", fontFamily: "'DM Mono', monospace" }}>{e.company}</div>
              <div style={{ fontSize: 9, color: "#aaa", fontFamily: "'DM Mono', monospace" }}>{e.date}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 4, lineHeight: 1.55 }}>{e.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  const [activeTemplate, setActiveTemplate] = useState("nexus");
  const [touched, setTouched] = useState({});
  const [expErrors, setExpErrors] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillError, setSkillError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const previewRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "Priya Bugade",
    jobTitle: "Full Stack Developer",
    email: "priya.bugade@example.com",
    phone: "+91 123-456-7890",
    location: "Mumbai, India",
    summary:
      "A highly motivated Full Stack Developer with 5+ years of experience building scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies.",
    education: { degree: "B.Tech in Computer Science", institution: "IIT Delhi", year: "2014 – 2018" },
    experience: [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        date: "Jan 2021 – Present",
        desc: "Led development of a new e-commerce platform, improving performance by 30%. Mentored junior developers and conducted code reviews.",
      },
      {
        id: 2,
        title: "Software Developer",
        company: "Web Innovators",
        date: "Jun 2018 – Dec 2020",
        desc: "Developed and maintained client-side features for various web applications using React and Redux.",
      },
    ],
    skills: ["JavaScript (ES6+)", "React", "Node.js", "Express", "MongoDB", "AWS", "Docker"],
  });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const setEdu = (key, val) => setForm((prev) => ({ ...prev, education: { ...prev.education, [key]: val } }));
  const touch = (key) => setTouched((prev) => ({ ...prev, [key]: true }));
  const fieldErr = (key) => (touched[key] || submitted) && validators[key] ? validators[key](form[key]) : null;

  const updateExp = (idx, key, val) => {
    const updated = form.experience.map((item, i) => (i === idx ? { ...item, [key]: val } : item));
    setForm((prev) => ({ ...prev, experience: updated }));
    const newErrs = [...expErrors];
    newErrs[idx] = { ...newErrs[idx], [key]: validateExp({ ...form.experience[idx], [key]: val })[key] };
    setExpErrors(newErrs);
  };

  const touchExp = (idx, key) => {
    const newErrs = [...expErrors];
    if (!newErrs[idx]) newErrs[idx] = {};
    newErrs[idx][key] = validateExp(form.experience[idx])[key];
    setExpErrors(newErrs);
  };

  const addExp = () => {
    setForm((prev) => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), title: "", company: "", date: "", desc: "" }],
    }));
    setExpErrors((prev) => [...prev, {}]);
  };

  const removeExp = (idx) => {
    setForm((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
    setExpErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) {
      setSkillError("Enter a skill");
      return;
    }
    if (form.skills.includes(val)) {
      setSkillError("Skill already added");
      return;
    }
    setForm((prev) => ({ ...prev, skills: [...prev.skills, val] }));
    setSkillInput("");
    setSkillError("");
  };

  const removeSkill = (index) => setForm((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));

  const validateAll = useCallback(() => {
    const baseErrs = Object.keys(validators).some((key) => validators[key](form[key]));
    const expErrs = form.experience.some((item) => Object.keys(validateExp(item)).length > 0);
    if (form.skills.length === 0) return false;
    return !baseErrs && !expErrs;
  }, [form]);

  const handleExport = () => {
    setSubmitted(true);
    const allTouched = {};
    Object.keys(validators).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    setExpErrors(form.experience.map((item) => validateExp(item)));
    if (!validateAll()) return;

    const el = previewRef.current;
    if (!el) return;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${form.fullName} – Resume</title>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap" rel="stylesheet">
      <style>body{margin:0;padding:20px;background:#fff;font-family:'DM Sans',sans-serif;} @media print{body{padding:0}}</style>
    </head><body>
      ${el.innerHTML}
      <script>window.onload=()=>window.print()</script>
    </body></html>`);
    w.document.close();
  };

  const templates = { nexus: TemplateNexus, cipher: TemplateCipher, solar: TemplateSolar };
  const TemplateComp = templates[activeTemplate];
  const templateAccents = { nexus: css.teal, cipher: css.violet, solar: css.coral };
  const accent = templateAccents[activeTemplate];

  const tplOptions = [
    { id: "nexus", label: "NEXUS", desc: "Teal + Dark" },
    { id: "cipher", label: "CIPHER", desc: "Violet" },
    { id: "solar", label: "SOLAR", desc: "Coral" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f7fa; }
        .rb-input {
          width: 100%; padding: 8px 11px; border-radius: 7px;
          border: 1.5px solid #d1d5db; background: #fff;
          font-size: 13px; font-family: 'DM Sans', sans-serif; color: #374151;
          outline: none; transition: border 0.18s, box-shadow 0.18s;
        }
        .rb-input:focus { border-color: var(--accent, #0ea5a0); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #0ea5a0) 12%, transparent); }
        .rb-input.err { border-color: #fc8181; background: #fff5f5; }
        .rb-textarea { resize: vertical; line-height: 1.55; }
        .skill-tag {
          font-family: 'DM Mono', monospace; font-size: 10px; padding: 3px 9px;
          border-radius: 4px; display: inline-flex; align-items: center; gap: 5px; cursor: pointer;
          transition: opacity 0.15s;
        }
        .skill-tag:hover { opacity: 0.75; }
        .tpl-btn {
          flex: 1; padding: 9px 4px; border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; cursor: pointer; transition: all 0.18s; text-align: center;
          font-family: 'DM Mono', monospace;
        }
        .tpl-btn:hover { border-color: var(--btn-accent); }
        .tpl-btn.active { border-color: var(--btn-accent); background: color-mix(in srgb, var(--btn-accent) 8%, #fff); }
        .exp-card { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 12px; margin-bottom: 8px; }
        .dl-btn {
          width: 100%; padding: 12px; border-radius: 9px;
          border: none; cursor: pointer; font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: #fff; transition: opacity 0.2s, transform 0.15s;
        }
        .dl-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .dl-btn:active { transform: translateY(0); }
        .card-wrap {
          transform-style: preserve-3d;
          animation: float3d 9s ease-in-out infinite;
          border-radius: 12px;
          box-shadow: 0 32px 64px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        @keyframes float3d {
          0%,100% { transform: rotateX(1.5deg) rotateY(-1deg) translateY(0px); }
          33% { transform: rotateX(-1deg) rotateY(1.5deg) translateY(-5px); }
          66% { transform: rotateX(1deg) rotateY(-1.5deg) translateY(-3px); }
        }
        .preview-zone { perspective: 1200px; }
        .preview-zone:hover .card-wrap { animation: none; transition: transform 0.12s; }
        .err-msg { font-size: 11px; color: #c53030; margin-top: 3px; display: flex; align-items: center; gap: 4px; }
        scrollbar-width: thin;
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #f5f7fa 50%, #fff8f6 100%)", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${accent}, ${accent}99)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>R</span>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: "#1a1a2e", letterSpacing: 0.5 }}>ResumeOS</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#9ca3af", letterSpacing: 1 }}>v3.0</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#6b7280" }}>LIVE PREVIEW</span>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px", display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Template</div>
              <div style={{ display: "flex", gap: 6, "--btn-accent": accent }}>
                {tplOptions.map((template) => (
                  <button
                    key={template.id}
                    className={`tpl-btn ${activeTemplate === template.id ? "active" : ""}`}
                    style={{ "--btn-accent": templateAccents[template.id] }}
                    onClick={() => setActiveTemplate(template.id)}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: activeTemplate === template.id ? templateAccents[template.id] : "#374151" }}>{template.label}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>{template.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: "14px 16px", maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}>
              <SectionLabel accent={accent}>Identity</SectionLabel>
              <FieldInput label="Full Name *" id="fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} error={fieldErr("fullName")} placeholder="Jane Smith" />
              <FieldInput label="Job Title *" id="jobTitle" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} error={fieldErr("jobTitle")} placeholder="Product Designer" />
              <FieldInput label="Email *" id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={fieldErr("email")} placeholder="jane@example.com" />
              <FieldInput label="Phone *" id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} error={fieldErr("phone")} placeholder="+91 9876543210" />
              <FieldInput label="Location *" id="location" value={form.location} onChange={(e) => set("location", e.target.value)} error={fieldErr("location")} placeholder="Mumbai, India" />
              <SectionLabel accent={accent}>Summary</SectionLabel>
              <FieldInput label="Professional Summary *" id="summary" multiline rows={4} value={form.summary} onChange={(e) => set("summary", e.target.value)} error={fieldErr("summary")} placeholder="Write a compelling professional summary..." />
              <SectionLabel accent={accent}>Education</SectionLabel>
              {[["degree", "Degree *", "B.Tech in Computer Science"], ["institution", "Institution *", "IIT Delhi"], ["year", "Year", "2014 – 2018"]].map(([key, label, placeholder]) => (
                <FieldInput key={key} label={label} id={key} value={form.education[key]} onChange={(e) => setEdu(key, e.target.value)} placeholder={placeholder} />
              ))}
              <SectionLabel accent={accent}>Experience</SectionLabel>
              {form.experience.map((exp, idx) => {
                const ee = expErrors[idx] || {};
                return (
                  <div key={exp.id} className="exp-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#9ca3af", letterSpacing: 1 }}>POSITION {idx + 1}</span>
                      {form.experience.length > 1 && (
                        <button onClick={() => removeExp(idx)} style={{ background: "none", border: "none", color: "#f05a38", fontSize: 16, cursor: "pointer", lineHeight: 1 }}>✕</button>
                      )}
                    </div>
                    {[ ["title", "Job Title", "Senior Engineer"], ["company", "Company", "Acme Corp"], ["date", "Date Range", "Jan 2021 – Present"] ].map(([key, label, placeholder]) => (
                      <FieldInput
                        key={key}
                        label={label}
                        id={`${key}-${idx}`}
                        value={exp[key]}
                        onChange={(e) => updateExp(idx, key, e.target.value)}
                        error={(submitted || ee[key]) && ee[key] ? ee[key] : null}
                        placeholder={placeholder}
                      />
                    ))}
                    <FieldInput
                      label="Description"
                      id={`desc-${idx}`}
                      value={exp.desc}
                      onChange={(e) => updateExp(idx, "desc", e.target.value)}
                      error={(submitted || ee.desc) && ee.desc ? ee.desc : null}
                      multiline
                      rows={2}
                      placeholder="Describe your impact..."
                    />
                  </div>
                );
              })}
              <button onClick={addExp} style={{ width: "100%", padding: "7px", background: "transparent", border: `1.5px dashed ${accent}55`, borderRadius: 7, color: accent, fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", letterSpacing: 1, transition: "all 0.18s" }}>
                + ADD POSITION
              </button>
              <SectionLabel accent={accent}>Skills</SectionLabel>
              {form.skills.length === 0 && submitted && (
                <p className="err-msg" style={{ marginBottom: 8 }}><span>⚠</span>At least one skill is required</p>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                {form.skills.map((skill, idx) => {
                  const colors = {
                    nexus: { bg: "#e6faf9", border: "#b2ecea", text: "#0a7370" },
                    cipher: { bg: "#f0edff", border: "#d8ceff", text: "#4a33b0" },
                    solar: { bg: "#fff1ed", border: "#fdc4b2", text: "#a8391e" },
                  }[activeTemplate];
                  return (
                    <span key={idx} className="skill-tag" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }} onClick={() => removeSkill(idx)}>
                      {skill} <span style={{ color: "#f05a38", fontWeight: 700 }}>×</span>
                    </span>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  className={`rb-input${skillError ? " err" : ""}`}
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    setSkillError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add skill, press Enter"
                  style={{ "--accent": accent }}
                />
                <button onClick={addSkill} style={{ padding: "0 14px", borderRadius: 7, border: `1.5px solid ${accent}`, background: `${accent}15`, color: accent, fontWeight: 700, fontSize: 18, cursor: "pointer", flexShrink: 0, transition: "all 0.18s" }}>
                  +
                </button>
              </div>
              {skillError && <p className="err-msg"><span>⚠</span>{skillError}</p>}
              <button className="dl-btn" onClick={handleExport} style={{ marginTop: 16, background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                ⬇ Export Resume
              </button>
            </div>
          </div>

          <div className="preview-zone" style={{ position: "sticky", top: 80 }}
            onMouseMove={(event) => {
              const el = event.currentTarget.querySelector(".card-wrap");
              if (!el) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              const mx = (event.clientX - cx) / (rect.width / 2);
              const my = (event.clientY - cy) / (rect.height / 2);
              el.style.transform = `rotateY(${mx * 7}deg) rotateX(${-my * 4}deg) translateZ(8px)`;
            }}
            onMouseLeave={(event) => {
              const el = event.currentTarget.querySelector(".card-wrap");
              if (el) {
                el.style.transform = "";
                el.style.animation = "float3d 9s ease-in-out infinite";
              }
            }}
          >
            <div className="card-wrap" ref={previewRef}>
              <TemplateComp data={form} />
            </div>
            <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#9ca3af", letterSpacing: 1 }}>
              ↕ MOVE MOUSE OVER CARD FOR 3D EFFECT
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
=======
import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


// Import the template components
import TemplateModern from './resume-templates/TemplateModern';
import TemplateClassic from './resume-templates/TemplateClassic';
import TemplateCreative from './resume-templates/TemplateCreative';

const ResumeBuilder = () => {
  // State to hold all resume data with professional examples
  const [resumeData, setResumeData] = useState({
    fullName: 'Priya Sharma',
    jobTitle: 'Full Stack Developer',
    email: 'priya.sharma@example.com',
    phoneNumber: '+91 123-456-7890',
    address: 'Mumbai, India',
    summary: 'A highly motivated and results-oriented Full Stack Developer with 5+ years of experience in building and maintaining scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies.',
    experience: [
      {
        id: 1,
        title: 'Senior Software Engineer',
        company: 'Tech Solutions Inc.',
        location: 'Bengaluru, India',
        date: 'Jan 2021 - Present',
        description: 'Led the development of a new e-commerce platform, improving performance by 30%. Mentored junior developers and conducted code reviews.'
      },
      {
        id: 2,
        title: 'Software Developer',
        company: 'Web Innovators',
        location: 'Pune, India',
        date: 'Jun 2018 - Dec 2020',
        description: 'Developed and maintained client-side features for various web applications using React and Redux.'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Technology in Computer Science',
        institution: 'Indian Institute of Technology, Delhi',
        date: '2014 - 2018'
      }
    ],
    skills: ['JavaScript (ES6+)', 'React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Docker']
  });

  // State to manage the selected template
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const resumePreviewRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDownloadPDF = async () => {
    const input = resumePreviewRef.current;
    if (!input) return;

    // Use html2canvas to render the component as a canvas
    const canvas = await html2canvas(input, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${resumeData.fullName.replace(' ', '_')}_Resume.pdf`);
  };


  const templates = {
    modern: <TemplateModern data={resumeData} />,
    classic: <TemplateClassic data={resumeData} />,
    creative: <TemplateCreative data={resumeData} />,
  };
  
  const templateOptions = [
      { id: 'modern', name: 'Modern' },
      { id: 'classic', name: 'Classic' },
      { id: 'creative', name: 'Creative' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Resume Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullName" value={resumeData.fullName} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input type="text" name="jobTitle" value={resumeData.jobTitle} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={resumeData.email} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" name="phoneNumber" value={resumeData.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
              <textarea name="summary" value={resumeData.summary} onChange={handleInputChange} rows="4" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            {/* You can add more form fields here for experience, education, skills etc. */}
          </div>
        </div>

        {/* Right Column: Template Selection & Preview */}
        <div className="lg:col-span-2">
           <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Choose a Template</h3>
                <div className="flex flex-wrap gap-3">
                    {templateOptions.map(opt => (
                         <button 
                            key={opt.id}
                            onClick={() => setSelectedTemplate(opt.id)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedTemplate === opt.id ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                         >
                            {opt.name}
                        </button>
                    ))}
                </div>
           </div>
           
           {/* Live Preview Wrapper */}
           <div ref={resumePreviewRef}>
             <div className="bg-white p-8 rounded-lg shadow-lg">
                  {templates[selectedTemplate]}
             </div>
           </div>


           <div className="mt-6 text-center">
                <button 
                  onClick={handleDownloadPDF}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                >
                    <Download size={20} />
                    Download as PDF
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
