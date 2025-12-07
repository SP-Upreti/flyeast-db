import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useGetPages } from "@/hooks/usePages";
import { PageTable } from "@/components/pageContent/Item-Table";
import { PageForm } from "@/components/pageContent/Item-sheet";
import type { PageContent } from "@/types/pages";
import { Pricing } from "./pricing";

const seoPlans = [
  {
    name: "BASIC",
    price: "35000",
    yearlyPrice: "390000",
    period: "per month",
    features: [
      {
        cat: "Website Analysis",
        feature: [
          "✔️ Max 7 Keywords",
          "✔️ Keyword Research",
          "❌ Website & Competition Analysis",
          "❌ Content Duplicity check",
          "❌ Initial Ranking Report",
        ],
      },

      {
        cat: "Technical SEO",
        feature: [
          "❌ Broken link fixing",
          "❌ Image optimization",
          "✔️ CDN setup",
          "❌ CSS & script optimization",
          "❌ Page speed optimization",
        ],
      },

      {
        cat: "On Page SEO Analysis",
        feature: [
          "✔️ Meta tag creation",
          "✔️ URL structure",
          "✔️ Heading tag optimization",
          "❌ Content optimization",
          "❌ Robots.txt",
          "✔️ Sitemap creation",
          "✔️ Google Analytics & Search Console setup",
          "✔️ Blogs optimization for posts",
          "❌ Open Graph",
        ],
      },
    ],
    description: "Perfect for small websites or blogs",
    buttonText: "Contact Expert",
    href: "https://wa.link/qd4ev4",
    isPopular: false,
  },
  {
    name: "STANDARD",
    price: "50000",
    yearlyPrice: "550000",
    period: "per month",
    features: [
      {
        cat: "Website Review and Analyze",
        feature: [
          "✔️ Unlimited keywords",
          "✔️ Advanced on-page & off-page SEO",
          "✔️ High-quality backlink strategy",
          "✔️ Weekly performance reports",
          "✔️ Dedicated account manager",
          "✔️ 24/7 priority support",
        ],
      },
    ],
    description: "Great for small businesses and growing websites",
    buttonText: "Contact Expert",
    href: "https://wa.link/qd4ev4",
    isPopular: true,
  },
  {
    name: "PREMIUM",
    price: "100000",
    yearlyPrice: "1100000",
    period: "per month",
    features: [
      {
        cat: "Website Review and Analyze",
        feature: [
          "✔️ Unlimited keywords",
          "✔️ Advanced on-page & off-page SEO",
          "✔️ High-quality backlink strategy",
          "✔️ Weekly performance reports",
          "✔️ Dedicated account manager",
          "✔️ 24/7 priority support",
        ],
      },

    ],
    description: "Best for enterprises and competitive markets",
    buttonText: "Contact Expert",
    href: "https://wa.link/qd4ev4",
    isPopular: false,
  },
];


export default function PageContentPage() {
  const [activeTab, setActiveTab] = useState("Why SEO");
  const { data: pages, isLoading, refetch: fetchPages } = useGetPages();
  const [isAdding, setIsAdding] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<PageContent | null>(null);

  return (
    <div className=" mx-auto ">

      {/* Tab Views */}
      {activeTab === "Why SEO" && (
        <div>
          <h1 className="text-2xl font-bold  pt-3">Why SEO?</h1>
          <p className="text-gray-600 leading-relaxed">coming soon ...</p>
        </div>
      )}

      {activeTab === "Add Page" && (
        <div>
          {isAdding ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Add Page</h1>
                <Button onClick={() => setIsAdding(false)} variant="outline">
                  Back to List
                </Button>
              </div>
              <PageForm
                onSuccess={() => {
                  fetchPages();
                  setIsAdding(false);
                }}
                onCancel={() => setIsAdding(false)}
              />
            </>
          ) : pageToEdit ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Edit Page</h1>
                <Button onClick={() => setPageToEdit(null)} variant="outline">
                  Back to List
                </Button>
              </div>
              <PageForm
                page={pageToEdit}
                onSuccess={() => {
                  fetchPages();
                  setPageToEdit(null);
                }}
                onCancel={() => setPageToEdit(null)}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6 pt-3">
                <h1 className="text-2xl font-bold">Add New Page</h1>
                <Button onClick={() => setIsAdding(true)}>
                  <PlusCircle className="mr-1" />
                  Add Page
                </Button>
              </div>
              <PageTable
                pages={pages || []}
                isLoading={isLoading}
                onEdit={setPageToEdit}
              />
            </>
          )}
        </div>
      )}

      {activeTab === "Pricing" && (
        <div className="h-[800px] o rounded-sm">
          <Pricing plans={seoPlans} />
        </div>
      )}

      {/* Add placeholders or actual content for other tabs */}
      {[
        "Blog",
        "Services",
        "About",
        "Contact",
        "Testimonials",
        "FAQs",
      ].includes(activeTab) && (
          <div>
            <h1 className="text-3xl font-bold mb-4">{activeTab}</h1>
            <p className="text-gray-600">
              Content for {activeTab} coming soon...
            </p>
          </div>
        )}
    </div>
  );
}
