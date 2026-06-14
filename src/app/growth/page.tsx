import { Bot, FileSearch, Link2, Megaphone, RefreshCcw, Workflow } from "lucide-react";
import Link from "next/link";
import { PageShell, Panel } from "@/components/app-shell";
import { AiMotionShowcase } from "@/components/ai-motion-showcase";
import { aiJobs, automations, seoAudits } from "@/lib/platform-data";

const seoSchema = [
  "Product",
  "Offer",
  "Review",
  "AggregateRating",
  "FAQ",
  "Article",
  "Organization",
  "LocalBusiness",
  "Breadcrumb",
];

const aiPhases = [
  ["Phase 1", "Descriptions, meta titles, meta descriptions, alt text, FAQs"],
  ["Phase 2", "Blog writing, collection content, email content, WhatsApp replies"],
  ["Phase 3", "Recommendations, segmentation, inventory forecasting, fraud detection"],
  ["Phase 4", "Autonomous growth assistant for campaigns and landing pages"],
];

export default function GrowthPage() {
  return (
    <PageShell
      eyebrow="Growth Engine"
      title="SEO, AI content, and automation for every merchant."
      description="This is the growth layer from the PDF: metadata, sitemaps, schema, audits, AI content credits, WhatsApp/email campaigns, abandoned carts, post-purchase flows, and autonomous campaign generation."
    >
      <div className="mb-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <Panel title="Autonomous AI builder" action="Motion preview">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Product descriptions",
              "SEO metadata",
              "Campaign ideas",
              "WhatsApp replies",
              "Analytics insights",
              "Theme suggestions",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4 text-sm font-bold text-[#143c3a]"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 leading-8 text-[#5d6561]">
            Merchants can turn a business goal into store content, SEO tasks,
            customer replies, and campaign workflows from one assistant.
          </p>
        </Panel>
        <AiMotionShowcase />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel title="SEO audit center" action="Schema ready">
          <div className="space-y-3">
            {seoAudits.map((audit) => (
              <div key={audit.page} className="grid gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-4 md:grid-cols-[1fr_90px_1fr]">
                <span className="font-mono text-sm">{audit.page}</span>
                <span className="font-mono text-xl font-bold text-[#143c3a]">{audit.score}</span>
                <span className="text-sm text-[#68716d]">{audit.issue}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {seoSchema.map((schema) => (
              <span key={schema} className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#143c3a]">
                {schema}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="AI usage monitor" action="Credits">
          <div className="space-y-3">
            {aiJobs.map((job) => (
              <div key={job.job} className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                <div className="flex items-center gap-3">
                  <Bot size={18} className="text-[#143c3a]" />
                  <div>
                    <p className="font-bold">{job.job}</p>
                    <p className="text-sm text-[#68716d]">{job.status}</p>
                  </div>
                </div>
                <span className="font-mono font-bold">{job.credits}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="AI roadmap" action="4 phases">
          <div className="space-y-3">
            {aiPhases.map(([phase, text]) => (
              <div key={phase} className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4">
                <p className="font-bold text-[#143c3a]">{phase}</p>
                <p className="mt-2 leading-7 text-[#5d6561]">{text}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Automation workflows" action="Event driven">
          <div className="space-y-4">
            {automations.map((automation) => (
              <div key={automation.title} className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4">
                <div className="mb-3 flex items-center gap-2 font-bold">
                  <Workflow size={17} className="text-[#143c3a]" />
                  {automation.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {automation.steps.map((step) => (
                    <span key={step} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold">
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 rounded-lg border border-black/10 bg-[#143c3a] p-6 text-white">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Megaphone className="text-[#f3b74f]" />
            <h2 className="mt-4 text-3xl font-bold">Autonomous campaign launcher</h2>
            <p className="mt-3 max-w-3xl leading-8 text-white/75">
              Generate landing page, coupon, WhatsApp campaign, email campaign,
              SEO article, and social content from one business goal.
            </p>
          </div>
          <Link href="/api/ai/campaigns" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-[#143c3a]">
            <RefreshCcw size={17} /> API ready
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Dynamic metadata", FileSearch],
            ["Internal linking", Link2],
            ["Campaign workflows", Megaphone],
          ].map(([text, Icon]) => (
            <div key={text as string} className="rounded-lg border border-white/15 p-4">
              <Icon className="text-[#f3b74f]" size={18} />
              <p className="mt-3 font-bold">{text as string}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
