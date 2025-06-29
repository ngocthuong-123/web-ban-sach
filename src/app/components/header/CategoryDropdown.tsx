import React from 'react';
import Link from 'next/link';
import { Category } from '../../types/Category';
import Colors from '../../utils/colors';

interface Props {
  categories: Category[];
  setShowCategories: (show: boolean) => void;
}

export default function CategoryDropdown({ categories, setShowCategories }: Props) {
  return (
    <div
      className={`absolute left-0 top-full z-50 bg-white text-black rounded shadow-md min-w-[200px] space-y-2`}
      onMouseEnter={() => setShowCategories(true)}
      onMouseLeave={() => setShowCategories(false)}
    >
      {categories
        .filter((category) => category.parent_id === null)
        .map((category) => (
          <div key={category.id} className="relative group">
            <Link
              href={`/category/${category.slug}`}
              className={`block px-4 py-2 hover:bg-black hover:text-white whitespace-nowrap`}
            >
              {category.name}
            </Link>
            {category.children && category.children.length > 0 && (
              <div className="absolute left-full top-0 hidden group-hover:block z-50 transition-all duration-300">
                <div className={`bg-white text-[${Colors.textDark}] rounded space-y-1 min-w-[180px]`}>
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/category/${child.slug}`}
                      className={`block px-4 py-2 hover:bg-black hover:text-white whitespace-nowrap`}

                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
