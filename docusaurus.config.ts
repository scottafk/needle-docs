import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
const DefaultLocale = "en";
const config: Config = {
  title: 'Needle',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: "https://scottafk.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/needle-docs/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'IBAX-io', // Usually your GitHub org/user name.
  projectName: 'needle', // Usually your repo name.
  deploymentBranch: "gh-pages",

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: "/",
          breadcrumbs: true,
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: ({ locale, versionDocsDirPath, docPath }) => {
            // Link to Crowdin for translate docs
            if (locale !== DefaultLocale) {
              return `https://crowdin.com/project/needle/${locale}`;
            }
            // Link to GitHub for English docs
            return `https://github.com/scottafk/needle-docs/edit/main/${versionDocsDirPath}/${docPath}`;
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Needle',
      logo: {
        alt: 'Needle Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'documentationSidebar',
          position: 'left',
          label: 'Needle',
        },
        {
          type: "search",
          position: "right",
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
        // {
        //   type: "docsVersionDropdown",
        //   position: "right",
        //   dropdownItemsAfter: [{ to: '/versions', label: 'All versions' }],
        //   dropdownActiveClassDisabled: true,
        // },
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
      style: 'dark',
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Documentation",
              to: "/",
            },
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
      copyright: `Copyright © ${new Date().getFullYear()} Neele Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
