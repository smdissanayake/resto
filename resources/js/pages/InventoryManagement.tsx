import React, { useState, useEffect } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Plus, Search, AlertTriangle, TrendingDown } from 'lucide-react';
import { CategoryFilterChips } from '../components/CategoryFilterChips';
import { InventoryCard } from '../components/InventoryCard';
import { router } from '@inertiajs/react';
import { InventoryFormModal } from '../components/InventoryFormModal';
import { WastageReportModal } from '../components/WastageReportModal';
import axios from 'axios';

interface Props {
  items: any[];
  categories: any[];
  filters: {
    search?: string;
    category?: string;
  };
}

export default function InventoryManagement({ items, categories, filters }: Props) {
  const [activeTab, setActiveTab] = useState<'items' | 'wastage'>('items');

  // Items State
  const [activeCategory, setActiveCategory] = useState(filters.category || 'All');
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Wastage State
  const [isWastageModalOpen, setIsWastageModalOpen] = useState(false);
  const [wastageHistory, setWastageHistory] = useState<any[]>([]);
  const [isLoadingWastage, setIsLoadingWastage] = useState(false);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== (filters.search || '')) {
        router.get('/inventory', { search: searchQuery, category: activeCategory }, { preserveState: true, replace: true });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch Wastage History when tab changes
  useEffect(() => {
    if (activeTab === 'wastage') {
      fetchWastageHistory();
    }
  }, [activeTab]);

  const fetchWastageHistory = async () => {
    setIsLoadingWastage(true);
    try {
      const response = await axios.get('/inventory/wastage');
      setWastageHistory(response.data.data);
    } catch (error) {
      console.error('Failed to fetch wastage history', error);
    } finally {
      setIsLoadingWastage(false);
    }
  };

  // Handle Category Change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    router.get('/inventory', { search: searchQuery, category: category }, { preserveState: true, replace: true });
  };

  const handleCreate = (data: any) => {
    router.post('/inventory', data, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  const handleUpdate = (data: any) => {
    router.put(`/inventory/${editingItem.id}`, data, {
      onSuccess: () => {
        setIsModalOpen(false);
        setEditingItem(null);
      }
    });
  };

  const openEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // Extract category names for chips
  const categoryNames = ['All', ...categories.map(c => c.name)];

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-100px)]">

        {/* Header Section with Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setActiveTab('items')}
              className={`text-2xl font-bold transition-colors ${activeTab === 'items' ? 'text-white' : 'text-gray-500 hover:text-white/80'}`}
            >
              Inventory
            </button>
            <span className="text-gray-600 text-2xl">/</span>
            <button
              onClick={() => setActiveTab('wastage')}
              className={`text-2xl font-bold transition-colors ${activeTab === 'wastage' ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
            >
              Wastage & Loss
            </button>
          </div>

          {/* Controls Bar */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl px-6 py-4 shadow-xl">
            {activeTab === 'items' ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategoryFilterChips
                  categories={categoryNames}
                  activeCategory={activeCategory}
                  onSelect={handleCategoryChange}
                />

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#121212] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#FF6B00] transition-colors w-64"
                    />
                  </div>
                  <button
                    onClick={openCreate}
                    className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-[#FF6B00]/20"
                  >
                    <Plus size={18} />
                    Add Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/60">
                  <TrendingDown size={20} className="text-red-500" />
                  <span>Track expired, damaged, or wasted inventory items.</span>
                </div>
                <button
                  onClick={() => setIsWastageModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                >
                  <AlertTriangle size={18} />
                  Report Wastage
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">

          {activeTab === 'items' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <InventoryCard
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.name,
                    category: item.category?.name || 'Uncategorized',
                    stockLevel: Math.min((item.stock_level / 100) * 100, 100), // Mock percentage
                    unit: item.unit,
                    quantity: Number(item.stock_level),
                    price: Number(item.price_per_unit)
                  }}
                  onEdit={openEdit}
                  onReorder={(id) => console.log('Reorder', id)}
                />
              ))}

              {items.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-white/40">
                  <p className="text-lg">No items found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wastage' && (
            <div className="bg-[#1A1A1A] rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#121212] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4">Date</th>
                    <th className="p-4">Item</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4">Cost Loss</th>
                    <th className="p-4">Reported By</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingWastage ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading records...</td></tr>
                  ) : wastageHistory.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No wastage records found.</td></tr>
                  ) : (
                    wastageHistory.map((record: any) => (
                      <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(record.created_at).toLocaleDateString()} <span className="text-xs opacity-60">{new Date(record.created_at).toLocaleTimeString()}</span>
                        </td>
                        <td className="p-4 text-white font-medium">{record.item_name}</td>
                        <td className="p-4 text-red-400 font-mono">
                          -{Number(record.quantity)} {record.unit}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                                            ${record.reason === 'Expired' ? 'bg-red-500/10 text-red-500' :
                              record.reason === 'Damaged' ? 'bg-orange-500/10 text-orange-500' :
                                'bg-gray-500/10 text-gray-400'}
                                        `}>
                            {record.reason}
                          </span>
                        </td>
                        <td className="p-4 text-white font-mono">
                          Rs. {Number(record.cost).toFixed(2)}
                        </td>
                        <td className="p-4 text-gray-400 text-sm">{record.user_name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      <InventoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingItem ? handleUpdate : handleCreate}
        initialData={editingItem}
        categories={categories}
      />

      <WastageReportModal
        isOpen={isWastageModalOpen}
        onClose={() => {
          setIsWastageModalOpen(false);
          if (activeTab === 'wastage') fetchWastageHistory(); // Refresh list after report
        }}
        items={items.map(i => ({ id: i.id, name: i.name, unit: i.unit }))}
      />
    </MainLayout>
  );
}

