// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

const DefaultLocale = 'en';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Needle",
  tagline: "Dinosaurs are cool",
  favicon: "img/favicon.ico",
  // Set the production url of your site here
  url: "https://scottafk.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/needle-docs/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "IBAX-io", // Usually your GitHub org/user name.
  projectName: "needle", // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en","fr"],
  },
   presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // routeBasePath: "/",
          breadcrumbs: true,
          sidebarPath: "./sidebars.js",
          editUrl: ({locale, versionDocsDirPath, docPath}) => {
            // Link to Crowdin for translate docs
            if (locale !== DefaultLocale) {
              return `https://crowdin.com/project/needle/${locale}`;
            }
            // Link to GitHub for English docs
            return `https://github.com/scottafk/needle-docs/edit/main/${versionDocsDirPath}/${docPath}`;
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        // sitemap: {
        //   changefreq: 'weekly',
        //   priority: 0.5,
        //   ignorePatterns: ['/tags/**'],
        //   filename: 'sitemap.xml',
        // },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: "Needle",
        logo: {
          alt: "Needle Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          // {
          //   type: "docSidebar",
          //   sidebarId: "documentationSidebar",
          //   position: "left",
          //   label: "Needle",
          // },
          {
            type: "search",
            position: "right",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
            // dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
            dropdownActiveClassDisabled: true,
          },
          {
            type: "localeDropdown",
            position: "right",
            dropdownItemsAfter: [
              {
                type: "html",
                value: '<hr style="margin: 0.3rem 0;">',
              },
              {
                href: "https://crowdin.com/project/needle",
                label: "Help Us Translate",
              },
            ],
          },
          {
            href: "https://github.com/IBAX-io/needle",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      algolia: {
        // This API key is "search-only" and safe to be published
        apiKey: "ef4d9c757bc56cd76df15626c6fc5b97",
        appId: "01H350K8AP",
        indexName: "needle",
        contextualSearch: true,
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/intro",
              },
              // {
              //   label: "Documentation",
              //   to: "/needle/spec",
              // },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/docusaurus",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/IBAX-io/needle",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Needle Project Team. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
