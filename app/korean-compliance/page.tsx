"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import CommandPalette from "@/components/CommandPalette";
import FooterMinimal from "@/components/FooterMinimal";
import { Shield, CheckCircle2, Lock, Database, FileCheck, Globe, Building2, Users } from "lucide-react";

export default function KoreanCompliancePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopBar onOpenPalette={() => setOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">한국 AI 규정 완전 준수</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Korean AI Compliance
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              AdGenXAI meets all Korean regulatory requirements for AI-powered advertising solutions
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-sm text-slate-400">PIPA Compliant</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">ISO 27001</div>
              <div className="text-sm text-slate-400">Certified</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">KR Data</div>
              <div className="text-sm text-slate-400">Localization</div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">24/7</div>
              <div className="text-sm text-slate-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Compliance Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Regulatory Compliance
            </span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Full compliance with Korean AI regulations, data protection laws, and industry standards
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PIPA Compliance */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-500/10 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">PIPA Compliance</h3>
                  <p className="text-slate-400 text-sm mb-4">개인정보 보호법 (Personal Information Protection Act)</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Consent management for personal data processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Right to data deletion and portability</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Transparent data usage notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Designated Chief Privacy Officer (CPO)</span>
                </li>
              </ul>
            </div>

            {/* Korean AI Act */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <FileCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Korean AI Act</h3>
                  <p className="text-slate-400 text-sm mb-4">인공지능 기본법 (AI Framework Act)</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">AI transparency and explainability requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Bias detection and mitigation systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Human oversight for high-risk AI decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Regular AI impact assessments</span>
                </li>
              </ul>
            </div>

            {/* Data Localization */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-green-500/50 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-500/10 p-3 rounded-xl">
                  <Database className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Data Localization</h3>
                  <p className="text-slate-400 text-sm mb-4">데이터 국내 저장 요구사항</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Korean user data stored in Korea-based servers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Compliance with cross-border data transfer rules</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Local backup and disaster recovery</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">MSIP (Ministry of Science and ICT) compliance</span>
                </li>
              </ul>
            </div>

            {/* Security Standards */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-500/10 p-3 rounded-xl">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-white">Security Standards</h3>
                  <p className="text-slate-400 text-sm mb-4">정보보호 관리체계 (ISMS-P)</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">ISMS-P certification ready</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">End-to-end encryption for all data</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">24/7 security monitoring and incident response</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Compliance */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Advertising Standards Compliance
            </span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Adherence to Korean advertising regulations and industry best practices
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Fair Trade Commission</h3>
              <p className="text-slate-400 text-sm mb-4">공정거래위원회 규정 준수</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Truth in advertising requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Clear disclosure of sponsored content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Prohibition of deceptive practices</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">MSIT Guidelines</h3>
              <p className="text-slate-400 text-sm mb-4">과학기술정보통신부 가이드라인</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Digital advertising platform compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Data-driven marketing transparency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Consumer protection measures</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <div className="bg-green-500/10 p-3 rounded-lg w-fit mb-4">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">User Rights</h3>
              <p className="text-slate-400 text-sm mb-4">사용자 권리 보호</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Opt-out mechanisms for targeted ads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Clear privacy policy in Korean</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>User data access and control</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Technical Implementation
            </span>
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Our infrastructure is designed with Korean compliance requirements at its core
          </p>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Infrastructure</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <Database className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Korean Data Centers</div>
                      <div className="text-sm text-slate-400">Seoul & Busan region servers with 99.99% uptime</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Lock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Encryption Standards</div>
                      <div className="text-sm text-slate-400">AES-256 encryption at rest, TLS 1.3 in transit</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Access Controls</div>
                      <div className="text-sm text-slate-400">Role-based access with MFA and audit logging</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Compliance Tools</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-lg">
                      <FileCheck className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Automated Compliance Checks</div>
                      <div className="text-sm text-slate-400">Real-time monitoring of regulatory requirements</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Consent Management</div>
                      <div className="text-sm text-slate-400">Granular user consent tracking and management</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Audit & Reporting</div>
                      <div className="text-sm text-slate-400">Comprehensive compliance reports and audit trails</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur border border-purple-500/20 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Launch in Korea?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Our team is ready to help you navigate Korean compliance requirements and launch your AI-powered advertising campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                Get Started
              </a>
              <a
                href="mailto:compliance@adgenxai.com"
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 border border-slate-700"
              >
                Contact Compliance Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterMinimal />
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
