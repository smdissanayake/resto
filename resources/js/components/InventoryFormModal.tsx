import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface InventoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    categories: any[];
}

export function InventoryFormModal({ isOpen, onClose, onSubmit, initialData, categories }: InventoryFormModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        category_name: '',
        stock_level: '',
        unit: 'kg',
        price_per_unit: '',
        reorder_threshold: '10',
        usage_unit: '',
        conversion_factor: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category_name: initialData.category?.name || '',
                stock_level: initialData.stock_level,
                unit: initialData.unit,
                price_per_unit: initialData.price_per_unit,
                reorder_threshold: initialData.reorder_threshold,
                usage_unit: initialData.usage_unit || '',
                conversion_factor: initialData.conversion_factor || ''
            });
        } else {
            setFormData({
                name: '',
                category_name: categories[0]?.name || '',
                stock_level: '',
                unit: 'kg',
                price_per_unit: '',
                reorder_threshold: '10',
                usage_unit: '',
                conversion_factor: ''
            });
        }
    }, [initialData, categories, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#1E1E1E] rounded-xl w-full max-w-md border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Item' : 'Add New Item'}
                    </h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Item Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                            placeholder="e.g., Tomatoes"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">Category</label>
                        <select
                            required
                            value={formData.category_name}
                            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] [&>option]:bg-[#1E1E1E]"
                        >
                            <option value="">Select Category...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-1">Stock Level</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.stock_level}
                                onChange={(e) => setFormData({ ...formData, stock_level: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-1">Unit</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] [&>option]:bg-[#1E1E1E]"
                            >
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="l">l</option>
                                <option value="ml">ml</option>
                                <option value="pcs">pcs</option>
                                <option value="box">box</option>
                                <option value="pack">pack</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-1">Price per Unit ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.price_per_unit}
                                onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-1">Min. Alert Level</label>
                            <input
                                type="number"
                                required
                                value={formData.reorder_threshold}
                                onChange={(e) => setFormData({ ...formData, reorder_threshold: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                            />
                        </div>
                    </div>

                    {/* Unit Conversion Section */}
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            Unit Conversion <span className="text-xs text-white/40 font-normal">(Optional)</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Usage Unit (e.g. g, ml)</label>
                                <input
                                    type="text"
                                    value={formData.usage_unit}
                                    onChange={(e) => setFormData({ ...formData, usage_unit: e.target.value })}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                                    placeholder="e.g. g"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Conversion Rate</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={formData.conversion_factor}
                                    onChange={(e) => setFormData({ ...formData, conversion_factor: e.target.value })}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                                    placeholder="e.g. 1000"
                                />
                            </div>
                        </div>
                        {formData.usage_unit && formData.conversion_factor && (
                            <p className="text-xs text-green-400">
                                1 {formData.unit} = {formData.conversion_factor} {formData.usage_unit}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 rounded-lg bg-[#FF6B00] text-white font-bold hover:bg-[#e66000] transition-colors"
                        >
                            {initialData ? 'Update Item' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
