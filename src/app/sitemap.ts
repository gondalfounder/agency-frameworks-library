import { MetadataRoute } from "next";
import { getAllFrameworks, getAllCategories } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agency-frameworks.vercel.app";
  const frameworks = getAllFrameworks();
  const categories = getAllCategories();

  const frameworkUrls = frameworks.map((f) => ({
    url: `${baseUrl}/frameworks/${f.slug}`,
    lastModified: new Date(f.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/frameworks`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...frameworkUrls,
    ...categoryUrls,
  ];
}
