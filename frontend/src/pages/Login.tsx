import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getLoginUrl, disconnectAccount } from "../api/auth.api";

export default function Login() {
  const navigate = useNavigate();
  const { sourceAccount, destinationAccount, isFullyConnected, refreshAuth } =
    useAuth();

  const handleConnectSource = () => {
    window.location.href = getLoginUrl("source");
  };

  const handleConnectDestination = () => {
    window.location.href = getLoginUrl("destination");
  };

  const handleDisconnect = async (type: "source" | "destination") => {
    try {
      await disconnectAccount(type);
      if (type === "source") {
        window.location.href = "/login";
      } else {
        await refreshAuth();
      }
    } catch (e) {
      console.error("Failed to disconnect", e);
    }
  };

  return (
    <div className="font-body text-on-surface antialiased bg-surface min-h-screen">
      <main className="flex flex-col items-center justify-center p-6 md:p-12 min-h-screen">
        {/* Header Brand Anchor */}
        <header
          className="mb-12 flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
              VaultBridge
            </h1>
          </div>
          <p className="font-headline text-sm uppercase tracking-widest font-bold text-outline">
            The Digital Atelier
          </p>
        </header>

        {/* Progressive Complexity Flow Container */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Strategic Context */}
          <div className="space-y-6 md:sticky md:top-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-headline text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">
                account_tree
              </span>
              System Calibration
            </div>
            <h2 className="font-headline text-4xl font-bold leading-tight text-primary">
              Bridge your digital <br />
              <span className="font-body italic font-normal text-tertiary">
                ecosystems
              </span>
            </h2>
            <p className="text-xl text-on-surface-variant max-w-sm">
              VaultBridge orchestrates high-fidelity transfers between your
              secure repositories. Begin by establishing the terminal points.
            </p>
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-on-primary font-headline font-bold text-xs">
                  1
                </div>
                <span className="font-headline text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                  Establish Source Origin
                </span>
              </div>
              <div className="flex items-center gap-4 group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-xs ${sourceAccount ? "bg-primary text-on-primary" : "bg-surface-container-highest text-outline"}`}
                >
                  2
                </div>
                <span
                  className={`font-headline text-sm font-medium transition-colors ${sourceAccount ? "text-on-surface group-hover:text-primary" : "text-outline group-hover:text-primary"}`}
                >
                  Define Destination Target
                </span>
              </div>
              <div
                className={`flex items-center gap-4 group ${isFullyConnected ? "" : "opacity-50"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-xs ${isFullyConnected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-outline"}`}
                >
                  3
                </div>
                <span
                  className={`font-headline text-sm font-medium ${isFullyConnected ? "text-on-surface" : "text-outline"}`}
                >
                  Initialize Workspace
                </span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Canvas (Progressive Steps) */}
          <div className="space-y-6">
            {/* Step 1: Source Account Card */}
            <div className="bg-surface-container-lowest rounded-xl p-8 transition-all duration-300 shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <span className="font-headline text-[10px] uppercase tracking-[0.15em] font-extrabold text-outline">
                    Step 01
                  </span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">
                    Source Account
                  </h3>
                </div>
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center">
                  <img
                    alt="Google Logo"
                    className="w-6 h-6"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8sOR5JLAHoZGLMHB3MRVYvzYmlZoKS2ytklcS4EMNBdkseVPZ4i6Y7SQVE2VzN2pUVb_ODb7dC8dTik9R-SG-HNEhjw-nXqiAmecIKIrevkcpDvSnCZ497pcLVm9THOkb6-2J_F4GXhLHwDKQxbFtb2Gnru5fAfEi_LsM-6wu2BaUVe6AtmqnzgxukdZehTQXYvSvO7xSFu7X2kbzWbkv9W65_aS2O1k7iTGJYYCfH7yIzx2o5I_vIjHZYeOcMVQkNQVVkeHAsw"
                  />
                </div>
              </div>

              {sourceAccount ? (
                <div>
                  <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold overflow-hidden">
                      {sourceAccount.picture ? (
                        <img
                          src={sourceAccount.picture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        sourceAccount.email.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold text-on-surface">
                        Connected Account
                      </p>
                      <p className="font-headline text-xs text-outline">
                        {sourceAccount.email}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect("source")}
                    className="text-xs font-medium text-error hover:underline cursor-pointer mt-2 block ml-2"
                  >
                    Disconnect Source
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-on-surface-variant mb-8 font-body leading-relaxed italic text-lg">
                    Select the origin environment where your assets currently
                    reside.
                  </p>
                  <button
                    onClick={handleConnectSource}
                    className="cursor-pointer w-full bg-primary text-on-primary font-headline font-bold text-sm py-4 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-primary-dim transition-all active:scale-95"
                  >
                    Connect Source Account
                  </button>
                </>
              )}
            </div>

            {/* Step 2: Destination Account Card */}
            <div
              className={`bg-surface-container-lowest rounded-xl p-8 border-2 transition-all duration-300 ${!sourceAccount ? "border-dashed border-surface-container-high opacity-70" : "border-solid border-outline-variant/10 shadow-sm"}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <span
                    className={`font-headline text-[10px] uppercase tracking-[0.15em] font-extrabold ${sourceAccount ? "text-primary" : "text-outline"}`}
                  >
                    Step 02
                  </span>
                  <h3 className="font-headline text-lg font-bold text-on-surface">
                    Destination Account
                  </h3>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${sourceAccount ? "bg-surface-container" : "bg-surface-container-high opacity-40"}`}
                >
                  <img
                    alt="Google Logo"
                    className={`w-6 h-6 ${!sourceAccount ? "grayscale" : ""}`}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV7lxNk0YVJYlitSFuQlAa1jB96h5dpGIZwkVcga3g2x7wIL9MMtSWCKKSRo1FcNqcxZ5xuo51Pw7MgSAu1oMW0fzJxXIPK2U71WNYNOeSFuMARlskbO2xdmB5zNjS6zgN5AyWctNTD2zRGrSWDaP24_nDEHvGpChmuk7EV3ZMlW3X3uAnPrOWHae6eJQEqPljQE87FXRsiibveBrcWOK5d09pDqZgaFuR8gxbuCJTBlULwgt3Xo_6Tc_S86YNpWZP9Qp6NiMnww"
                  />
                </div>
              </div>

              {destinationAccount ? (
                <div>
                  <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-full border-2 border-secondary-container bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-bold overflow-hidden">
                      {destinationAccount.picture ? (
                        <img
                          src={destinationAccount.picture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        destinationAccount.email.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-headline text-sm font-bold text-on-surface">
                        Connected Target
                      </p>
                      <p className="font-headline text-xs text-outline">
                        {destinationAccount.email}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span
                        className="material-symbols-outlined text-secondary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisconnect("destination")}
                    className="text-xs font-medium text-error hover:underline cursor-pointer mt-2 block ml-2"
                  >
                    Disconnect Target
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-on-surface-variant mb-8 font-body leading-relaxed italic text-lg">
                    Select the target environment where your assets will be
                    synchronized.
                  </p>
                  <button
                    onClick={
                      sourceAccount ? handleConnectDestination : undefined
                    }
                    disabled={!sourceAccount}
                    className={`w-full font-headline font-bold text-sm py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all ${sourceAccount ? "bg-primary text-on-primary hover:bg-primary-dim active:scale-95 cursor-pointer" : "bg-surface-container text-on-surface-variant cursor-not-allowed"}`}
                  >
                    Connect Destination Account
                  </button>
                </>
              )}
            </div>

            {/* Step 3: Global Action */}
            <div className="pt-6">
              <button
                onClick={
                  isFullyConnected ? () => navigate("/dashboard") : undefined
                }
                className={`w-full font-headline font-bold text-sm py-5 px-6 rounded-xl flex items-center justify-between group transition-all ${isFullyConnected ? "bg-primary text-on-primary hover:brightness-110 active:scale-95 cursor-pointer" : "bg-surface-container-highest text-on-surface cursor-not-allowed opacity-60"}`}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined">
                    rocket_launch
                  </span>
                  Continue to Workspace
                </span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <p className="text-center mt-4 font-headline text-[10px] uppercase tracking-widest text-outline font-bold">
                {isFullyConnected
                  ? "All systems nominal. Ready for workspace initialization."
                  : "Awaiting connection of both accounts"}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Architectural Element */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      </main>
    </div>
  );
}
