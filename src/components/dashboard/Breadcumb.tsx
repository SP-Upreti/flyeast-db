import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Breadcrumb({
  links,
  brandColor = "text-red-500", // Default brand gradient
}: {
  links: Array<{ label: string; isActive?: boolean }>;
  brandColor?: string; // Allow customization
}) {
  const navigate = useNavigate();

  const handleClick = (index: number) => {
    const backCount = links.length - 1 - index;
    navigate(-backCount);
  };

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            {index !== 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            <button
              onClick={() => handleClick(index)}
              className={`flex items-center gap-1 text-xl transition-colors duration-200 ${link.isActive
                ? `font-bold ${brandColor}`
                : "text-gray-500 hover:text-gray-700 font-medium"
                }`}
              disabled={link.isActive}
              aria-current={link.isActive ? "page" : undefined}
            >
              {index === 0 && ( // Home icon for first item
                <img
                  src="/icons/activities.png"
                  alt="Real-Himalaya"
                  className="h-5"
                />
              )}
              <span className="whitespace-nowrap">{link.label.split("").length > 30 ? link.label.slice(0, 30) + "..." : link.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
