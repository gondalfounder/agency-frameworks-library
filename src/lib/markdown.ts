import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import matter from "gray-matter";
import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighterInstance() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["vitesse-dark"],
      langs: [
        "javascript",
        "typescript",
        "tsx",
        "jsx",
        "html",
        "css",
        "json",
        "bash",
        "sh",
        "shell",
        "yaml",
        "yml",
        "markdown",
        "md",
        "mdx",
        "python",
        "sql",
      ],
    });
  }
  return highlighterPromise;
}

// Custom sanitizer schema allowing code classes, data attributes, table containers, etc.
const customSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes?.["*"] || []),
      "className",
      "id",
      "style",
      "data*",
      "aria*",
      "tabIndex",
    ],
    code: [
      ...(defaultSchema.attributes?.code || []),
      "className",
      "style",
    ],
    pre: [
      ...(defaultSchema.attributes?.pre || []),
      "className",
      "style",
      "dataLanguage",
    ],
    th: [
      ...(defaultSchema.attributes?.th || []),
      "align",
      "scope",
      "style",
    ],
    td: [
      ...(defaultSchema.attributes?.td || []),
      "align",
      "style",
    ],
    a: [
      ...(defaultSchema.attributes?.a || []),
      "href",
      "target",
      "rel",
      "ariaHidden",
      "className",
    ],
    div: [
      ...(defaultSchema.attributes?.div || []),
      "className",
      "style",
    ],
    span: [
      ...(defaultSchema.attributes?.span || []),
      "className",
      "style",
    ],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "button",
    "svg",
    "path",
    "div",
    "span",
  ],
};

export async function renderMarkdownToHtml(rawMarkdown: string): Promise<string> {
  const { content } = matter(rawMarkdown);
  const highlighter = await getHighlighterInstance();

  // Highlight code blocks plugin
  function rehypeShiki() {
    return (tree: any) => {
      function visit(node: any, parent: any, index: number) {
        if (node.type === "element" && node.tagName === "pre") {
          const codeNode = node.children?.find(
            (child: any) => child.type === "element" && child.tagName === "code"
          );

          if (codeNode) {
            const className = codeNode.properties?.className || [];
            let lang = "text";
            for (const cls of className) {
              if (typeof cls === "string" && cls.startsWith("language-")) {
                lang = cls.replace("language-", "");
                break;
              }
            }

            const rawCode = codeNode.children
              ?.map((c: any) => (c.type === "text" ? c.value : ""))
              .join("") || "";

            let highlightedHtml = "";
            try {
              const loadedLangs = highlighter.getLoadedLanguages();
              const validLang = loadedLangs.includes(lang) ? lang : "text";
              highlightedHtml = highlighter.codeToHtml(rawCode, {
                lang: validLang,
                theme: "vitesse-dark",
              });
            } catch {
              highlightedHtml = `<pre class="shiki"><code>${escapeHtml(rawCode)}</code></pre>`;
            }

            // Wrap in a custom container with header (language + copy button)
            const codeBlockWrapper = {
              type: "element",
              tagName: "div",
              properties: {
                className: ["code-block-wrapper", "my-6", "rounded-lg", "overflow-hidden", "border", "border-line", "dark:border-white/10"],
              },
              children: [
                {
                  type: "element",
                  tagName: "div",
                  properties: {
                    className: [
                      "code-block-header",
                      "flex",
                      "items-center",
                      "justify-between",
                      "px-4",
                      "py-2",
                      "bg-[#171F1E]",
                      "text-muted-2",
                      "border-b",
                      "border-white/10",
                      "font-mono",
                      "text-xs",
                      "uppercase",
                      "tracking-wider",
                    ],
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "span",
                      properties: { className: ["font-mono", "text-muted"] },
                      children: [{ type: "text", value: lang.toUpperCase() }],
                    },
                    {
                      type: "element",
                      tagName: "button",
                      properties: {
                        className: [
                          "copy-code-btn",
                          "flex",
                          "items-center",
                          "gap-1",
                          "text-[11px]",
                          "font-mono",
                          "text-muted-2",
                          "hover:text-white",
                          "transition-colors",
                          "cursor-pointer",
                          "px-2",
                          "py-1",
                          "rounded",
                          "hover:bg-white/10",
                        ],
                        "data-code": rawCode,
                        type: "button",
                        "aria-label": "Copy code to clipboard",
                      },
                      children: [
                        { type: "text", value: "Copy" }
                      ],
                    },
                  ],
                },
                {
                  type: "raw",
                  value: highlightedHtml,
                },
              ],
            };

            parent.children[index] = codeBlockWrapper;
            return;
          }
        }

        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            visit(node.children[i], node, i);
          }
        }
      }

      visit(tree, null, 0);
    };
  }

  // Wrap tables in responsive horizontal scroll containers
  function rehypeResponsiveTables() {
    return (tree: any) => {
      function visit(node: any, parent: any, index: number) {
        if (node.type === "element" && node.tagName === "table") {
          const wrapper = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["table-container", "overflow-x-auto", "my-6", "border", "border-line", "dark:border-white/10", "rounded-lg"],
            },
            children: [node],
          };
          parent.children[index] = wrapper;
          return;
        }
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            visit(node.children[i], node, i);
          }
        }
      }
      visit(tree, null, 0);
    };
  }

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["heading-anchor", "opacity-0", "group-hover:opacity-100", "transition-opacity", "ml-2", "text-accent", "no-underline"],
        ariaLabel: "Direct link to heading",
      },
      content: {
        type: "text",
        value: "#",
      },
    })
    .use(rehypeShiki)
    .use(rehypeResponsiveTables)
    .use(rehypeSanitize, customSanitizeSchema)
    .use(rehypeStringify);

  const file = await processor.process(content);
  return String(file);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
