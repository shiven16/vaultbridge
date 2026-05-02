import { useNavigate } from "react-router-dom";
import { useRef, useCallback, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  // Mouse-tracking 3D tilt for the hero product showcase
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
  }, []);

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
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="VaultBridge Logo"
              className="h-8 w-auto object-contain drop-shadow-sm"
            />
            <span className="text-xl font-black font-headline text-on-surface tracking-tight">
              VaultBridge
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-on-surface tracking-tight leading-[1.1]">
              Move your files across{" "}
              <span className="text-primary italic font-body font-light">
                Google services
              </span>{" "}
              with ease.
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              The bridge between your Google Drive, Gmail, and Cloud Storage.
              Transfer files quickly and securely.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 hover:brightness-110"
              >
                Try VaultBridge
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            {/* Caution Text */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setIsWarningModalOpen(true)}
                className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5 font-medium text-sm md:text-base cursor-pointer underline underline-offset-4"
              >
                <span className="material-symbols-outlined text-lg">
                  warning
                </span>
                Caution: App not verified by Google(Click here to read before
                logging in)
              </button>
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

        {/* Warning Modal */}
        {isWarningModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm overflow-y-auto flex justify-center items-start pt-20 pb-20 px-4">
            <div className="bg-amber-50 dark:bg-[#1a130a] p-8 md:p-12 rounded-[2.5rem] border border-amber-200 dark:border-amber-800/30 shadow-2xl relative overflow-hidden max-w-5xl w-full animate-in fade-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={() => setIsWarningModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-amber-200/50 hover:bg-amber-300 dark:bg-amber-800/50 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 transition-colors z-20 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6 pr-12">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <span className="material-symbols-outlined text-2xl">
                      gpp_maybe
                    </span>
                  </div>
                  <h3 className="font-headline font-bold text-3xl text-amber-900 dark:text-amber-100 tracking-tight">
                    Google Verification Pending
                  </h3>
                </div>

                <p className="font-body text-lg text-amber-800/80 dark:text-amber-200/80 mb-10 max-w-3xl leading-relaxed">
                  VaultBridge is currently in active development and has not yet
                  been verified by Google to use their APIs. When you sign in
                  with Google, you will see an unverified app warning. To
                  proceed and use the application, please follow these two
                  simple steps when trying to log in using Google:
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Step 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 flex items-center justify-center font-bold font-headline">
                        1
                      </div>
                      <h4 className="font-headline font-bold text-xl text-amber-900 dark:text-amber-100">
                        Click on "Advanced"
                      </h4>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800/50 shadow-lg bg-white dark:bg-surface-container group">
                      <img
                        src="/click_advanced.png"
                        alt="Click Advanced text"
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />

                      {/* CSS Pointer Tooltip - Image 1 */}
                      <div
                        className="absolute flex flex-col items-center animate-pulse z-10"
                        style={{
                          top: "46.3%",
                          left: "31%",
                          transform: "translate(-100%, -50%)",
                        }}
                      >
                        <span className="text-3xl filter drop-shadow-lg">
                          👉
                        </span>
                        <div className="text-primary text-sm font-extrabold mt-1 whitespace-nowrap drop-shadow-md bg-transparent">
                          Click here
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 flex items-center justify-center font-bold font-headline">
                        2
                      </div>
                      <h4 className="font-headline font-bold text-xl text-amber-900 dark:text-amber-100">
                        Click "Go to VaultBridge"
                      </h4>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800/50 shadow-lg bg-white dark:bg-surface-container group">
                      <img
                        src="/click_vaultbridge.png"
                        alt="Click Go to Vaultbridge"
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />

                      {/* CSS Pointer Tooltip - Image 2 */}
                      <div
                        className="absolute flex flex-col items-center animate-pulse z-10"
                        style={{
                          top: "62.5%",
                          left: "31%",
                          transform: "translate(-100%, -50%)",
                        }}
                      >
                        <span className="text-3xl filter drop-shadow-lg">
                          👉
                        </span>
                        <div className="text-primary text-sm font-extrabold mt-1 whitespace-nowrap drop-shadow-md bg-transparent">
                          Click here
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bento Grid Feature Section */}
        <section className="bg-surface-container-low py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Cloud Sync */}
              <div className="bg-surface-container-high p-10 rounded-[2rem] flex flex-col items-center justify-center text-center h-[350px]">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    cloud_done
                  </span>
                </div>
                <h4 className="font-headline font-bold text-2xl mb-4">
                  One-Click Sync
                </h4>
                <p className="font-body text-lg text-on-surface-variant">
                  Move assets between GCS buckets and Drive effortlessly.
                </p>
              </div>

              {/* Card 2: Smart Archive */}
              <div className="bg-surface-container-high p-10 rounded-[2rem] flex flex-col items-center justify-center text-center h-[350px]">
                <span
                  className="material-symbols-outlined text-primary mb-6 text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  inventory_2
                </span>
                <h4 className="font-headline font-bold text-2xl mb-4 text-on-surface">
                  Smart Archive
                </h4>
                <p className="font-body text-lg text-on-surface-variant">
                  Intelligent categorization of your digital assets.
                </p>
              </div>

              {/* Card 3: Security */}
              <div className="bg-primary text-on-primary p-10 rounded-[2rem] h-[350px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
                <div className="mb-6 z-10">
                  <span className="material-symbols-outlined text-5xl">
                    lock_open
                  </span>
                </div>
                <h4 className="font-headline font-bold text-3xl mb-4 z-10">
                  Enterprise-Grade Security
                </h4>
                <p className="font-body text-lg opacity-90 z-10 max-w-sm">
                  Every transfer is encrypted using Google Cloud's native
                  protocols.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
