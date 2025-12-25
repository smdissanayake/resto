import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Utensils, Pizza, Coffee, IceCream, Salad, ArrowLeft } from 'lucide-react';
interface CategorySidebarProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}
const CATEGORIES = [{
  id: 'Burgers',
  icon: Utensils,
  label: 'Burgers'
}, {
  id: 'Pizza',
  icon: Pizza,
  label: 'Pizza'
}, {
  id: 'Salads',
  icon: Salad,
  label: 'Salads'
}, {
  id: 'Drinks',
  icon: Coffee,
  label: 'Drinks'
}, {
  id: 'Desserts',
  icon: IceCream,
  label: 'Desserts'
}];
export function CategorySidebar({
  activeCategory,
  onSelect
}: CategorySidebarProps) {
  return <div className="h-full w-full bg-[#1A1A1A] flex flex-col items-center py-6 gap-4 overflow-y-auto no-scrollbar border-r border-white/5">
      <Link href="/dashboard" className="w-[90px] h-[70px] rounded-2xl flex flex-col items-center justify-center gap-2 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5 mb-2">
        <ArrowLeft size={24} />
        <span className="text-xs font-medium">Exit</span>
      </Link>
      {CATEGORIES.map(cat => {
      const isActive = activeCategory === cat.id;
      const Icon = cat.icon;
      return <motion.button key={cat.id} whileTap={{
        scale: 0.95
      }} onClick={() => onSelect(cat.id)} className={`
              w-[90px] h-[90px] rounded-2xl flex flex-col items-center justify-center gap-2
              transition-all duration-300 relative
              ${isActive ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' : 'bg-transparent text-white/40 hover:bg-white/5'}
            `}>
            <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
              {cat.label}
            </span>

            {isActive && <motion.div layoutId="activeIndicator" className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-l-full" />}
          </motion.button>;
    })}
    </div>;
}