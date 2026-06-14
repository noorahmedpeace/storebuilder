import { EmptyState, Panel } from "@/components/app-shell";
import { getStoreSettings } from "@/lib/repositories/stores";
import { getSessionContext } from "@/lib/session";
import { normalizeLayout } from "@/lib/sections";
import { SectionBuilder } from "./section-builder";
import { saveLayout } from "./actions";

export default async function BuilderPage() {
  const { storeId } = await getSessionContext();
  const settings = storeId ? await getStoreSettings(storeId) : null;

  if (!settings) {
    return (
      <Panel title="Storefront builder">
        <EmptyState
          title="No store linked"
          description="This account is not linked to a store yet."
        />
      </Panel>
    );
  }

  const sections = normalizeLayout(settings.layout);

  return (
    <SectionBuilder
      initial={sections}
      slug={settings.slug}
      saveAction={saveLayout}
    />
  );
}
