import React from "react";
import {
  FiBookOpen,
  FiCode,
  FiBriefcase,
  FiActivity,
  FiEdit3,
  FiBookmark,
} from "react-icons/fi";

interface CategorySelectorProps {
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: "academic", label: "Academic", icon: FiBookOpen },
  { id: "technical", label: "Technical", icon: FiCode },
  { id: "business", label: "Business", icon: FiBriefcase },
  { id: "scientific", label: "Scientific", icon: FiActivity },
  { id: "creative", label: "Creative", icon: FiEdit3 },
  { id: "legal", label: "Legal", icon: FiBookmark },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap justify-center border-t border-gray-200 py-3 bg-white">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            className="flex items-center mx-2 my-1 px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50"
            onClick={() => onSelectCategory(category.id)}
          >
            <Icon size={14} className="mr-1.5" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
