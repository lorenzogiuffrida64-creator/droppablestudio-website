"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { COUNTRY_CODES, flagFromIso, lookupDialCode } from "@/config/countryCodes";

/* Dialing-code picker as a panel: a button (flag · code · chevron) opens a
   searchable list of countries to choose from — used by the /apply form.
   (The inquiry form keeps the free-type <CountryCodeField>.) Combobox
   pattern: the search box owns focus, arrows move through the list, Enter
   picks, Esc closes; a click outside closes it too. */
type Props = {
  value: string;
  onChange: (code: string) => void;
  id?: string;
  invalid?: boolean;
  describedBy?: string;
};

const OPTIONS = COUNTRY_CODES.map((c) => ({ ...c, flag: flagFromIso(c.iso) }));

export default function CountryPicker({ value, onChange, id, invalid, describedBy }: Props) {
  const uid = useId();
  const listId = `${uid}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const selected = lookupDialCode(value);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OPTIONS;
    const digits = q.replace(/\D/g, "");
    return OPTIONS.filter(
      (o) => o.n.toLowerCase().includes(q) || (digits && o.code.slice(1).startsWith(digits))
    );
  }, [query]);

  // open on the current country
  function openPanel() {
    setQuery("");
    setActive(Math.max(0, OPTIONS.findIndex((o) => o.code === selected?.code)));
    setOpen(true);
  }

  function close(focusButton = true) {
    setOpen(false);
    if (focusButton) btnRef.current?.focus();
  }

  function pick(code: string) {
    onChange(code);
    close();
  }

  // click / tap outside closes
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // keep the highlighted row in view
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-i="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) pick(results[active].code);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    }
  }

  return (
    <div className={`cpick${invalid ? " invalid" : ""}`} ref={rootRef}>
      <button
        ref={btnRef}
        id={id}
        type="button"
        className="cpick-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={
          selected
            ? `Country code ${selected.code}, ${selected.n}. Change country`
            : "Choose country code"
        }
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? close() : openPanel())}
      >
        <span className="cpick-flag" aria-hidden="true">
          {selected ? selected.flag : "🌐"}
        </span>
        <span className="cpick-code">{selected ? selected.code : "+"}</span>
        <svg className="cpick-chev" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="cpick-panel">
          <input
            className="cpick-search"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results[active] ? `${uid}-o${active}` : undefined}
            aria-label="Search country or code"
            placeholder="Search country or code"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
          />
          <ul className="cpick-list" role="listbox" id={listId} ref={listRef} aria-label="Countries">
            {results.map((o, i) => (
              <li
                key={o.code}
                id={`${uid}-o${i}`}
                data-i={i}
                role="option"
                aria-selected={o.code === selected?.code}
                className={`cpick-opt${i === active ? " is-active" : ""}`}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(o.code)}
              >
                <span className="cpick-flag" aria-hidden="true">
                  {o.flag}
                </span>
                <span className="cpick-name">{o.n}</span>
                <span className="cpick-dial">{o.code}</span>
              </li>
            ))}
            {results.length === 0 && <li className="cpick-empty">No matches</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
