import { useState } from 'react';
import { FileText, Mail, MessageCircle, Phone, Printer } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/defaultPortfolio';
import { PolicyModal } from './PolicyModal';
import type {
  AgreementContent,
  ContactContent,
  PortfolioTheme,
  ServicePlan,
} from '../types/portfolio';

interface ContactAndAgreementProps {
  brandName: string;
  contact: ContactContent;
  agreement: AgreementContent;
  services: ServicePlan[];
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
  theme: PortfolioTheme;
  isCanvasMode?: boolean;
  onSelectSection?: () => void;
}

export function ContactAndAgreementSection({
  brandName,
  contact,
  agreement,
  services,
  selectedPlanId,
  onSelectPlan,
  theme,
  isCanvasMode = false,
  onSelectSection,
}: ContactAndAgreementProps) {
  const [clientName, setClientName] = useState('');
  const [projectDate, setProjectDate] = useState('2026');
  const [policyOpen, setPolicyOpen] = useState(false);

  return (
    <>
      {/* Contact Section */}
      <section
        id="contact"
        onClick={isCanvasMode ? onSelectSection : undefined}
        className={`relative overflow-hidden border-b border-white/10 py-20 sm:py-28 ${
          isCanvasMode ? 'cursor-pointer hover:ring-1 hover:ring-inset hover:ring-white/25' : ''
        }`}
        style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
      >
        <img
          src={GENERATED_ASSETS.contactPrism}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${theme.bgColor}E6 0%, ${theme.bgColor}99 50%, ${theme.bgColor} 100%)`,
          }}
        />

        <div className="relative mx-auto max-w-[1280px] px-6">
          <div className="max-w-2xl">
            <h2
              className="font-bold italic tracking-tight text-white"
              style={{
                fontFamily: theme.displayFont,
                fontSize: `calc(clamp(2.2rem, 4vw, 3.6rem) * ${theme.fontScale})`,
                lineHeight: 1.08,
              }}
            >
              Contact
            </h2>
            <p className="mt-3 text-base text-zinc-200">{contact.headline}</p>
            <p className="mt-2 text-sm font-medium" style={{ color: theme.accentColor }}>
              {contact.subheadline}
            </p>
          </div>

          <div
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* WhatsApp */}
            <div
              className="flex flex-col justify-between rounded-2xl border border-white/15 p-7"
              style={{ backgroundColor: `${theme.surfaceColor}E6` }}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <MessageCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">WhatsApp</h3>
                <p className="mt-1.5 text-sm text-zinc-400">
                  Fastest reply — send your video here
                </p>
              </div>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex min-h-[44px] items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-opacity hover:opacity-90"
              >
                Open WhatsApp
              </a>
            </div>

            {/* Email */}
            <div
              className="flex flex-col justify-between rounded-2xl border border-white/15 p-7"
              style={{ backgroundColor: `${theme.surfaceColor}E6` }}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                  <Mail className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">Email</h3>
                <p className="mt-1.5 text-sm text-zinc-400">
                  For detailed queries · {contact.emailAddress}
                </p>
              </div>
              <a
                href={`mailto:${contact.emailAddress}?subject=Video%20Editing%20Inquiry%20-%20MikeyFlix%20Studios`}
                className="mt-6 flex min-h-[44px] items-center justify-center rounded-lg bg-blue-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
              >
                Open Email
              </a>
            </div>

            {/* Call */}
            <div
              className="flex flex-col justify-between rounded-2xl border border-white/15 p-7"
              style={{ backgroundColor: `${theme.surfaceColor}E6` }}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">Call</h3>
                <p className="mt-1.5 text-sm text-zinc-400">
                  For direct conversation · {contact.phoneNumber}
                </p>
              </div>
              <a
                href={`tel:${contact.phoneNumber.replace(/\s+/g, '')}`}
                className="mt-6 flex min-h-[44px] items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 transition-opacity hover:opacity-90"
              >
                Open Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Agreement Section */}
      <section
        id="agreement"
        onClick={isCanvasMode ? onSelectSection : undefined}
        className="border-b border-white/10 py-20 sm:py-28"
        style={{ backgroundColor: theme.heroBgColor }}
      >
        <div className="mx-auto max-w-[980px] px-6">
          <div
            className="overflow-hidden rounded-2xl border border-white/15 bg-white p-8 text-zinc-900 shadow-2xl sm:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header matching Canva Service Agreement sheet */}
            <div className="flex flex-col justify-between gap-6 border-b-2 border-red-700 pb-6 sm:flex-row sm:items-center">
              <div>
                <div className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl">
                  MIKEY<span className="text-red-700">FLIX</span>
                </div>
                <div className="mt-1 text-xs font-medium tracking-[0.36em] text-zinc-600">
                  CREATE · EDIT · INSPIRE
                </div>
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-700 sm:text-right">
                Professional Video Editing
                <br />
                &amp; Creative Solutions
              </div>
            </div>

            <div className="mt-6 bg-zinc-900 px-5 py-3 text-center">
              <h2 className="text-lg font-bold tracking-[0.22em] text-white sm:text-xl">
                {agreement.title}
              </h2>
            </div>
            <p className="mt-2 text-center text-xs font-semibold tracking-[0.22em] text-zinc-600">
              {agreement.subtitle}
            </p>

            {/* Client & Project inputs */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="agreement-client"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-600"
                >
                  Client Name
                </label>
                <input
                  id="agreement-client"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client or brand name"
                  className="mt-1.5 w-full border-b border-zinc-400 bg-transparent py-2 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="agreement-date"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-600"
                >
                  Project / Date
                </label>
                <input
                  id="agreement-date"
                  type="text"
                  value={projectDate}
                  onChange={(e) => setProjectDate(e.target.value)}
                  placeholder="e.g. Monthly Retainer — 2026"
                  className="mt-1.5 w-full border-b border-zinc-400 bg-transparent py-2 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Interactive Plan Selector */}
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-900">
                1. Choose Your Service Plan
              </h3>
              <p className="mt-1 text-xs text-zinc-600">
                Select your active partnership plan below:
              </p>

              <div className="mt-4 space-y-3">
                {services.map((plan) => {
                  const isChecked = selectedPlanId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => onSelectPlan(plan.id)}
                      className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        isChecked
                          ? 'border-zinc-900 bg-zinc-100'
                          : 'border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                          isChecked
                            ? 'border-zinc-900 bg-zinc-900 text-white'
                            : 'border-zinc-400 bg-white'
                        }`}
                      >
                        {isChecked ? '✓' : ''}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-zinc-950">
                          {plan.name.toUpperCase()} — {plan.price} {plan.cadence}
                        </div>
                        <div className="mt-1 text-xs text-zinc-600">
                          {plan.features.slice(0, 3).join(' · ')}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-6">
              <div>
                <p className="text-xs font-semibold text-zinc-900">
                  {agreement.partnershipLabel}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{agreement.summaryNote}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPolicyOpen(true)}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>View Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-white/10 px-6 py-8"
        style={{ backgroundColor: theme.bgColor }}
      >
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 text-xs text-zinc-400 sm:flex-row">
          <span>© 2026 {brandName}. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="#portfolio" className="hover:text-white">
              Portfolio
            </a>
            <a href="#services" className="hover:text-white">
              Services
            </a>
            <button
              type="button"
              onClick={() => setPolicyOpen(true)}
              className="cursor-pointer hover:text-white"
            >
              Terms &amp; Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Official Partnership Policy & Nested Master Service Covenant Modal */}
      <PolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </>
  );
}
