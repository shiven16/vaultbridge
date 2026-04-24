import { useNavigate } from "react-router-dom";
import { useRef, useCallback } from "react";

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse-tracking 3D tilt for the hero product showcase
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Tilt range: ±6 degrees
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.transform = "rotateX(8deg) rotateY(0deg)";
  }, []);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/10 flex justify-between items-center w-full px-6 h-16">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black font-headline text-on-surface tracking-tight">
            VaultBridge
          </span>
          <nav className="hidden md:flex gap-6">
            <a
              className="text-on-surface font-semibold font-headline text-sm hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-lg cursor-pointer"
              onClick={() => navigate("/")}
            >
              Product
            </a>
            <a className="text-outline font-medium font-headline text-sm hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-lg cursor-pointer">
              Solutions
            </a>
            <a className="text-outline font-medium font-headline text-sm hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-lg cursor-pointer">
              Enterprise
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <button className="p-2 text-outline hover:bg-surface-variant/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-outline hover:bg-surface-variant/50 rounded-full transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer bg-primary text-on-primary px-5 py-2 rounded-lg font-headline text-sm font-bold active:scale-95 duration-150 transition-all hover:brightness-110"
          >
            Try VaultBridge
          </button>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-[900px] flex flex-col items-center justify-start text-center px-4 pt-20 pb-32 overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label text-[0.6875rem] font-bold tracking-widest uppercase mb-4">
              <span className="material-symbols-outlined text-sm">
                auto_awesome
              </span>
              The Digital Atelier Experience
            </div>
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-on-surface tracking-tight leading-[1.1]">
              Move your files across{" "}
              <span className="text-primary italic font-body font-light">
                Google services
              </span>{" "}
              with ease.
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              The bridge between your Google Drive, Gmail, and Cloud Storage. A
              quiet, authoritative workspace for high-cognition file
              orchestration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 hover:brightness-110"
              >
                Try VaultBridge
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </button>
              {/* <button className="cursor-pointer bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-surface-variant transition-all active:scale-95 border border-outline-variant/20">
                Watch the Film
              </button> */}
            </div>
          </div>

          {/* ── High-Fidelity Product Showcase ── */}
          <div className="mt-24 w-full max-w-6xl mx-auto px-4 perspective-1200 relative">
            <div
              ref={heroRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="hero-ui-container glass-panel border border-white/40 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden relative min-h-[500px] bg-[#fdfdfd]/60"
            >
              {/* Interface Shell */}
              <div className="absolute inset-0 flex flex-col">
                {/* Top Toolbar */}
                <div className="h-14 border-b border-outline-variant/10 flex items-center px-8 gap-4 bg-white/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/40"></div>
                  </div>
                  <div className="ml-auto flex items-center gap-6">
                    <div className="h-6 w-32 bg-surface-container rounded-md"></div>
                    <div className="h-8 w-8 rounded-full bg-surface-container-high"></div>
                  </div>
                </div>

                {/* Main Bridge Content */}
                <div className="flex-1 p-12 flex items-center justify-between relative">
                  {/* Source Column: Google Drive */}
                  <div className="w-72 space-y-4 hidden md:block">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">
                          add_to_drive
                        </span>
                      </div>
                      <span className="font-headline font-bold text-sm tracking-tight">
                        Source: Google Drive
                      </span>
                    </div>
                    {/* File List */}
                    <div className="space-y-3">
                      <div className="p-3 bg-white/80 rounded-xl shadow-sm border border-outline-variant/10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-500">
                          description
                        </span>
                        <div className="flex-1 h-2 bg-surface-container rounded-full"></div>
                      </div>
                      <div className="p-3 bg-white/40 rounded-xl border border-outline-variant/5 flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-500">
                          picture_as_pdf
                        </span>
                        <div className="flex-1 h-2 bg-surface-container rounded-full"></div>
                      </div>
                      <div className="p-3 bg-white/40 rounded-xl border border-outline-variant/5 flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-600">
                          table_chart
                        </span>
                        <div className="flex-1 h-2 bg-surface-container rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Central Bridge Lane */}
                  <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-12 relative h-full overflow-hidden">
                    {/* Subtle Grid Background */}
                    <div
                      className="absolute inset-0 z-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 2px 2px, #767c7e 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                      }}
                    ></div>

                    {/* SVG network paths */}
                    <svg
                      className="absolute inset-0 w-full h-full z-0 opacity-15"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 0,100 C 100,100 150,50 300,150 C 450,250 500,100 600,150"
                        fill="none"
                        stroke="#49636f"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 0,200 C 150,150 200,250 400,100 C 500,50 550,200 600,200"
                        fill="none"
                        stroke="#49636f"
                        strokeDasharray="4 4"
                        strokeWidth="1.5"
                      />
                    </svg>

                    {/* Subtle Loading Nodes */}
                    <div className="absolute top-[12%] left-[25%] z-10 flex items-center gap-2 opacity-60 hidden lg:flex">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/20 border-t-primary/60 animate-spin"></div>
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-primary/60 uppercase tracking-widest">
                          Indexing Drive
                        </div>
                        <div className="flex gap-1">
                          <div className="w-12 h-1 bg-primary/10 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-primary/40 rounded-full animate-pulse origin-left scale-x-75"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-[18%] right-[25%] z-10 flex items-center gap-3 opacity-50 hidden lg:flex">
                      <span className="material-symbols-outlined text-outline-variant text-sm animate-pulse">
                        cloud_sync
                      </span>
                      <div className="space-y-1.5 w-24">
                        <div className="h-1.5 w-full bg-outline-variant/10 rounded-full overflow-hidden relative">
                          <div className="h-full bg-outline-variant/40 w-full rounded-full animate-pulse"></div>
                        </div>
                        <div className="h-1 w-1/2 bg-outline-variant/10 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute top-[8%] left-[48%] z-10 flex-col items-center gap-2 opacity-40 hidden lg:flex">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-primary/50 rounded-full animate-ping"></div>
                        <div className="w-6 h-[1px] bg-primary/30"></div>
                        <div className="w-1.5 h-1.5 bg-primary/50 rounded-full"></div>
                        <div className="w-6 h-[1px] bg-primary/30"></div>
                        <div
                          className="w-1 h-1 bg-primary/50 rounded-full animate-ping"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                      </div>
                      <span className="text-[7px] font-bold text-outline-variant uppercase tracking-[0.2em]">
                        Resolving
                      </span>
                    </div>

                    {/* Motion Graphic Paths */}
                    <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent top-[35%] -translate-y-1/2 z-10"></div>
                    <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent top-1/2 -translate-y-1/2 z-10"></div>
                    <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent top-[65%] -translate-y-1/2 z-10"></div>

                    {/* Floating File Pills */}
                    {/* Pill 1: Document */}
                    <div
                      className="absolute top-[30%] left-[15%] animate-float z-20"
                      style={{ animationDelay: "0s" }}
                    >
                      <div className="px-4 py-3 bg-white rounded-xl shadow-lg border border-outline-variant/10 flex items-center gap-3 w-40">
                        <span className="material-symbols-outlined text-blue-500 text-xl">
                          description
                        </span>
                        <div className="flex-1">
                          <div className="text-[9px] font-bold text-outline uppercase tracking-wider mb-1.5">
                            Q3_Report.docx
                          </div>
                          <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[85%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Pill 2: PDF */}
                    <div
                      className="absolute top-[46%] left-[45%] animate-float z-20"
                      style={{ animationDelay: "1.5s" }}
                    >
                      <div className="px-4 py-3 bg-white rounded-xl shadow-lg border border-outline-variant/10 flex items-center gap-3 w-40 scale-110">
                        <span className="material-symbols-outlined text-red-500 text-xl">
                          picture_as_pdf
                        </span>
                        <div className="flex-1">
                          <div className="text-[9px] font-bold text-outline uppercase tracking-wider mb-1.5">
                            Contract_v2.pdf
                          </div>
                          <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[45%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Pill 3: Image */}
                    <div
                      className="absolute top-[61%] right-[15%] animate-float z-20"
                      style={{ animationDelay: "3s" }}
                    >
                      <div className="px-4 py-3 bg-white rounded-xl shadow-lg border border-outline-variant/10 flex items-center gap-3 w-40">
                        <span className="material-symbols-outlined text-green-600 text-xl">
                          image
                        </span>
                        <div className="flex-1">
                          <div className="text-[9px] font-bold text-outline uppercase tracking-wider mb-1.5">
                            Hero_Asset.png
                          </div>
                          <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-green-600 w-[15%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-primary/20 rounded-full animate-ping z-10"></div>
                    <div className="absolute top-[25%] right-[40%] w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse z-10"></div>
                    <div className="absolute top-[40%] left-[50%] w-2 h-2 bg-primary/10 rounded-full animate-ping z-10"></div>
                  </div>

                  {/* Destination Column: Gmail */}
                  <div className="w-72 space-y-4 hidden md:block">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-tertiary text-lg">
                          mail
                        </span>
                      </div>
                      <span className="font-headline font-bold text-sm tracking-tight">
                        Dest: Gmail Attachments
                      </span>
                    </div>
                    {/* Queue/Inbox */}
                    <div className="bg-surface-container-low/50 rounded-2xl p-4 border border-outline-variant/10 min-h-[160px]">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-on-tertiary-container text-xs">
                              done_all
                            </span>
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="h-1.5 w-2/3 bg-tertiary-dim/20 rounded-full"></div>
                            <div className="h-1.5 w-1/2 bg-tertiary-dim/10 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-40">
                          <div className="w-8 h-8 rounded-full bg-surface-container-high"></div>
                          <div className="space-y-1 flex-1">
                            <div className="h-1.5 w-3/4 bg-surface-container-high rounded-full"></div>
                            <div className="h-1.5 w-1/4 bg-surface-container-high rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Overlay: Transfer Queue Card */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass-panel p-5 rounded-2xl shadow-2xl border border-white/50 w-[400px] z-30 hidden sm:flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold font-headline text-primary uppercase tracking-[0.15em]">
                      Transfer Active
                    </span>
                    <span className="text-[10px] font-bold text-outline tracking-tighter">
                      72% Complete
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[72%] rounded-full"></div>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:bg-primary-dim transition-colors">
                  <span className="material-symbols-outlined">pause</span>
                </button>
              </div>
            </div>

            {/* Background Decorative Blur */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-tertiary/5 rounded-full blur-[100px] -z-10"></div>
          </div>
        </section>

        {/* Bento Grid Feature Section */}
        <section className="bg-surface-container-low py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large Card: The Atelier */}
              <div className="md:col-span-8 bg-surface-container-lowest p-10 rounded-[2rem] flex flex-col justify-between h-[450px] shadow-sm">
                <div>
                  <span className="font-label text-[0.6875rem] font-bold text-primary uppercase tracking-[0.2em] block mb-4">
                    Foundation
                  </span>
                  <h3 className="font-headline font-bold text-4xl mb-6 text-on-surface">
                    The Digital Atelier
                  </h3>
                  <p className="font-body text-xl text-on-surface-variant max-w-md leading-relaxed">
                    A space that feels like a premium, physical workspace:
                    tactile, organized, and quietly authoritative. We reject the
                    rigid, boxy constraints of traditional grids.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="px-6 py-3 bg-surface-container rounded-lg font-label font-semibold text-sm">
                    Geometric Utility
                  </div>
                  <div className="px-6 py-3 bg-surface-container rounded-lg font-label font-semibold text-sm">
                    Humanistic Serifs
                  </div>
                </div>
              </div>

              {/* Small Card: Cloud Sync */}
              <div className="md:col-span-4 bg-surface-container-high p-10 rounded-[2rem] flex flex-col items-center justify-center text-center h-[450px]">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    cloud_done
                  </span>
                </div>
                <h4 className="font-headline font-bold text-2xl mb-4">
                  One-Click Sync
                </h4>
                <p className="font-body text-lg text-on-surface-variant">
                  Move assets between GCS buckets and Drive without leaving your
                  workflow.
                </p>
              </div>

              {/* Medium Card: Context */}
              <div className="md:col-span-5 bg-surface-container-high p-10 rounded-[2rem] h-[400px]">
                <span
                  className="material-symbols-outlined text-primary mb-6"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  inventory_2
                </span>
                <h4 className="font-headline font-bold text-2xl mb-4 text-on-surface">
                  Smart Archive
                </h4>
                <p className="font-body text-lg text-on-surface-variant mb-8">
                  Intelligent categorization of your digital assets using
                  archival standards.
                </p>
                <img
                  className="w-full h-40 object-cover rounded-xl"
                  alt="Organized minimalist office shelf"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuS6nThfLJ5T38I1UkqSuSHrMjHtHw1JEiCrKzZORvCP3OaRWjDxtFU5A-Ty8NuNTOsV6ASWSDx_cuyEL-CGAt8_wTkv2CtI1SObj5YIxYQYv0RFJBrU8ZrHvQJry4rKOwCb_2MLJXB7yG4epWK2W9NyZRGczj7W2ZW37oawjQWKRAkgzl9__g7nqchYxcEagIQi_PE-Rp0Jy0pXnS5BB3DFKmXIAEwBymZ5O82xdHuxA1dxNZkokF3R4lhP745nDEFTCL9bxm0w"
                />
              </div>

              {/* Medium Card: Security */}
              <div className="md:col-span-7 bg-primary text-on-primary p-10 rounded-[2rem] h-[400px] flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
                <div className="mb-auto">
                  <span className="material-symbols-outlined text-4xl">
                    lock_open
                  </span>
                </div>
                <h4 className="font-headline font-bold text-3xl mb-4">
                  Enterprise-Grade Bridge
                </h4>
                <p className="font-body text-xl opacity-80 max-w-sm">
                  Every transfer is encrypted using Google Cloud's native
                  security protocols. Your data never touches our servers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Features Detail (Asymmetric) */}
        {/* <section className="py-32 bg-surface">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <h2 className="font-headline font-bold text-4xl text-on-surface leading-tight">
                  Effortless Google Drive to <br />
                  Gmail Orchestration
                </h2>
                <p className="font-body text-xl text-on-surface-variant">
                  Stop downloading and re-uploading. Connect your Gmail directly
                  to your Drive hierarchy. Extract attachments and file them into
                  the correct workspace folders automatically.
                </p>
                <div className="pt-4">
                  <a
                    className="text-primary font-label font-bold flex items-center gap-2 group cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Learn about the Transfer Panel
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_right_alt
                    </span>
                  </a>
                </div>
              </div>
              <div className="flex-1 bg-surface-container p-8 rounded-[3rem]">
                <img
                  className="rounded-[2rem] shadow-xl"
                  alt="Macro view of premium stationery"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDyc5G_heVWPVOoTpoOhZiZpZ2lzRJmg_J-UQc-ZSXoYQ_dkXvMgdh0zXI5SfJeOtxHJQnipHm175wPnWDy9XnfPeK-CVUJkSxsPwVk5HphBIAbS8a7YWCPJoZD9SQASLHYBT2UfMADSvrbjAjm1lvrxGeG-M1D1w9KRq442Yk8TjvLb_bcyDkCGETIMUEcnX6AjZvXMTaevZMG78link0DiTcLiyZyFUiiZbQw4G06pL_GfbReDZechkYsSqOnFPED7r5voriWA"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 space-y-6">
                <h2 className="font-headline font-bold text-4xl text-on-surface leading-tight">
                  Cloud Storage for the <br />
                  Digital Atelier
                </h2>
                <p className="font-body text-xl text-on-surface-variant">
                  Bridge the gap between high-performance Cloud Storage and
                  daily collaboration tools. VaultBridge provides a tactile
                  interface for managing massive datasets across your ecosystem.
                </p>
                <div className="pt-4">
                  <a
                    className="text-primary font-label font-bold flex items-center gap-2 group cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Explore Cloud Sync
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_right_alt
                    </span>
                  </a>
                </div>
              </div>
              <div className="flex-1 bg-surface-container-high p-8 rounded-[3rem]">
                <img
                  className="rounded-[2rem] shadow-xl"
                  alt="Minimalist desk setup"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCmKbKL8xBRfJruDO6eKU4tOrnUhgR3AR95oLg41oDPCfCXC4DcRG0SKoomKlD8EKYx1EJPKYockkbHi2aG523gCcNsXbbVdC-INr0dWdN60_dBfKaR6tKitSP5dcQKVQhXFyIoGvyBrol9C1o9I6P7-KhQGdk3kfBTTwF5MMgU3PkMppD5SRbO768cYkWggjRHGYoC9cu57l34f-Q-FPGT-0O1MVFgAcrY9Uvlr-5_ue-th5O5Ma5Os-mx-CtQfA-zNO2rtWV4A"
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* Final CTA Section */}
        {/* <section className="py-32 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="glass-panel p-16 md:p-24 rounded-[3rem] border border-outline-variant/10 bg-white/40">
              <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface mb-8 tracking-tight">
                Ready to bridge the gap?
              </h2>
              <p className="font-body text-xl text-on-surface-variant mb-12 max-w-xl mx-auto">
                Join the workspace revolution. Experience a file management
                system designed for the way you actually think.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer bg-primary text-on-primary px-10 py-5 rounded-2xl font-headline font-bold text-xl active:scale-95 duration-150 transition-all shadow-lg hover:shadow-primary/20 hover:brightness-110"
              >
                Get Started with VaultBridge
              </button>
              <p className="mt-8 font-label text-xs text-outline uppercase tracking-widest">
                No credit card required • Integration in 30 seconds
              </p>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      {/* <footer className="bg-surface py-20 px-6 border-t border-outline-variant/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <span className="text-2xl font-black font-headline text-on-surface block mb-6">
              VaultBridge
            </span>
            <p className="font-body text-lg text-on-surface-variant max-w-xs mb-8">
              The premier bridge for professional file orchestration across the
              Google Workspace ecosystem.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
                drive_file_move
              </span>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
                mail_lock
              </span>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
                cloud_done
              </span>
            </div>
          </div>
          <div>
            <h5 className="font-headline font-bold text-sm mb-6 uppercase tracking-widest">
              Platform
            </h5>
            <ul className="space-y-4 font-label text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Integrations
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  File Strategy
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Pricing
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  API Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-headline font-bold text-sm mb-6 uppercase tracking-widest">
              Company
            </h5>
            <ul className="space-y-4 font-label text-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  The Atelier Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label text-[0.6875rem] text-outline uppercase tracking-widest">
            © 2024 VaultBridge Systems. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="font-label text-[0.6875rem] text-outline uppercase tracking-widest cursor-pointer hover:text-primary">
              Status: Operational
            </span>
            <span className="font-label text-[0.6875rem] text-outline uppercase tracking-widest cursor-pointer hover:text-primary">
              Regional: Global
            </span>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
