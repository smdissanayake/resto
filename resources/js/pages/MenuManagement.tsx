import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Plus, Search, Edit2, Trash2, Package, UtensilsCrossed } from 'lucide-react';
import { ProductModal } from '../components/ProductModal';

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    cost_price: string;
    stock_quantity: number;
    image: string;
    type: 'kitchen' | 'retail';
    is_available: boolean;
    description: string;
}

interface Props {
    products: {
        data: Product[];
        links: any[];
    };
    inventoryItems: any[]; // Passed from controller
}

export default function MenuManagement({ products, inventoryItems }: Props) {
    const { flash } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState<'all' | 'kitchen' | 'retail'>('all');

    const filteredProducts = products.data.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeType === 'all' || product.type === activeType;
        return matchesSearch && matchesType;
    });

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/products/${id}`);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <MainLayout>
            <Head title="Menu Management" />

            <div className="p-6 text-white min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                            Menu Management
                        </h1>
                        <p className="text-gray-400 mt-1">Manage your POS items, pricing, and images</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#FF6B00] hover:bg-[#E65A00] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-orange-500/20 transition-all transform hover:scale-105"
                    >
                        <Plus size={20} />
                        Add New Item
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-[#1A1A1A] p-4 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5">
                    {/* Type Tabs */}
                    <div className="flex bg-[#121212] p-1 rounded-lg">
                        {(['all', 'kitchen', 'retail'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-4 py-2 rounded-md capitalize font-medium transition-colors ${activeType === type
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-500 hover:text-white/60'
                                    }`}
                            >
                                {type === 'all' ? 'All Items' : type}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#121212] text-white pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/3] relative overflow-hidden bg-[#121212]">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 left-3">
                                    {product.type === 'kitchen' ? (
                                        <span className="bg-orange-500/90 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                                            <UtensilsCrossed size={12} /> Kitchen
                                        </span>
                                    ) : (
                                        <span className="bg-blue-500/90 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                                            <Package size={12} /> Retail
                                        </span>
                                    )}
                                </div>
                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all transform hover:scale-110"
                                        title="Edit"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-500/20 hover:bg-red-500/40 p-3 rounded-full text-red-400 transition-all transform hover:scale-110"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#FF6B00] transition-colors">{product.name}</h3>
                                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">{product.category}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-[#22C55E]">${Number(product.price).toFixed(2)}</div>
                                        {!product.is_available && (
                                            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wide">Unavailable</span>
                                        )}
                                    </div>
                                </div>

                                {product.type === 'retail' && (
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Stock:</span>
                                        <span className={`font-mono font-bold ${product.stock_quantity > 0 ? 'text-white' : 'text-red-500'}`}>
                                            {product.stock_quantity} units
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-white/20" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white/40">No items found</h3>
                        <p className="text-white/20 mt-2">Try adjusting your search or add a new item.</p>
                    </div>
                )}

            </div>

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={editingProduct}
                inventoryItems={inventoryItems}
            />
        </MainLayout>
    );
}
