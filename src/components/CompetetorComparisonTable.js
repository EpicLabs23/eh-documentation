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
          <FeatureRow feature="Pricing" ecp="Starting at $19 / month (Upto 5 ECP user accounts)" cpanel="Starting at $32.99 / month (Upto 5 ECP user accounts)" vesta="Free" cloudpanel="Free" />
          <FeatureRow feature="User Interface" ecp="Modern & clean" cpanel="Feature-rich, complex" vesta="Basic & outdated" cloudpanel="Modern & clean" />
          <FeatureRow feature="Operating System Support" ecp="Tested with Ubuntu" cpanel="CentOS, AlmaLinux, Ubuntu" vesta="CentOS, Ubuntu, Debian" cloudpanel="Debian, Ubuntu" />
          <FeatureRow feature="Web Server" ecp="Nginx" cpanel="Apache, Nginx, LiteSpeed" vesta="Apache, Nginx" cloudpanel="Nginx (Optimized)" />
          <FeatureRow feature="Language Support" ecp="NodeJS, PHP, Python, (Go,.Net)" cpanel="Mostly PHP (some other via ad-ones)" vesta="PHP" cloudpanel="PHP, Python, NodeJS" />
          <FeatureRow feature="Database Support" ecp="MySql, MariaDB, PostgreSQL, MongoDB" cpanel="MySQL, PostgreSQL" vesta="MySQL, PostgreSQL" cloudpanel="MariaDB, MySQL" />
          <FeatureRow feature="Email Server" ecp="Optional (Included, Integrated)" cpanel="Included (Exim, Dovecot)" vesta="Included (Exim, Dovecot)" cloudpanel="Not Included" />
          <FeatureRow feature="Deployment" ecp="Modern ways like, Git, Webhook" cpanel="Direct Upload" vesta="Direct Upload" cloudpanel="Need to check" />
          <FeatureRow feature="DNS Management" ecp="Built-in (BIND9, Cloudflare)" cpanel="Built-in" vesta="Built-in" cloudpanel="Not Included" />
          <FeatureRow feature="Multi-Domain Hosting" ecp="Yes" cpanel="Yes" vesta="Yes" cloudpanel="Yes" />
          <FeatureRow feature="Multi-User Support" ecp="Yes" cpanel="Yes (Reseller & User Accounts)" vesta="Single Admin Only" cloudpanel="Yes" />
          <FeatureRow feature="Resource Usage" ecp="Lightweight" cpanel="Heavy (High RAM & CPU usage)" vesta="Lightweight" cloudpanel="Lightweight (Optimized for Cloud)" />
          <FeatureRow feature="Backup System" ecp="Advanced Backups & Cloud Integration" cpanel="Automated Backups, Cloud Integration" vesta="Basic Backups" cloudpanel="Snapshot-based Backups" />
          <FeatureRow feature="Security Features" ecp="Secured with modern security tools" cpanel="Firewall, ModSecurity, SSL Management" vesta="Basic Security, No Advanced Rules" cloudpanel="Cloudflare & Nginx Security Optimizations" />
          <FeatureRow feature="Third-Party App Support" ecp="Not Yet" cpanel="Softaculous, WHMCS, Many Add-ons" vesta="Limited" cloudpanel="Limited (Focus on Cloud Performance)" />
          <FeatureRow feature="Ease of Use" ecp="Easy & Modern UI" cpanel="High Learning Curve" vesta="Simple but Outdated" cloudpanel="Easy & Modern UI" />
          <FeatureRow feature="Best For" ecp="Shared Hosting Providers, Enterprises, Software Dev Teams and Small VPS Users" cpanel="Shared Hosting Providers, Enterprises" vesta="Small VPS Users, Personal Projects" cloudpanel="Cloud Hosting, High Performance Apps" />
        </tbody>
      </table>
    </div>
  );
}
