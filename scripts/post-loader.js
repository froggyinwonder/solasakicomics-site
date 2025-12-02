/* ============================================
   BLOG SYSTEM — POST LOADER
   ============================================ */

/* STEP 1: GET POST FOLDER NAME FROM URL
   Example:
   /writings/my-yellow-thoughts/
   → slug = "my-yellow-thoughts"
*/
const urlParts = window.location.pathname.split("/").filter(x => x);
const slug = urlParts[urlParts.length - 1];   // post name

/* Markdown file for this post */
const mdURL = `../${slug}.md`;

/* DOM elements */
const titleEl = document.getElementById("blog-title");
const dateEl = document.getElementById("blog-date");
const contentEl = document.getElementById("blog-content");
const headTitle = document.getElementById("post-title");
const headDesc = document.getElementById("post-desc");

/* ============================================
   SIMPLE MARKDOWN PARSER (headings, paragraphs)
   ============================================ */
function mdToHTML(md) {

  // Bold
  md = md.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italics
  md = md.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Headings
  md = md.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  md = md.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  md = md.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Line breaks
  md = md.replace(/\n\n/g, "<br><br>");

  return md;
}

/* ============================================
   LOAD MARKDOWN
   ============================================ */
async function loadPost() {
  try {
    const res = await fetch(mdURL);
    if (!res.ok) throw new Error("Markdown not found");

    const raw = await res.text();

    // Split YAML frontmatter
    const parts = raw.split("---");
    const front = parts[1];
    const body = parts[2];

    /* Parse YAML */
    const titleMatch = front.match(/title:\s*"(.*?)"/);
    const dateMatch = front.match(/date:\s*"(.*?)"/);

    const title = titleMatch ? titleMatch[1] : slug;
    const date = dateMatch ? dateMatch[1] : "";

    /* Inject title/date */
    titleEl.textContent = title;
    dateEl.textContent = date;

    /* Inject content */
    contentEl.innerHTML = mdToHTML(body);

    /* Update SEO Title */
    headTitle.textContent = `${title} — Solasaki Comics`;

    /* Update SEO Description (first 150 chars) */
    const desc = body.replace(/\n/g, " ").slice(0, 150);
    headDesc.setAttribute("content", desc);

    /* JSON-LD for Google */
    injectJSONLD(title, date, desc);

  } catch (e) {
    contentEl.innerHTML = "<p>Could not load this post.</p>";
  }
}

/* ============================================
   INJECT GOOGLE BLOGPOSTING SCHEMA
   ============================================ */
function injectJSONLD(title, date, desc) {
  const script = document.createElement("script");
  script.setAttribute("type", "application/ld+json");

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: date,
    description: desc,
    author: {
      "@type": "Person",
      "name": "Surbhi Suman"
    },
    publisher: {
      "@type": "Organization",
      "name": "Solasaki Comics"
    },
    mainEntityOfPage: window.location.href
  });

  document.head.appendChild(script);
}

/* Run */
loadPost();
