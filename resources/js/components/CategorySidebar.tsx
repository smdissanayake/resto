import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Utensils, Pizza, Coffee, IceCream, Salad, ArrowLeft } from 'lucide-react';
interface CategorySidebarProps {
  activeCategory: string;
  onSelect: (category: string) => void;
  categories: string[];
}

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'Burgers': return Utensils;
    case 'Pizza': return Pizza;
    case 'Salads': return Salad;
    case 'Drinks': return Coffee;
    case 'Desserts': return IceCream;
    default: return Utensils;
  }
};
export function CategorySidebar({
  activeCategory,
  onSelect,
  categories
}: CategorySidebarProps) {
  return <div className="h-full w-full bg-[#1A1A1A] flex flex-col items-center py-6 gap-4 overflow-y-auto no-scrollbar border-r border-white/5">
    <Link href="/dashboard" className="w-[90px] h-[70px] rounded-2xl flex flex-col items-center justify-center gap-2 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5 mb-2">
      <ArrowLeft size={24} />
      <span className="text-xs font-medium">Exit</span>
    </Link>
    {categories.map(cat => {
      const isActive = activeCategory === cat;
      const Icon = getIconForCategory(cat);
      return <motion.button key={cat} whileTap={{
        scale: 0.95
      }} onClick={() => onSelect(cat)} className={`
              w-[90px] h-[90px] rounded-2xl flex flex-col items-center justify-center gap-2
              transition-all duration-300 relative
              ${isActive ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' : 'bg-transparent text-white/40 hover:bg-white/5'}
            `}>
        <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
        <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
          {cat}
        </span>

        {isActive && <motion.div layoutId="activeIndicator" className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-l-full" />}
      </motion.button>;
    })}
  </div>;
}