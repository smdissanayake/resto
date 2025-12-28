import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Upload, Image as ImageIcon, Check, DollarSign, Package, Trash2, Plus } from 'lucide-react';

interface Product {
    id?: number;
    name: string;
    category: string;
    price: string;
    cost_price?: string;
    stock_quantity?: number;
    image?: string;
    type: 'kitchen' | 'retail';
    is_available: boolean;
    description?: string;
    ingredients?: { id: number; inventory_item_id: number; quantity: number }[];
    modifiers?: ModifierGroup[];
}

interface ModifierOption {
    name: string;
    price: number;
    inventory_item_id?: number;
    quantity?: number;
}

interface ModifierGroup {
    title: string;
    type: 'single' | 'multiple';
    options: ModifierOption[];
}

interface InventoryItem {
    id: number;
    name: string;
    unit: string;
    usage_unit?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    inventoryItems: InventoryItem[];
}

export function ProductModal({ isOpen, onClose, product, inventoryItems }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        category: 'Burgers',
        price: '',
        cost_price: '',
        stock_quantity: 0,
        description: '',
        type: 'kitchen',
        is_available: true,
        image_file: null as File | null,
        ingredients: [] as { inventory_item_id: number; quantity: number }[],
        modifiers: [] as ModifierGroup[],
        _method: 'POST' // Default to POST, will change for edit
    });

    // Temp state for adding ingredient
    const [selectedIng, setSelectedIng] = useState('');
    const [ingQty, setIngQty] = useState('');

    // Temp state for modifiers
    const [newGroupTitle, setNewGroupTitle] = useState('');
    const [newGroupType, setNewGroupType] = useState<'single' | 'multiple'>('single');

    const addModifierGroup = () => {
        if (!newGroupTitle) return;
        setData('modifiers', [
            ...data.modifiers,
            { title: newGroupTitle, type: newGroupType, options: [] }
        ]);
        setNewGroupTitle('');
    };

    const removeModifierGroup = (index: number) => {
        const newModifiers = [...data.modifiers];
        newModifiers.splice(index, 1);
        setData('modifiers', newModifiers);
    };

    const addOptionToGroup = (groupIndex: number) => {
        const newModifiers = [...data.modifiers];
        if (!newModifiers[groupIndex].options) {
            newModifiers[groupIndex].options = [];
        }
        newModifiers[groupIndex].options.push({ name: '', price: 0, inventory_item_id: undefined, quantity: undefined });
        setData('modifiers', newModifiers);
    };

    const updateOption = (groupIndex: number, optionIndex: number, field: keyof ModifierOption, value: any) => {
        const newModifiers = [...data.modifiers];
        newModifiers[groupIndex].options[optionIndex] = {
            ...newModifiers[groupIndex].options[optionIndex],
            [field]: value
        };
        setData('modifiers', newModifiers);
    };

    const removeOption = (groupIndex: number, optionIndex: number) => {
        const newModifiers = [...data.modifiers];
        newModifiers[groupIndex].options.splice(optionIndex, 1);
        setData('modifiers', newModifiers);
    };

    const addIngredient = () => {
        if (!selectedIng || !ingQty) return;
        const currentIngredients = [...data.ingredients];
        currentIngredients.push({
            inventory_item_id: parseInt(selectedIng),
            quantity: parseFloat(ingQty)
        });
        setData('ingredients', currentIngredients);
        setSelectedIng('');
        setIngQty('');
    };

    const removeIngredient = (index: number) => {
        const currentIngredients = [...data.ingredients];
        currentIngredients.splice(index, 1);
        setData('ingredients', currentIngredients);
    };

    useEffect(() => {
        if (product) {
            setData({
                name: product.name,
                category: product.category,
                price: product.price,
                cost_price: product.cost_price || '',
                stock_quantity: product.stock_quantity || 0,
                description: product.description || '',
                type: product.type || 'kitchen',
                is_available: product.is_available,
                image_file: null,
                ingredients: product.ingredients?.map((i: any) => ({
                    inventory_item_id: i.pivot?.inventory_item_id || i.inventory_item_id,
                    quantity: i.pivot?.quantity || i.quantity
                })) || [],
                modifiers: product.modifiers || [],
                _method: 'PUT' // Spoof PUT for file upload support in Inertia
            });
            setImagePreview(product.image || null);
        } else {
            reset();
            setImagePreview(null);
            setData(prev => ({ ...prev, _method: 'POST' }));
        }
        clearErrors();
    }, [product, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION: Filter out empty options before sending
        const cleanedModifiers = data.modifiers.map(group => ({
            ...group,
            options: group.options.filter(opt => opt.name.trim() !== '')
        })).filter(group => group.options.length > 0 || group.title.trim() !== ''); // Optional: Remove empty groups too if desired

        // Update data with cleaned modifiers (We can't easily sync setData here immediately before post due to async,
        // so we manually construct the payload or clean it.
        // Better approach: Clean it and then update, but for now let's just use the current data 
        // OR warn the user.

        // Let's WARN the user instead, it's better UX than silently removing.
        const hasEmptyOptions = data.modifiers.some(g => g.options.some(o => !o.name.trim()));
        if (hasEmptyOptions) {
            alert("Please fill in all modifier option names or remove empty ones.");
            return;
        }

        if (product) {
            // Edit Mode
            post(`/products/${product.id}`, {
                onSuccess: onClose,
                forceFormData: true
            });
        } else {
            // Create Mode
            post('/products', {
                onSuccess: onClose
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#121212]">
                    <h2 className="text-xl font-bold text-white">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Top Section: Image & Type */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Image Upload */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Product Image</label>
                            <div
                                className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-white/10 hover:border-orange-500/50 transition-colors group cursor-pointer bg-[#121212]"
                                onClick={() => document.getElementById('imageInput')?.click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                        <ImageIcon size={32} className="mb-2" />
                                        <span className="text-xs">Click to upload</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Upload className="text-white" />
                                </div>
                            </div>
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {errors.image_file && <p className="text-red-500 text-xs mt-1">{errors.image_file}</p>}
                        </div>

                        {/* Basic Info */}
                        <div className="col-span-2 space-y-4">
                            {/* Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Product Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'kitchen')}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${data.type === 'kitchen'
                                            ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <UtensilsCrossedIcon size={18} />
                                        Kitchen Item
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'retail')}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${data.type === 'retail'
                                            ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <Package size={18} />
                                        Retail Item
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
                                    placeholder="e.g. Chicken Burger"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none appearance-none"
                                    >
                                        <option value="Burgers">Burgers</option>
                                        <option value="Pizza">Pizza</option>
                                        <option value="Salads">Salads</option>
                                        <option value="Drinks">Drinks</option>
                                        <option value="Desserts">Desserts</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Selling Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:border-green-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Fields for Retail */}
                    {data.type === 'retail' && (
                        <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-1">Cost Price (Optional)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.cost_price}
                                    onChange={e => setData('cost_price', e.target.value)}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-300 mb-1">Initial Stock</label>
                                <input
                                    type="number"
                                    value={data.stock_quantity}
                                    onChange={e => setData('stock_quantity', parseInt(e.target.value))}
                                    className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Recipe Section for Kitchen Items */}
                    {data.type === 'kitchen' && (
                        <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-orange-400 font-bold flex items-center gap-2">
                                <UtensilsCrossedIcon size={16} /> Recipe / Ingredients
                            </h3>

                            {/* Add Ingredient Row */}
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-400 mb-1">Ingredient</label>
                                    <select
                                        value={selectedIng}
                                        onChange={e => setSelectedIng(e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none appearance-none"
                                    >
                                        <option value="">Select Item...</option>
                                        {inventoryItems.map(item => (
                                            <option key={item.id} value={item.id}>{item.name} ({item.usage_unit || item.unit})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs text-gray-400 mb-1">
                                        Qty {selectedIng && (() => {
                                            const item = inventoryItems.find(i => i.id === parseInt(selectedIng));
                                            return <span className="text-orange-500">({item?.usage_unit || item?.unit})</span>;
                                        })()}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={ingQty}
                                        onChange={e => setIngQty(e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                                        placeholder="0.0"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Ingredients List */}
                            <div className="space-y-2">
                                {data.ingredients.map((ing, index) => {
                                    const item = inventoryItems.find(i => i.id === ing.inventory_item_id);
                                    return (
                                        <div key={index} className="flex justify-between items-center bg-[#121212] p-2 rounded-lg border border-white/5">
                                            <div className="text-sm text-gray-300">
                                                {item?.name} <span className="text-xs text-gray-500">({ing.quantity} {item?.usage_unit || item?.unit})</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="text-red-400 hover:text-red-300 p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {data.ingredients.length === 0 && (
                                    <p className="text-xs text-gray-500 text-center py-2">No ingredients added yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Modifiers Section */}
                    <div className="bg-[#2A2A2A] border border-white/5 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <span className="bg-purple-500/20 text-purple-400 p-1 rounded">M</span> Modifiers & Add-ons
                        </h3>

                        {/* Add New Group */}
                        <div className="flex gap-2 items-end bg-[#121212] p-3 rounded-lg border border-white/5">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1">New Group Title</label>
                                <input
                                    type="text"
                                    value={newGroupTitle}
                                    onChange={e => setNewGroupTitle(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-purple-500 outline-none"
                                    placeholder="e.g. Size, Toppings"
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs text-gray-400 mb-1">Type</label>
                                <select
                                    value={newGroupType}
                                    onChange={e => setNewGroupType(e.target.value as any)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-purple-500 outline-none"
                                >
                                    <option value="single">Single Select</option>
                                    <option value="multiple">Multi Select</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={addModifierGroup}
                                className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {/* Existing Groups */}
                        <div className="space-y-4">
                            {data.modifiers.map((group, gIndex) => (
                                <div key={gIndex} className="bg-[#121212] rounded-lg border border-white/5 p-3">
                                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">{group.title}</span>
                                            <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded uppercase">{group.type}</span>
                                        </div>
                                        <button type="button" onClick={() => removeModifierGroup(gIndex)} className="text-red-400 hover:text-red-300">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Options List */}
                                    <div className="space-y-2 pl-2 border-l-2 border-white/5">
                                        {(group.options || []).map((option, oIndex) => (
                                            <div key={oIndex} className="flex flex-col gap-2 bg-[#1A1A1A] p-2 rounded border border-white/5">
                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        value={option.name}
                                                        onChange={e => updateOption(gIndex, oIndex, 'name', e.target.value)}
                                                        className="flex-1 bg-[#121212] border border-white/10 rounded px-2 py-1 text-sm text-white focus:border-purple-500 outline-none"
                                                        placeholder="Option Name (e.g. Extra Cheese)"
                                                    />
                                                    <div className="relative w-24">
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                                                        <input
                                                            type="number"
                                                            value={option.price}
                                                            onChange={e => updateOption(gIndex, oIndex, 'price', parseFloat(e.target.value))}
                                                            className="w-full bg-[#121212] border border-white/10 rounded pl-5 pr-2 py-1 text-sm text-white focus:border-purple-500 outline-none"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <button type="button" onClick={() => removeOption(gIndex, oIndex)} className="text-gray-500 hover:text-red-400">
                                                        <X size={14} />
                                                    </button>
                                                </div>

                                                {/* Inventory Link Row */}
                                                <div className="flex gap-2 items-center pl-2 border-l border-purple-500/30">
                                                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider w-16">Link Stock:</span>
                                                    <select
                                                        value={option.inventory_item_id || ''}
                                                        onChange={e => updateOption(gIndex, oIndex, 'inventory_item_id', parseInt(e.target.value))}
                                                        className="flex-1 bg-[#121212] border border-white/10 rounded px-2 py-1 text-xs text-gray-300 focus:border-purple-500 outline-none appearance-none"
                                                    >
                                                        <option value="">-- No Stock Deduction --</option>
                                                        {inventoryItems.map(item => (
                                                            <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                                                        ))}
                                                    </select>
                                                    {option.inventory_item_id && (
                                                        <div className="w-20 flex items-center gap-1">
                                                            <input
                                                                type="number"
                                                                step="0.001"
                                                                value={option.quantity || ''}
                                                                onChange={e => updateOption(gIndex, oIndex, 'quantity', parseFloat(e.target.value))}
                                                                className="w-full bg-[#121212] border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-purple-500 outline-none"
                                                                placeholder="Qty"
                                                            />
                                                            <span className="text-[10px] text-gray-500">
                                                                {(() => {
                                                                    const i = inventoryItems.find(t => t.id === option.inventory_item_id);
                                                                    return i?.usage_unit || i?.unit;
                                                                })()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addOptionToGroup(gIndex)}
                                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-2"
                                        >
                                            <Plus size={12} /> Add Option
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none resize-none"
                            placeholder="Describe the item..."
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${data.is_available ? 'bg-green-500' : 'bg-gray-600'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${data.is_available ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={data.is_available}
                                onChange={e => setData('is_available', e.target.checked)}
                            />
                            <span className="text-sm font-medium text-gray-300">Available for Sale</span>
                        </label>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#FF6B00] hover:bg-[#E65A00] text-white px-8 py-2 rounded-lg font-semibold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {processing ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Simple icon wrapper if Lucide doesn't export UtensilsCrossed directly (it does, but just in case)
function UtensilsCrossedIcon({ size, className }: { size?: number, className?: string }) {
    // Basic SVG fallback if needed, or re-export from lucide
    // Assuming lucide-react exports standard icons.
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
            <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L21 9" />
            <path d="m22 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 2Z" />
            <path d="M22 22 2 2" />
        </svg>
    )
    // Actually Lucide exports UtensilsCrossed, but I'll use this custom one if import fails or just ensure import is correct.
    // In MenuManagement I imported UtensilsCrossed. Here I forgot to import it in the top list?
    // Let me check imports. Yes, I missed UtensilsCrossed in the import list of ProductModal.
}
