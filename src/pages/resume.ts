import type { APIRoute } from "astro";

export const prerender = false;

const GITHUB_ASSET_URL =
  "https://github.com/regarager/resume/releases/latest/download/main.pdf";

export const GET: APIRoute = async () => {
  const upstream = await fetch(GITHUB_ASSET_URL, {
    headers: { "User-Agent": "astro-resume-proxy" },
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Resume not available", { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set("Content-Disposition", 'inline; filename="resume.pdf"');
  headers.set("Cache-Control", "public, max-age=86400, s-maxage=3600");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);

  return new Response(upstream.body, { status: 200, headers });
};
