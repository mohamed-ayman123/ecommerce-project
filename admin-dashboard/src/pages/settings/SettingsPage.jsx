import { useState } from "react";

/**
 * Settings page for the Koda Store admin dashboard.
 * Colors come from clean Tailwind utility classes (bg-primary-dark,
 * text-text-gold, border-border-light...) auto-generated from the
 * @theme tokens in index.css — no manual var(--color-x) anywhere.
 * Drop into src/pages/settings/SettingsPage.jsx.
 */

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ${
        checked ? "bg-primary-dark dark:bg-text-gold" : "bg-border-medium"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-text-light shadow transition-all duration-150 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Card({ title, description, children }) {
  return (
    <section className="mb-5 rounded-2xl border border-border-light bg-bg-card p-7 dark:bg-dark-bg-card dark:border-primary-medium">
      <h2 className="mb-1 text-lg font-bold text-text-primary dark:text-text-light">
        {title}
      </h2>
      <p className="mb-5 text-sm text-text-secondary">{description}</p>
      {children}
    </section>
  );
}

function Row({ label, hint, children, first }) {
  return (
    <div
      className={`flex items-center justify-between gap-5 py-4 ${
        first ? "" : "border-t border-border-light dark:border-primary-medium"
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-text-primary dark:text-text-light">
          {label}
        </p>
        {hint && <p className="mt-0.5 text-xs text-text-secondary">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

const selectClass =
  "min-w-[150px] rounded-lg border border-border-medium bg-bg-input px-3 py-2 text-sm text-text-primary";

const smallBtnClass =
  "whitespace-nowrap rounded-lg border border-border-medium bg-bg-input px-3.5 py-2.5 text-sm font-semibold text-text-primary hover:border-primary-medium";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [defaultView, setDefaultView] = useState("Orders");
  const [pageSize, setPageSize] = useState("25");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey] = useState("koda_live_9f2c7a1e8b3d4f56");
  const [saved, setSaved] = useState(false);

  const maskedKey = apiKeyVisible
    ? apiKey
    : apiKey.slice(0, 9) + "•".repeat(apiKey.length - 9);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const copyKey = () => {
    if (navigator?.clipboard) navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="min-h-screen bg-bg-main pb-12 dark:bg-dark-bg-main">
      <div className="mx-auto max-w-[760px] px-5 pt-8">
        <p className="mb-2 text-[13px] font-semibold tracking-[0.16em] text-text-gold">
          SETTINGS
        </p>
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-light">
          Preferences and integrations
        </h1>
        <p className="mt-2.5 max-w-[480px] text-[15px] leading-relaxed text-text-secondary">
          Theme mode, API credentials, and dashboard preferences are managed
          here.
        </p>

        <div className="mt-6">
          <Card
            title="Appearance"
            description="Choose how the dashboard looks for you."
          >
            <Row
              first
              label="Dark mode"
              hint="Switch the dashboard to a dark theme."
            >
              <Toggle
                checked={darkMode}
                onChange={setDarkMode}
                label="Toggle dark mode"
              />
            </Row>
            <Row
              label="Default landing page"
              hint="Where the dashboard opens after login."
            >
              <select
                className={selectClass}
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value)}
              >
                <option>Orders</option>
                <option>Products</option>
                <option>Analytics</option>
                <option>Customers</option>
              </select>
            </Row>
            <Row label="Rows per page" hint="Items shown in tables and lists.">
              <select
                className={selectClass}
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </Row>
          </Card>

          <Card
            title="API and integrations"
            description="Use this key to connect external tools to your store data."
          >
            <Row first label="API key">
              <div className="flex flex-1 gap-2">
                <input
                  readOnly
                  value={maskedKey}
                  className="w-full rounded-lg border border-border-medium bg-bg-input px-3 py-2.5 font-mono text-[13.5px] text-text-primary"
                />
                <button
                  className={smallBtnClass}
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                >
                  {apiKeyVisible ? "Hide" : "Show"}
                </button>
                <button className={smallBtnClass} onClick={copyKey}>
                  Copy
                </button>
              </div>
            </Row>
            <Row
              label="Regenerate API key"
              hint="Old key stops working immediately once regenerated."
            >
              <button className="rounded-lg border border-text-gold bg-transparent px-4 py-2.5 text-sm font-semibold text-text-gold hover:bg-accent-gold-hover hover:text-text-light">
                Regenerate
              </button>
            </Row>
          </Card>

          <Card
            title="Notifications"
            description="Control what the dashboard alerts you about."
          >
            <Row
              first
              label="Email alerts"
              hint="New orders and customer messages."
            >
              <Toggle
                checked={emailAlerts}
                onChange={setEmailAlerts}
                label="Toggle email alerts"
              />
            </Row>
            <Row
              label="Low stock alerts"
              hint="Notify when a product drops below threshold."
            >
              <Toggle
                checked={lowStockAlerts}
                onChange={setLowStockAlerts}
                label="Toggle low stock alerts"
              />
            </Row>
          </Card>

          <div className="mt-2 flex items-center justify-end gap-3.5">
            {saved && (
              <span className="text-sm font-semibold text-primary-medium">
                Saved
              </span>
            )}
            <button
              onClick={handleSave}
              className="rounded-xl bg-primary-dark px-6 py-3 text-[14.5px] font-bold text-text-light hover:bg-primary-medium"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


