import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/architecture',
      ],
    },
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'user-guide/parts-management',
        'user-guide/document-control',
        'user-guide/change-orders',
        'user-guide/requirements',
        'user-guide/tasks-kanban',
        'user-guide/workflows',
      ],
    },
    {
      type: 'category',
      label: 'Administrator Guide',
      items: [
        'admin-guide/user-management',
        'admin-guide/permissions',
        'admin-guide/lifecycle-management',
        'admin-guide/custom-item-types',
        'admin-guide/runtime-configuration',
        'admin-guide/backup-recovery',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/docker-compose',
        'deployment/single-server',
        'deployment/distributed',
        'deployment/kubernetes',
        'deployment/cloud-database',
        'deployment/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/setup',
        'development/architecture',
        'development/code-conventions',
        'development/testing',
        'development/adding-item-types',
        'development/contributing',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/authentication',
        'api/items',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/common-issues',
        'troubleshooting/faq',
      ],
    },
  ],
};

export default sidebars;
