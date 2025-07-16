import { NextRequest, NextResponse } from 'next/server';


interface Lead {
  name: string;
  email: string;
  company: string;
  role: string;
  platforms: string[];
  score: number;
  rank: 'hot' | 'warm' | 'cold';
  link: string;
  snippet: string;
}

// Real web scraping using Puppeteer
interface Filters {
  search?: string;
  company?: string;
  nationality?: string[];
  roles?: string[];
  industries?: string[];
  platforms?: string[];
}

const GOOGLE_API_KEY = "AIzaSyDaNZr7nZrO2nkVYjIRdkPAPQoIMwcEmfs";
const GOOGLE_CX = "e7915fa92ab4b40bf"; // Set to your provided Custom Search Engine ID

async function extractLeads(filters: Filters): Promise<Lead[]> {
  // Build a search query from filters
  let query = filters.search || '';
  if (filters.company) query += ` company:${filters.company}`;
  if (filters.nationality && filters.nationality.length > 0) query += ` ${filters.nationality.map((n: string) => `site:${n.toLowerCase()}.com`).join(' OR ')}`;
  if (filters.roles?.length) query += ` ${filters.roles.join(' OR ')}`;
  if (filters.industries?.length) query += ` ${filters.industries.join(' OR ')}`;
  if (filters.platforms?.length) query += ` ${filters.platforms.join(' OR ')}`;

  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();

  const items = (data.items ?? []) as Array<{ title?: string; link?: string; snippet?: string }>;
  const leads = items.map((item, i) => {
    const rank: "hot" | "warm" | "cold" =
      i === 0 ? "hot" : i < 3 ? "warm" : "cold";
    return {
      name: item.title || "",
      email: "", // Not available from Google API
      company: filters.company || "",
      role: filters.roles?.[0] || "",
      platforms: filters.platforms || [],
      score: 100 - i * 10,
      rank,
      link: item.link || "",
      snippet: item.snippet || "",
    };
  });
  return leads;
}

export async function POST(req: NextRequest) {
  const filters = await req.json();
  const leads = await extractLeads(filters);
  return NextResponse.json({ leads });
}
