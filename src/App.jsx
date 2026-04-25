import { useMemo, useState } from "react";
import "./App.css";

const MAX_PREVIEW = 140000;

export default function App() {
  const [loadedFile, setLoadedFile] = useState(null);
  const [viewerData, setViewerData] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredRows = useMemo(() => {
    if (!viewerData?.topTags) {
      return [];
    }

    if (!search.trim()) {
      return viewerData.topTags;
    }

    const query = search.toLowerCase();
    return viewerData.topTags.filter((item) => item.tag.toLowerCase().includes(query));
  }, [search, viewerData]);

  const onFileChange = async (file) => {
    if (!file) return;

    setLoadedFile(file);
    setError("");
    setViewerData(null);
    setSearch("");
    setIsLoading(true);

    try {
      const data = await parseDatasmithFile(file);
      setViewerData(data);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "Unable to parse the selected file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="panel hero">
        <p className="eyebrow">Datasmith Inspector</p>
        <h1>.datasmith online viewer</h1>
        <p>
          Upload a <code>.datasmith</code> / <code>.udatasmith</code> file to inspect XML structure,
          scene metadata, and dominant node types right in your browser.
        </p>

        <label className="upload-card" htmlFor="file-upload">
          <input
            id="file-upload"
            type="file"
            accept=".datasmith,.udatasmith,.xml,text/xml,application/xml"
            onChange={(event) => onFileChange(event.target.files?.[0])}
          />
          <span className="upload-title">Choose file</span>
          <span className="upload-subtitle">No server upload • local parse only</span>
          {loadedFile ? (
            <span className="upload-subtitle uploaded">
              Selected: {loadedFile.name} ({formatBytes(loadedFile.size)})
            </span>
          ) : null}
        </label>

        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="panel">
        <h2>Viewer output</h2>

        {!loadedFile && !isLoading ? (
          <EmptyState message="Select a Datasmith file to begin." />
        ) : null}

        {isLoading ? <EmptyState message="Parsing file…" /> : null}

        {viewerData ? (
          <>
            <div className="stats-grid">
              <Stat title="File size" value={formatBytes(viewerData.fileSize)} />
              <Stat title="Encoding" value={viewerData.encoding} />
              <Stat title="Total XML nodes" value={String(viewerData.totalElements)} />
              <Stat title="Root tag" value={viewerData.rootTag} />
            </div>

            <div className="scene-metadata">
              <h3>Scene attributes</h3>
              {viewerData.rootAttributes.length ? (
                <ul>
                  {viewerData.rootAttributes.map((pair) => (
                    <li key={pair.key}>
                      <strong>{pair.key}</strong>: {pair.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No root attributes were found.</p>
              )}
            </div>

            <div className="tags-header">
              <h3>Top node types</h3>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filter tags (e.g. Actor, Mesh, Material)"
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tag</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((item) => (
                  <tr key={item.tag}>
                    <td>{item.tag}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!filteredRows.length ? <p className="muted">No matching tags.</p> : null}

            <h3>Raw preview (truncated)</h3>
            <pre>{viewerData.rawPreview}</pre>
          </>
        ) : null}
      </section>
    </main>
  );
}

function Stat({ title, value }) {
  return (
    <article className="stat">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}

function EmptyState({ message }) {
  return (
    <div className="empty">
      <p>{message}</p>
    </div>
  );
}

async function parseDatasmithFile(file) {
  const buffer = await file.arrayBuffer();
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buffer);

  const xmlStart = text.indexOf("<");
  if (xmlStart < 0) {
    throw new Error("This file does not look like XML and cannot be rendered in this viewer.");
  }

  const xmlText = text.slice(xmlStart).trim();
  const parser = new DOMParser();
  const parsed = parser.parseFromString(xmlText, "application/xml");

  const parserError = parsed.querySelector("parsererror");
  if (parserError) {
    throw new Error(
      "The selected file could not be parsed as valid XML. It may be binary or packed Datasmith data.",
    );
  }

  const elements = Array.from(parsed.getElementsByTagName("*"));
  const frequencies = elements.reduce((accumulator, element) => {
    const key = element.tagName;
    accumulator.set(key, (accumulator.get(key) || 0) + 1);
    return accumulator;
  }, new Map());

  const topTags = Array.from(frequencies.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 100);

  const root = parsed.documentElement;
  const rootAttributes = Array.from(root.attributes || []).map((attribute) => ({
    key: attribute.name,
    value: attribute.value,
  }));

  return {
    fileSize: file.size,
    encoding: detectEncoding(xmlText),
    totalElements: elements.length,
    rootTag: root.tagName,
    rootAttributes,
    topTags,
    rawPreview: xmlText.slice(0, MAX_PREVIEW),
  };
}

function detectEncoding(xmlText) {
  const match = xmlText.match(/encoding\s*=\s*["']([^"']+)["']/i);
  return match?.[1] || "utf-8 (assumed)";
}

function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const power = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** power;
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[power]}`;
}
