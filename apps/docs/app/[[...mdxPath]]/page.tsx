import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { SkipNavContent } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import { useMDXComponents as getMDXComponents } from '../../mdx-components';
import {
  banner,
  docsRepositoryBase,
  footer,
  navbar,
  search,
} from '../../theme.config';

type PageParams = {
  mdxPath?: string[];
};

type ContentSection = 'docs' | 'api-reference' | 'top-level';
type SidebarPageMapItem = {
  name: string;
  route: string;
  title?: string;
  children?: SidebarPageMapItem[];
  frontMatter?: unknown;
  theme?: {
    collapsed?: boolean;
  };
};
type SidebarPageMap = SidebarPageMapItem[];

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata(props: {
  params: Promise<PageParams>;
}) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

function getContentSection(mdxPath: string[] = []): ContentSection {
  const [section] = mdxPath;

  if (section === 'docs') {
    return 'docs';
  }

  if (section === 'api-reference') {
    return 'api-reference';
  }

  return 'top-level';
}

function getPageMapRoute(section: ContentSection) {
  if (section === 'docs') {
    return '/docs';
  }

  if (section === 'api-reference') {
    return '/api-reference';
  }

  return null;
}

function getArticleClass(mdxPath: string[] = []) {
  const [section] = mdxPath;
  const isArticlePage = section === 'about' || section === 'showcase';

  return [
    'x:w-full x:min-w-0 x:break-words',
    'x:min-h-[calc(100vh-var(--nextra-navbar-height))]',
    'x:text-slate-700 x:dark:text-slate-200 x:pb-8 x:px-4 x:pt-4 x:md:px-12',
    isArticlePage ? 'nextra-body-typesetting-article' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function findPageMapItem(
  items: SidebarPageMapItem[],
  name: string,
  options?: { children?: boolean }
) {
  const item = items.find((candidate) => candidate.name === name);

  if (!item) {
    throw new Error(`Missing page map item "${name}"`);
  }

  if (options?.children && !('children' in item)) {
    throw new Error(`Expected "${name}" to have children`);
  }

  return item;
}

function withTitle(item: SidebarPageMapItem, title: string) {
  return {
    ...item,
    title,
  };
}

async function getDocsSidebarPageMap(): Promise<SidebarPageMap> {
  const docsPageMap = (await getPageMap('/docs')) as SidebarPageMap;
  const tutorial = findPageMapItem(docsPageMap, 'tutorial', { children: true });
  const visualization = findPageMapItem(docsPageMap, 'visualization');

  const tutorialChildren = tutorial.children!;
  const examples = findPageMapItem(tutorialChildren, 'basic', { children: true });
  const advanced = findPageMapItem(tutorialChildren, 'advanced', {
    children: true,
  });
  const gettingStarted = findPageMapItem(tutorialChildren, 'getting-started');
  const usage = findPageMapItem(tutorialChildren, 'usage');

  const exampleChildren = [
    findPageMapItem(examples.children!, 'state'),
    findPageMapItem(examples.children!, 'action'),
    findPageMapItem(examples.children!, 'hybrid'),
  ];

  return [
    {
      ...withTitle(tutorial, 'Tutorial'),
      children: [
        withTitle(gettingStarted, 'Getting Started'),
        withTitle(usage, 'Usage'),
        {
          ...withTitle(examples, 'Examples'),
          theme: {
            ...examples.theme,
            collapsed: false,
          },
          children: exampleChildren,
        },
        {
          ...withTitle(advanced, 'Advanced'),
          theme: {
            ...advanced.theme,
            collapsed: false,
          },
        },
      ],
    },
    withTitle(visualization, 'Visualization'),
  ];
}

export default async function Page(props: {
  params: Promise<PageParams>;
}) {
  const params = await props.params;
  const section = getContentSection(params.mdxPath);
  const pageMapRoute = getPageMapRoute(section);
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath
  );

  if (section === 'top-level') {
    return (
      <Layout
        banner={banner}
        navbar={navbar}
        search={search}
        pageMap={await getPageMap('/')}
        docsRepositoryBase={docsRepositoryBase}
        footer={footer}
      >
        <div className="x:mx-auto x:flex x:max-w-(--nextra-content-width)">
          <article className={getArticleClass(params.mdxPath)}>
            <SkipNavContent />
            <main data-pagefind-body>
              <MDXContent {...props} params={params} />
            </main>
          </article>
        </div>
      </Layout>
    );
  }

  if (section === 'docs') {
    return (
      <Layout
        banner={banner}
        navbar={navbar}
        search={search}
        pageMap={await getDocsSidebarPageMap()}
        docsRepositoryBase={docsRepositoryBase}
        footer={footer}
      >
        <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
          <MDXContent {...props} params={params} />
        </Wrapper>
      </Layout>
    );
  }

  return (
    <Layout
      banner={banner}
      navbar={navbar}
      search={search}
      pageMap={await getPageMap(pageMapRoute)}
      docsRepositoryBase={docsRepositoryBase}
      footer={footer}
    >
      <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
        <MDXContent {...props} params={params} />
      </Wrapper>
    </Layout>
  );
}
