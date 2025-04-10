import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import Link from "../Link";
import { sans } from "../fonts";
import remarkSmartpants from "remark-smartypants";
import rehypePrettyCode from "rehype-pretty-code";
import { remarkMdxEvalCodeBlock } from "./mdx.js";
import overnight from "overnight/themes/Overnight-Slumber.json";
import "./markdown.css";

overnight.colors["editor.background"] = "var(--code-bg)";

export default async function PostPage({ params }) {
  const { slug } = await params;
  let filename = "./public/" + slug + "/index.md";
  let file;

  // Try to read Chinese version first
  try {
    file = await readFile("./public/" + slug + "/index.zh-hans.md", "utf8");
    filename = "./public/" + slug + "/index.zh-hans.md";
  } catch (error) {
    // If Chinese version doesn't exist, fall back to English
    file = await readFile("./public/" + slug + "/index.md", "utf8");
  }

  let postComponents = {};
  try {
    postComponents = await import("../../public/" + slug + "/components.js");
  } catch (e) {
    if (!e || e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }
  const { content, data } = matter(file);
  const discussUrl = `https://bsky.app/search?q=${encodeURIComponent(
    `https://overreacted.io/${slug}/`
  )}`;
  const editUrl = `https://github.com/gaearon/overreacted.io/edit/main/public/${encodeURIComponent(
    slug
  )}/index.md`;
  return (
    <article>
      <h1
        className={[
          sans.className,
          "text-[40px] font-black leading-[44px] text-[--title]",
        ].join(" ")}
      >
        {data.title}
      </h1>
      <p className="mt-2 text-[13px] text-gray-700 dark:text-gray-300">
        {new Date(data.date).toLocaleDateString("en", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <div className="markdown mt-10">
        <MDXRemote
          source={content}
          components={{
            a: Link,
            img: ({ src, ...rest }) => {
              if (src && !/^https?:\/\//.test(src)) {
                // https://github.com/gaearon/overreacted.io/issues/827
                src = `/${slug}/${src}`;
              }
              return <img src={src} {...rest} />;
            },
            ...postComponents,
          }}
          options={{
            mdxOptions: {
              useDynamicImport: true,
              remarkPlugins: [
                remarkSmartpants,
                [remarkMdxEvalCodeBlock, filename],
              ],
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: overnight,
                  },
                ],
              ],
            },
          }}
        />
        <hr />
        <p>
          <Link href={discussUrl}>Discuss on Bluesky</Link>
          &nbsp;&nbsp;&middot;&nbsp;&nbsp;
          <Link href={editUrl}>Edit on GitHub</Link>
        </p>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const entries = await readdir("./public/", { withFileTypes: true });
  const dirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  return dirs.map((dir) => ({ slug: dir }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let file;

  // Try to read Chinese version first
  try {
    file = await readFile("./public/" + slug + "/index.zh-hans.md", "utf8");
  } catch (error) {
    // If Chinese version doesn't exist, fall back to English
    file = await readFile("./public/" + slug + "/index.md", "utf8");
  }

  let { data } = matter(file);
  return {
    title: data.title + " — overreacted",
    description: data.spoiler,
  };
}
