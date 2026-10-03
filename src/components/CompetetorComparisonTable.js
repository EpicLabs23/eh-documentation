import React from "react";

const FeatureRow = ({ feature, ecp, cpanel, vesta, cloudpanel }) => (
  <tr className="border-b">
    <td className="px-4 py-3 font-bold">{feature}</td>
    <td className="px-4 py-3 text-center">{ecp}</td>
    <td className="px-4 py-3 text-center">{cpanel}</td>
    <td className="px-4 py-3 text-center">{vesta}</td>
    <td className="px-4 py-3 text-center">{cloudpanel}</td>
  </tr>
);

export default function CompetitorComparisonTable() {
  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-4 text-left">Feature</th>
            <th className="p-4 text-center">ECP</th>
            <th className="p-4 text-center">cPanel</th>
            <th className="p-4 text-center">VestaCP</th>
            <th className="p-4 text-center">CloudPanel</th>
          </tr>
        </thead>
        <tbody>
          <FeatureRow feature="Pricing" ecp="Free, unlimited accounts (paid support available)" cpanel="Paid licence, priced per account" vesta="Free" cloudpanel="Free" />
          <FeatureRow feature="User Interface" ecp="Modern & clean" cpanel="Feature-rich, complex" vesta="Basic & outdated" cloudpanel="Modern & clean" />
          <FeatureRow feature="Operating System Support" ecp="Ubuntu 22.04 / 24.04" cpanel="CentOS, AlmaLinux, Ubuntu" vesta="CentOS, Ubuntu, Debian" cloudpanel="Debian, Ubuntu" />
          <FeatureRow feature="Web Server" ecp="Nginx + OpenLiteSpeed" cpanel="Apache, Nginx, LiteSpeed" vesta="Apache, Nginx" cloudpanel="Nginx (Optimized)" />
          <FeatureRow feature="Language Support" ecp="PHP, NodeJS, Python, .NET, static sites, any app that runs in a container" cpanel="Mostly PHP (some other via ad-ones)" vesta="PHP" cloudpanel="PHP, Python, NodeJS" />
          <FeatureRow feature="Database Support" ecp="MariaDB/MySQL, PostgreSQL, MSSQL, MongoDB" cpanel="MySQL, PostgreSQL" vesta="MySQL, PostgreSQL" cloudpanel="MariaDB, MySQL" />
          <FeatureRow feature="Email Server" ecp="Business email service (coming soon)" cpanel="Included (Exim, Dovecot)" vesta="Included (Exim, Dovecot)" cloudpanel="Not Included" />
          <FeatureRow feature="Deployment" ecp="Git (GitHub, GitLab, Bitbucket), push webhooks, upload, cPanel import" cpanel="Direct Upload" vesta="Direct Upload" cloudpanel="SFTP / SSH" />
          <FeatureRow feature="DNS Management" ecp="Built-in (BIND9, Cloudflare)" cpanel="Built-in" vesta="Built-in" cloudpanel="Not Included" />
          <FeatureRow feature="Multi-Domain Hosting" ecp="Yes" cpanel="Yes" vesta="Yes" cloudpanel="Yes" />
          <FeatureRow feature="Multi-User Support" ecp="Yes" cpanel="Yes (Reseller & User Accounts)" vesta="Single Admin Only" cloudpanel="Yes" />
          <FeatureRow feature="Resource Usage" ecp="Lightweight" cpanel="Heavy (High RAM & CPU usage)" vesta="Lightweight" cloudpanel="Lightweight (Optimized for Cloud)" />
          <FeatureRow feature="Backup System" ecp="Encrypted off-site backups (storage.bd)" cpanel="Automated Backups, Cloud Integration" vesta="Basic Backups" cloudpanel="Snapshot-based Backups" />
          <FeatureRow feature="Security Features" ecp="Per-account containers, network isolation, WAF, rate limiting" cpanel="Firewall, ModSecurity, SSL Management" vesta="Basic Security, No Advanced Rules" cloudpanel="Cloudflare & Nginx Security Optimizations" />
          <FeatureRow feature="Third-Party App Support" ecp="Billing integration API (WHMCS-style), Managed WordPress" cpanel="Softaculous, WHMCS, Many Add-ons" vesta="Limited" cloudpanel="Limited (Focus on Cloud Performance)" />
          <FeatureRow feature="Ease of Use" ecp="Easy & Modern UI" cpanel="High Learning Curve" vesta="Simple but Outdated" cloudpanel="Easy & Modern UI" />
          <FeatureRow feature="Best For" ecp="Shared Hosting Providers, Enterprises, Software Dev Teams and Small VPS Users" cpanel="Shared Hosting Providers, Enterprises" vesta="Small VPS Users, Personal Projects" cloudpanel="Cloud Hosting, High Performance Apps" />
        </tbody>
      </table>
    </div>
  );
}
