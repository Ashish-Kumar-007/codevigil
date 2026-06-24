import React from 'react';
import { Card } from '../components/ui/card';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <div className="mb-10 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-[#00f0ff]/10 flex items-center justify-center border border-[#00f0ff]/30">
          <Shield className="h-6 w-6 text-[#00f0ff]" />
        </div>
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-400 mt-1">Last updated: June 2026</p>
        </div>
      </div>

      <Card className="bg-[#0a0e1a]/80 border-white/10 backdrop-blur-xl p-8 md:p-12 prose prose-invert max-w-none prose-headings:text-[#00f0ff] prose-a:text-[#00fa88]">
        <h2 className="text-2xl font-bold mb-4 text-[#00f0ff]">1. Information We Collect</h2>
        <p className="text-slate-300 mb-6 leading-relaxed">
          At CodeVigil, we prioritize your privacy and security. We collect minimal information necessary to provide our code scanning and threat analysis services. This includes:
        </p>
        <ul className="list-disc pl-6 text-slate-300 mb-8 space-y-2">
          <li><strong>Submitted Snippets:</strong> Code snippets or messages you submit for analysis. These are processed ephemerally and are not stored permanently unless you explicitly choose to submit them as a public report.</li>
          <li><strong>Usage Data:</strong> Anonymous telemetry regarding application usage, feature interaction, and crash reports to improve our platform's stability.</li>
          <li><strong>Account Information:</strong> If you choose to register or link a Web3 wallet, we securely store public wallet addresses or basic profile information.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-[#00f0ff]">2. How We Use Your Data</h2>
        <p className="text-slate-300 mb-6 leading-relaxed">
          The information we collect is strictly utilized for the following purposes:
        </p>
        <ul className="list-disc pl-6 text-slate-300 mb-8 space-y-2">
          <li>To power our heuristic scanning engines and identify emerging threats.</li>
          <li>To populate the community-driven Scam Database (only when explicitly authorized).</li>
          <li>To detect, prevent, and address technical issues or fraudulent activity.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-[#00f0ff]">3. Data Security & Retention</h2>
        <p className="text-slate-300 mb-8 leading-relaxed">
          We employ industry-standard security measures, including end-to-end encryption for data in transit. Scanned code snippets that are not submitted as community reports are purged from memory immediately following the analysis lifecycle. We do not sell, rent, or trade your personal information to third parties.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-[#00f0ff]">4. Decentralized Infrastructure</h2>
        <p className="text-slate-300 mb-8 leading-relaxed">
          Because CodeVigil operates utilizing decentralized nodes for community reports, please be aware that data submitted to the public registry becomes immutable. Do not include API keys, mnemonic phrases, or personally identifiable information (PII) in public reports.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-[#00f0ff]">5. Contact Us</h2>
        <p className="text-slate-300 leading-relaxed">
          If you have questions or concerns regarding this Privacy Policy, please contact our security team at <a href="mailto:security@codevigil.xyz" className="text-[#00f0ff] hover:underline">security@codevigil.xyz</a>.
        </p>
      </Card>
    </div>
  );
}
