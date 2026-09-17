/**
 * Renders a JSON-LD structured-data <script>. Data is serialized server-side;
 * no user-controlled input flows into these objects (all values are typed
 * builders), so this is safe. Kept as a component so pages stay declarative.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from typed, non-user-controlled schema builders.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
