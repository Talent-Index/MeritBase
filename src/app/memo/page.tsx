"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import { Playfair_Display, Great_Vibes } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

type MemoFields = {
  companyName: string;
  department: string;
  memoTitle: string;
  reference: string;
  date: string;
  to: string;
  from: string;
  cc: string;
  subject: string;
  body: string;
  closing: string;
  signerName: string;
  signerTitle: string;
  approverName: string;
  approverTitle: string;
  stampText: string;
};

const defaultMemo: MemoFields = {
  companyName: "MeritBase Holdings",
  department: "Corporate Secretariat",
  memoTitle: "Internal Memorandum",
  reference: "MB/CS/042",
  date: "28 March 2025",
  to: "All Department Heads",
  from: "Office of the Company Secretary",
  cc: "Managing Director, HR Lead",
  subject: "Implementation of AI-assisted Memo Workflow",
  body:
    "This memo introduces the AI-assisted workflow for drafting, reviewing, and archiving corporate communications. Secretariat staff are required to use the standardized template to ensure consistent formatting and branding across all internal memoranda.\n\nPlease review the attached process guide and ensure that all new memos are routed through the Secretariat desk for verification, stamping, and record keeping. The updated workflow takes effect immediately.",
  closing: "For and on behalf of MeritBase Holdings",
  signerName: "Amara Okoye",
  signerTitle: "Company Secretary",
  approverName: "Damilola Adeyemi",
  approverTitle: "Managing Director",
  stampText: "Official Company Stamp",
};

const fileToUrl = (file: File | null) => (file ? URL.createObjectURL(file) : null);

export default function MemoPage() {
  const [fields, setFields] = useState<MemoFields>(defaultMemo);
  const [leftLogo, setLeftLogo] = useState<string | null>(null);
  const [rightLogo, setRightLogo] = useState<string | null>(null);

  const handleFieldChange = useCallback(
    (key: keyof MemoFields) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFields((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleLogoChange = useCallback(
    (setter: Dispatch<SetStateAction<string | null>>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setter((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return fileToUrl(file);
        });
      },
    [],
  );

  useEffect(() => {
    return () => {
      if (leftLogo) {
        URL.revokeObjectURL(leftLogo);
      }
    };
  }, [leftLogo]);

  useEffect(() => {
    return () => {
      if (rightLogo) {
        URL.revokeObjectURL(rightLogo);
      }
    };
  }, [rightLogo]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 print:bg-white print:text-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className={`text-3xl font-semibold text-white ${playfair.className}`}>
            Secretariat Memo Editor
          </h1>
          <p className="text-sm text-slate-300">
            Edit the memo below, update logos, and export a PDF-ready version with stamps and signatures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <Button onClick={handlePrint} className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">
            Download as PDF
          </Button>
          <span className="text-xs text-slate-400">
            Tip: Use your browser print dialog to save the memo as a PDF.
          </span>
        </div>

        <Card className="bg-white text-slate-900 shadow-xl print:shadow-none">
          <div className="flex flex-col gap-6 p-8 md:p-12">
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Left logo
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-32 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50">
                    {leftLogo ? (
                      <img src={leftLogo} alt="Left company logo" className="h-16 w-28 object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400">Logo preview</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange(setLeftLogo)}
                    className="text-xs text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700"
                  />
                </div>
              </div>

              <div className="text-center">
                <h2 className={`text-2xl font-semibold uppercase tracking-wide ${playfair.className}`}>
                  {fields.memoTitle}
                </h2>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{fields.department}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Right logo
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-32 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50">
                    {rightLogo ? (
                      <img src={rightLogo} alt="Right company logo" className="h-16 w-28 object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400">Logo preview</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange(setRightLogo)}
                    className="text-xs text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <input
                value={fields.companyName}
                onChange={handleFieldChange("companyName")}
                className={`w-full border-b border-dashed border-slate-300 pb-1 text-center text-xl font-semibold text-slate-900 outline-none ${playfair.className}`}
              />
              <input
                value={fields.department}
                onChange={handleFieldChange("department")}
                className="w-full border-b border-dashed border-slate-200 pb-1 text-center text-xs uppercase tracking-[0.25em] text-slate-500 outline-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Reference</label>
                <input
                  value={fields.reference}
                  onChange={handleFieldChange("reference")}
                  className="w-full border-b border-slate-200 pb-1 text-sm text-slate-800 outline-none"
                />
              </div>
              <div className="space-y-2 md:text-right">
                <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
                <input
                  value={fields.date}
                  onChange={handleFieldChange("date")}
                  className="w-full border-b border-slate-200 pb-1 text-sm text-slate-800 outline-none md:text-right"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {([
                ["To", "to"],
                ["From", "from"],
                ["Cc", "cc"],
                ["Subject", "subject"],
              ] as const).map(([label, key]) => (
                <div key={key} className="grid gap-2 md:grid-cols-[120px_1fr] md:items-center">
                  <span className="text-xs font-semibold uppercase text-slate-500">{label}</span>
                  <input
                    value={fields[key]}
                    onChange={handleFieldChange(key)}
                    className="w-full border-b border-slate-200 pb-1 text-sm text-slate-800 outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase text-slate-500">Memo body</label>
              <textarea
                value={fields.body}
                onChange={handleFieldChange("body")}
                rows={8}
                className="w-full resize-none rounded-md border border-slate-200 p-4 text-sm leading-relaxed text-slate-800 outline-none"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Closing</label>
                <input
                  value={fields.closing}
                  onChange={handleFieldChange("closing")}
                  className="w-full border-b border-slate-200 pb-1 text-sm text-slate-800 outline-none"
                />
                <div className="mt-6 space-y-1">
                  <p className={`text-2xl text-slate-700 ${greatVibes.className}`}>{fields.signerName}</p>
                  <input
                    value={fields.signerName}
                    onChange={handleFieldChange("signerName")}
                    className="w-full border-b border-slate-200 pb-1 text-sm text-slate-800 outline-none"
                  />
                  <input
                    value={fields.signerTitle}
                    onChange={handleFieldChange("signerTitle")}
                    className="w-full border-b border-slate-200 pb-1 text-xs uppercase tracking-[0.2em] text-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-2 border-dashed border-red-500 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-red-500">
                    <span className="text-[10px]">{fields.stampText}</span>
                  </div>
                </div>
                <input
                  value={fields.stampText}
                  onChange={handleFieldChange("stampText")}
                  className="w-full border-b border-slate-200 pb-1 text-center text-xs uppercase tracking-[0.2em] text-red-600 outline-none"
                />
                <div className="space-y-1">
                  <p className={`text-2xl text-slate-700 ${greatVibes.className}`}>{fields.approverName}</p>
                  <input
                    value={fields.approverName}
                    onChange={handleFieldChange("approverName")}
                    className="w-full border-b border-slate-200 pb-1 text-sm text-slate-800 outline-none"
                  />
                  <input
                    value={fields.approverTitle}
                    onChange={handleFieldChange("approverTitle")}
                    className="w-full border-b border-slate-200 pb-1 text-xs uppercase tracking-[0.2em] text-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
