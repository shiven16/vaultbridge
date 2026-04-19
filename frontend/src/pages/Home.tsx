import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest sticky top-0 z-50 border-b border-outline-variant/10 flex justify-between items-center w-full px-6 h-16">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black font-headline text-on-surface tracking-tight">
            VaultBridge
          </span>
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
        <section className="min-h-[870px] flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
          <div className="max-w-4xl mx-auto space-y-8">
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
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              {/* <button className="cursor-pointer bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-surface-variant transition-all active:scale-95">
                Watch the Film
              </button> */}
            </div>
          </div>

          {/* Glassmorphism Preview Area */}
          <div className="mt-24 w-full max-w-6xl mx-auto px-4 perspective-1000">
            <div className="glass-panel border border-outline-variant/10 rounded-[2rem] p-4 shadow-2xl overflow-hidden relative">
              <img
                className="w-full h-auto rounded-[1.5rem] shadow-sm"
                alt="Abstract minimalist digital workspace"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjEhsGbhle6Zc0O3aenCZODDSXAMHYKrsOKfzPaJc36s766yc5LSanoO1_3U7VgJFIat_dprub3d8y4w8vYLD6EaA3MyGrLPFuzJWBAxcYm7T-g2gFjQf7YmS8hj6qEqp95YIVJF3lYTFfWi-EMfn0Ef2ffx00aBNB1sUQ-Lge1Qev3hI26W0BAncn2DHc0SB-qNjp0MA3C-wdjMuCEg7nVWgac66tD9FdETNK4oIf6-2lv-K6X-7E6tB2V37h-xWbIDGj71mVpQ"
              />
              {/* Asymmetric Overlay Cards */}
              <div className="absolute top-12 left-12 p-6 bg-surface-container-lowest rounded-xl shadow-2xl max-w-xs hidden lg:block border border-outline-variant/15">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-tertiary-container">
                      mail_lock
                    </span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm">
                      Gmail Attachments
                    </p>
                    <p className="font-label text-[0.625rem] text-outline uppercase tracking-tighter">
                      Secure Extraction
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-surface-container rounded-full"></div>
                  <div className="h-2 w-2/3 bg-surface-container rounded-full"></div>
                </div>
              </div>
              <div className="absolute bottom-12 right-12 p-6 bg-surface-container-lowest rounded-xl shadow-2xl max-w-xs hidden lg:block border border-outline-variant/15">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container">
                      drive_file_move
                    </span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm">
                      Transfer Queue
                    </p>
                    <p className="font-label text-[0.625rem] text-outline uppercase tracking-tighter">
                      3 Active Flows
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="h-8 flex-1 bg-primary/10 rounded-sm"></div>
                  <div className="h-8 flex-1 bg-primary/20 rounded-sm"></div>
                  <div className="h-8 flex-1 bg-primary/40 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Feature Section */}
        <section className="bg-surface-container-low py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Large Card: The Atelier */}
              <div className="md:col-span-8 bg-surface-container-lowest p-10 rounded-[2rem] flex flex-col justify-between h-[450px]">
                <div>
                  <span className="font-label text-[0.6875rem] font-bold text-primary uppercase tracking-[0.2em] block mb-4">
                    Foundation
                  </span>
                  <h3 className="font-headline font-bold text-4xl mb-6 text-on-surface">
                    The Digital Atelier
                  </h3>
                  <p className="font-body text-xl text-on-surface-variant max-w-md">
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiS6nThfLJ5T38I1UkqSuSHrMjHtHw1JEiCrKzZORvCP3OaRWjDxtFU5A-Ty8NuNTOsV6ASWSDx_cuyEL-CGAt8_wTkv2CtI1SObj5YIxYQYv0RFJBrU8ZrHvQJry4rKOwCb_2MLJXB7yG4epWK2W9NyZRGczj7W2ZW37oawjQWKRAkgzl9__g7nqchYxcEagIQi_PE-Rp0Jy0pXnS5BB3DFKmXIAEwBymZ5O82xdHuxA1dxNZkokF3R4lhP745nDEFTCL9bxm0w"
                />
              </div>

              {/* Medium Card: Security */}
              <div className="md:col-span-7 bg-primary text-on-primary p-10 rounded-[2rem] h-[400px] flex flex-col justify-end">
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
        <section className="py-32 bg-surface">
          <div className="max-w-6xl mx-auto px-6 space-y-32">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <h2 className="font-headline font-bold text-4xl text-on-surface leading-tight">
                  Effortless Google Drive to <br />
                  Gmail Orchestration
                </h2>
                <p className="font-body text-xl text-on-surface-variant">
                  Stop downloading and re-uploading. Connect your Gmail directly
                  to your Drive hierarchy. Extract attachments and file them
                  into the correct workspace folders automatically.
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
        </section>

        {/* Final CTA Section */}
        <section className="py-32 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="glass-panel p-16 md:p-24 rounded-[3rem] border border-outline-variant/10">
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
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-20 px-6 border-t border-outline-variant/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <span className="text-2xl font-black font-headline text-slate-900 dark:text-white block mb-6">
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
      </footer>
    </div>
  );
}
