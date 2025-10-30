"use client";

import React, { useEffect } from "react";
import { ShieldCheck, Lock, Key, Users, FileText, Database, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Aos from "aos";
import "aos/dist/aos.css";

export default function SecuritySection() {
    useEffect(() => {
        Aos.init({ duration: 1000, once: false });
    }, []);

    const features = [
        {
            id: "encryption",
            title: "End-to-end Encryption",
            desc: "All data in transit and at rest is encrypted using industry-standard AES-256 and TLS 1.3.",
            Icon: Lock,
        },
        {
            id: "sso",
            title: "SSO & SAML/OAuth",
            desc: "Centralize access with SSO providers (Google Workspace, Microsoft Entra, Okta).",
            Icon: Key,
        },
        {
            id: "rbac",
            title: "Role-based Access Control",
            desc: "Fine-grained permissions: Admin, Manager, Member, Guest — configurable per project.",
            Icon: Users,
        },
        {
            id: "audit",
            title: "Audit Logs & Monitoring",
            desc: "Immutable audit trail and realtime alerts for suspicious activity.",
            Icon: FileText,
        },
        {
            id: "backup",
            title: "Backups & Disaster Recovery",
            desc: "Daily encrypted backups, point-in-time restores, and regional failover options.",
            Icon: Database,
        },
        {
            id: "compliance",
            title: "Compliance & Certifications",
            desc: "SOC2 Type II, ISO 27001 readiness, and configurable data residency.",
            Icon: ShieldCheck,
        },
    ];

    return (
        <section className=" bg-background text-foreground py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold">Security & Compliance</h2>
                    <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                        Keep your projects and teams safe — built-in controls, strong encryption, and auditability.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Feature grid */}
                    <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((f) => (
                                <article
                                    key={f.id}
                                    className="flex gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow"
                                    aria-labelledby={`feature-${f.id}-title`}
                                    data-aos="fade-right"
                                    data-aos-delay="200"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <f.Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 id={`feature-${f.id}-title`} className="font-semibold text-foreground">
                                            {f.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Quick checklist */}
                        <div className="mt-6 p-5 rounded-lg bg-muted/5 border border-border" data-aos="fade-right" data-aos-delay="250">
                            <div className="flex items-center gap-3 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <strong>Recommended baseline</strong>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <li>SSO enforced for admins</li>
                                <li>Least privilege RBAC</li>
                                <li>2FA for all users</li>
                                <li>Daily encrypted backups</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right: Details / Accordion + Code Sample */}
                    <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="rounded-2xl border border-border p-6 bg-card shadow-sm" data-aos="fade-left" data-aos-delay="200">
                            <h4 className="font-semibold text-lg">Security Controls</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                                Configure security at organization, project, and team levels.
                            </p>

                            {/* Accordion */}
                            <details className="mt-4 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="cursor-pointer py-2 rounded-md hover:bg-muted/10 px-3 flex items-center justify-between">
                                    <span className="text-sm font-medium">Identity & Access</span>
                                    <span className="text-sm text-muted-foreground">SSO, SCIM, RBAC</span>
                                </summary>
                                <div className="mt-3 text-sm text-muted-foreground">
                                    Support for SAML 2.0 / OIDC, SCIM provisioning, and customizable roles. Admins can enforce 2FA and IP restrictions.
                                </div>
                            </details>

                            <details className="mt-4 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="cursor-pointer py-2 rounded-md hover:bg-muted/10 px-3 flex items-center justify-between">
                                    <span className="text-sm font-medium">Audit & Monitoring</span>
                                    <span className="text-sm text-muted-foreground">Logs, SIEM</span>
                                </summary>
                                <div className="mt-3 text-sm text-muted-foreground">
                                    Deliver audit logs to your SIEM, configure alerts, and export immutable logs.
                                </div>
                            </details>

                            <details className="mt-4 [&_summary::-webkit-details-marker]:hidden">
                                <summary className="cursor-pointer py-2 rounded-md hover:bg-muted/10 px-3 flex items-center justify-between">
                                    <span className="text-sm font-medium">Data Residency</span>
                                    <span className="text-sm text-muted-foreground">Regions</span>
                                </summary>
                                <div className="mt-3 text-sm text-muted-foreground">
                                    Choose EU / US / APAC storage regions. Data at rest is isolated for compliance.
                                </div>
                            </details>
                        </div>

                        {/* Developer Safety */}
                        <div className="rounded-2xl border border-border p-6 bg-card shadow-sm" data-aos="fade-left" data-aos-delay="250">
                            <h4 className="font-semibold text-lg">Developer Safety Tips</h4>
                            <p className="text-sm text-muted-foreground mt-2">
                                Small implementation patterns that reduce risk in production.
                            </p>

                            <pre className="mt-4 bg-muted/5 p-4 rounded-md overflow-x-auto text-sm">
                                {`// .env (never commit)
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
DATABASE_URL=postgres://user:pass@host:5432/dbname
JWT_SECRET=long-random-secret

// Example: server-side only check
// pages/api/webhook.js
export default async function handler(req, res) {
  const sig = req.headers['x-hook-sig'];
  if (!verifySignature(sig)) return res.status(401).end();
  // process
}
`}
                            </pre>

                        </div>
                    </motion.div>
                </div>

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 text-center text-sm text-muted-foreground"
                >
                    <p>
                        Need a custom security review? We offer penetration testing and architecture reviews for teams of all sizes.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
