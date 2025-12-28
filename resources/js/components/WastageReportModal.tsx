import React, { useState } from 'react';
import { X, AlertTriangle, Save } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface InventoryItem {
    id: number;
    name: string;
    unit: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    items: InventoryItem[];
}

export function WastageReportModal({ isOpen, onClose, items }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        inventory_item_id: '',
        quantity: '',
        reason: 'Expired',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventory/wastage', {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    const selectedItem = items.find(i => i.id.toString() === data.inventory_item_id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl border border-red-500/20 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#121212]">
                    <h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
                        <AlertTriangle size={24} />
                        Report Wastage
                    </h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Item Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Inventory Item</label>
                        <select
                            value={data.inventory_item_id}
                            onChange={e => setData('inventory_item_id', e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none appearance-none"
                            required
                        >
                            <option value="">Select Item...</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                            ))}
                        </select>
                        {errors.inventory_item_id && <p className="text-red-500 text-xs mt-1">{errors.inventory_item_id}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Quantity Wasted
                            {selectedItem && <span className="text-red-500 ml-1">({selectedItem.unit})</span>}
                        </label>
                        <input
                            type="number"
                            step="0.001"
                            value={data.quantity}
                            onChange={e => setData('quantity', e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none"
                            placeholder="0.00"
                            required
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Reason</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Expired', 'Damaged', 'Spilled', 'Other'].map(reason => (
                                <button
                                    key={reason}
                                    type="button"
                                    onClick={() => setData('reason', reason)}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${data.reason === reason
                                            ? 'bg-red-500/20 border-red-500 text-red-500'
                                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Notes (Optional)</label>
                        <textarea
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none resize-none h-24"
                            placeholder="Any additional details..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {processing ? 'Reporting...' : 'Confirm Waste'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
