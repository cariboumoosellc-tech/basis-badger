"use client";


import BadgerLoader from './BadgerLoader';

type BadgerScannerProps = {
  previewUrl?: string;
  statusIntervalMs?: number;
};

const DEFAULT_MESSAGES = [
  "[SYSTEM] SNIFFING INTERCHANGE PADDING...",
  "[SYSTEM] DETECTING TIERED TRAPS...",
  "[SYSTEM] EXTRACTING JUNK FEES...",
  "[SYSTEM] MAPPING HIDDEN MARKUPS...",
  "[SYSTEM] FLAGGING COST LEAKS...",
];

export default function BadgerScanner({
  previewUrl,
  statusIntervalMs = 1600,
}: BadgerScannerProps) {
  // Loader only, no animated messages needed

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0D0D0D] p-8 text-white">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Tactical Scan
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Merchant document sweep
          </h2>
          <p className="text-sm text-slate-400">
            Live extraction running across the latest PDF intake.
          </p>

          <div className="rounded-2xl border border-slate-800 bg-black/40 px-4 py-3 flex flex-col items-center">
            <BadgerLoader />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-black/50 p-4">
          <div className="relative h-[320px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm"
              style={
                previewUrl
                  ? { backgroundImage: `url(${previewUrl})` }
                  : {
                      backgroundImage:
                        "linear-gradient(135deg, rgba(71,85,105,0.5), rgba(15,23,42,0.9))",
                    }
              }
            />
            <div className="absolute inset-0 bg-black/30" />
            {!previewUrl ? (
              <div className="relative z-10 flex h-full items-center justify-center text-xs uppercase tracking-[0.35em] text-slate-400">
                Document preview
              </div>
            ) : null}
            <div className="scan-line" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
      </div>
      <style>{`
        .scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          background: #f2a900;
          box-shadow: 0 0 12px rgba(242, 169, 0, 0.7);
          animation: scan 2.8s ease-in-out infinite;
        }
        @keyframes scan {
          0% {
            transform: translateY(18px);
            opacity: 0.6;
          }
          50% {
            transform: translateY(280px);
            opacity: 1;
          }
          100% {
            transform: translateY(18px);
            opacity: 0.6;
          }
        }
      `}</style>
    </section>
  );
}
