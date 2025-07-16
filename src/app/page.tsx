"use client";
import { useState } from "react";
import { FiSearch, FiX, FiFilter, FiUser, FiMail, FiBriefcase, FiAward, FiBarChart2 } from "react-icons/fi";

const NATIONALITIES = ["USA", "UK", "India", "Canada", "Germany", "France", "Australia"];
const ROLES = ["CEO", "CFO", "CTO", "CMO", "Director", "Manager", "Founder"];
const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing"];
const PLATFORMS = ["LinkedIn", "Twitter", "Instagram", "Facebook", "Other"];

type Lead = {
  name: string;
  email: string;
  company: string;
  role: string;
  platforms: string[];
  score: number;
  rank: "hot" | "warm" | "cold";
  link?: string;
  snippet?: string;
};

export default function Home() {
  const [form, setForm] = useState({
    search: "",
    company: "",
    nationality: [] as string[],
    roles: [] as string[],
    industries: [] as string[],
    platforms: [] as string[],
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleMulti(field: keyof typeof form, value: string) {
    setForm((prev) => {
      const fieldValues = prev[field] as string[];
      return {
        ...prev,
        [field]: fieldValues.includes(value)
          ? fieldValues.filter((v: string) => v !== value)
          : [...fieldValues, value],
      };
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setForm({
      search: "",
      company: "",
      nationality: [],
      roles: [],
      industries: [],
      platforms: [],
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLeads([]);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "API error");
      }
      const data = await res.json();
      if (!data.leads || data.leads.length === 0) {
        setError("No leads found. Try different keywords or filters.");
      }
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch leads.");
      setLeads([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900">Leads Finder</h1>
          <p className="mt-4 text-xl text-gray-600">Find your next customer.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <input
                type="text"
                name="search"
                value={form.search}
                onChange={handleChange}
                placeholder="Search keywords, job titles, skills..."
                className="w-full px-4 py-3 border border-gray-400 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 text-gray-800 hover:text-gray-900"
              >
                <FiFilter />
                <span>Filters</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-700 to-blue-700 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                <FiSearch />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-6 border-b border-gray-200 bg-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Filter by company"
                    className="w-full px-4 py-2 border border-gray-400 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <div className="flex flex-wrap gap-2">
                    {NATIONALITIES.map((nat) => (
                      <button
                        key={nat}
                        type="button"
                        onClick={() => toggleMulti("nationality", nat)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          form.nationality.includes(nat)
                            ? "bg-purple-700 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {nat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleMulti("roles", role)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          form.roles.includes(role)
                            ? "bg-purple-700 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industries</label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleMulti("industries", industry)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          form.industries.includes(industry)
                            ? "bg-purple-700 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => toggleMulti("platforms", platform)}
                        className={`px-3 py-1 text-sm rounded-full ${
                          form.platforms.includes(platform)
                            ? "bg-purple-700 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-gray-900"
                >
                  <FiX />
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </form>

        {loading && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-800">Searching for leads...</span>
            </div>
          </div>
        )}

        {leads.length > 0 && !error && (
          <div className="overflow-hidden mt-2">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">
                {leads.length} {leads.length === 1 ? "Lead" : "Leads"} Found
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>Relevance</option>
                  <option>Score (High to Low)</option>
                  <option>Score (Low to High)</option>
                  <option>Name (A-Z)</option>
                  <option>Name (Z-A)</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiUser className="opacity-80 text-gray-700" />
                        <span>Name</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Link
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Snippet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiMail className="opacity-80 text-gray-700" />
                        <span>Email</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiBriefcase className="opacity-80 text-gray-700" />
                        <span>Company</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Platforms
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiBarChart2 className="opacity-80 text-gray-700" />
                        <span>Score</span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiAward className="opacity-80 text-gray-700" />
                        <span>Rank</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{lead.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-700 underline">
                        {lead.link ? (
                          <a href={lead.link} target="_blank" rel="noopener noreferrer">Visit</a>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-pre-line text-gray-700 max-w-xs">
                        {lead.snippet || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {lead.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                        {lead.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {lead.platforms && lead.platforms.map((p: string) => (
                            <span key={p} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-gray-300 rounded-full h-2">
                            <div
                              className="bg-purple-700 h-2 rounded-full"
                              style={{ width: `${Math.min(100, lead.score)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-800">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lead.rank === "hot"
                              ? "bg-red-200 text-red-900"
                              : lead.rank === "warm"
                              ? "bg-yellow-200 text-yellow-900"
                              : "bg-blue-200 text-blue-900"
                          }`}
                        >
                          {lead.rank.charAt(0).toUpperCase() + lead.rank.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{leads.length}</span> of{' '}
                <span className="font-medium">{leads.length}</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-400 rounded-md text-sm font-medium text-gray-800 bg-white hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-400 rounded-md text-sm font-medium text-gray-800 bg-white hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-red-700">{error}</h3>
            <p className="mt-2 text-gray-700">Please try again or adjust your search.</p>
          </div>
        )}
        {!loading && !error && leads.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-800">No leads yet</h3>
            <p className="mt-2 text-gray-700">
              Use the search bar and filters above to find your ideal leads
            </p>
            <button
              onClick={() => setShowFilters(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700"
            >
              <FiFilter className="mr-2" />
              Show filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
