import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { EmptyState, Panel } from "@/components/app-shell";
import { getStoreSettings, updateStoreSettings } from "@/lib/repositories/stores";
import { getSessionContext, requireStorePermission } from "@/lib/session";
import { THEMES } from "@/lib/themes";
import { saveUpload } from "@/lib/uploads";

async function saveSettingsAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("store:write");
  const str = (k: string) => String(formData.get(k) ?? "").trim();
  const orNull = (v: string) => (v === "" ? null : v);

  let logoUrl: string | undefined;
  const logo = formData.get("logo");
  if (logo instanceof File && logo.size > 0) {
    const upload = await saveUpload(logo, storeId);
    if (upload.ok) logoUrl = upload.url;
  }

  await updateStoreSettings(storeId, {
    name: str("name") || undefined,
    themeKey: str("themeKey") || undefined,
    brandColor: str("brandColor") || undefined,
    accentColor: str("accentColor") || undefined,
    logoText: orNull(str("logoText")),
    tagline: orNull(str("tagline")),
    whatsapp: orNull(str("whatsapp")),
    announcement: orNull(str("announcement")),
    heroHeading: orNull(str("heroHeading")),
    heroSubheading: orNull(str("heroSubheading")),
    ...(logoUrl ? { logoUrl } : {}),
  });

  const slug = str("slug");
  revalidatePath("/dashboard/theme");
  if (slug) revalidatePath(`/store/${slug}`);
}

export default async function ThemePage() {
  const { storeId } = await getSessionContext();
  const settings = storeId ? await getStoreSettings(storeId) : null;

  if (!settings) {
    return (
      <Panel title="Theme & branding">
        <EmptyState
          title="No store linked"
          description="This account is not linked to a store yet."
        />
      </Panel>
    );
  }

  return (
    <form action={saveSettingsAction} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <input type="hidden" name="slug" value={settings.slug} />

      <div className="space-y-6">
        <Panel
          title="Theme & branding"
          action={
            <Link
              href={`/store/${settings.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-bold text-[#143c3a]"
            >
              View store <ExternalLink size={14} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Store name" defaultValue={settings.name} />
            <Field name="logoText" label="Logo text (short)" defaultValue={settings.logoText ?? ""} />
            <Field name="tagline" label="Tagline" defaultValue={settings.tagline ?? ""} />
            <Field name="whatsapp" label="WhatsApp number" defaultValue={settings.whatsapp ?? ""} placeholder="+923001234567" />
            <Field name="heroHeading" label="Hero heading" defaultValue={settings.heroHeading ?? ""} />
            <Field name="heroSubheading" label="Hero subheading" defaultValue={settings.heroSubheading ?? ""} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logoUrl}
                alt="Store logo"
                className="size-12 rounded-lg border border-zinc-200 object-cover"
              />
            ) : null}
            <label className="block flex-1">
              <span className="text-sm font-semibold text-zinc-600">
                Logo image (optional)
              </span>
              <input
                type="file"
                name="logo"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                className="mt-1 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#143c3a] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-zinc-600">Announcement bar</span>
            <input
              name="announcement"
              defaultValue={settings.announcement ?? ""}
              placeholder="Free delivery over Rs 5,000"
              className="mt-1 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 outline-none focus:border-zinc-900"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-6">
            <ColorField name="brandColor" label="Brand color" defaultValue={settings.brandColor} />
            <ColorField name="accentColor" label="Accent color" defaultValue={settings.accentColor} />
          </div>
        </Panel>

        <Panel title="Theme preset">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {THEMES.map((theme) => (
              <label
                key={theme.key}
                className="cursor-pointer rounded-lg border border-zinc-300 p-3 text-center text-xs font-semibold transition hover:border-[#143c3a] has-[:checked]:border-[#143c3a] has-[:checked]:bg-zinc-100"
              >
                <input
                  type="radio"
                  name="themeKey"
                  value={theme.key}
                  defaultChecked={settings.themeKey === theme.key}
                  className="sr-only"
                />
                <span
                  className="mx-auto mb-2 block h-8 w-full rounded"
                  style={{
                    background: `linear-gradient(135deg, ${theme.brandColor}, ${theme.accentColor})`,
                  }}
                />
                {theme.name}
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Picking a preset does not overwrite your custom colors above — set
            those to match if you want the preset look exactly.
          </p>
        </Panel>
      </div>

      <Panel title="Save">
        <p className="text-sm text-zinc-600">
          Changes apply instantly to your live storefront at{" "}
          <span className="font-mono">/store/{settings.slug}</span>.
        </p>
        <button
          type="submit"
          className="mt-4 h-11 w-full rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a]"
        >
          Save & publish
        </button>
      </Panel>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-600">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 outline-none focus:border-zinc-900"
      />
    </label>
  );
}

function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="color"
        name={name}
        defaultValue={defaultValue}
        className="h-10 w-14 cursor-pointer rounded border border-zinc-300 bg-white"
      />
      <span className="text-sm font-semibold text-zinc-600">{label}</span>
    </label>
  );
}
