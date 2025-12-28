import React, { useState } from 'react';
import MainLayout from '../../Layouts/MainLayout';
import { useForm } from '@inertiajs/react';
import { Save, Upload, Info } from 'lucide-react';
import { Toast } from '../../components/Toast';

interface SettingsProps {
    settings: Record<string, string>;
}

export default function SettingsIndex({ settings }: SettingsProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        restaurant_name: settings.restaurant_name || '',
        currency_symbol: settings.currency_symbol || '$',
        tax_percentage: settings.tax_percentage || '0',
        logo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings', {
            forceFormData: true, // Important for file upload
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">System Settings</h1>
                        <p className="text-white/60 text-sm mt-1">Configure your restaurant's global details.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* General Information Card */}
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#FF6B00] rounded-full"></span>
                            General Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Restaurant Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Restaurant Name</label>
                                <input
                                    type="text"
                                    value={data.restaurant_name}
                                    onChange={e => setData('restaurant_name', e.target.value)}
                                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all placeholder:text-white/20"
                                    placeholder="e.g. The Burger Joint"
                                />
                                {errors.restaurant_name && <p className="text-red-500 text-xs">{errors.restaurant_name}</p>}
                            </div>

                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Restaurant Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="relative group w-full">
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            accept="image/*"
                                            onChange={e => setData('logo', e.target.files ? e.target.files[0] : null)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="flex items-center justify-center gap-2 w-full bg-[#0F0F0F] border border-dashed border-white/20 hover:border-[#FF6B00]/50 rounded-lg px-4 py-8 cursor-pointer transition-all group-hover:bg-white/5"
                                        >
                                            <Upload size={20} className="text-white/40 group-hover:text-[#FF6B00]" />
                                            <span className="text-sm text-white/60 group-hover:text-white">
                                                {data.logo ? data.logo.name : 'Click to Upload New Logo'}
                                            </span>
                                        </label>
                                    </div>
                                    {/* Preview if existing */}
                                    {settings.logo_path && !data.logo && (
                                        <div className="h-20 w-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            <img src={settings.logo_path} alt="Current" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                {errors.logo && <p className="text-red-500 text-xs">{errors.logo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Financial Config Card */}
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                            Financial Configuration
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Currency */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Currency Symbol</label>
                                <input
                                    type="text"
                                    value={data.currency_symbol}
                                    onChange={e => setData('currency_symbol', e.target.value)}
                                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all placeholder:text-white/20"
                                    placeholder="$"
                                />
                                {errors.currency_symbol && <p className="text-red-500 text-xs">{errors.currency_symbol}</p>}
                            </div>

                            {/* Tax Percentage */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Tax Percentage (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.tax_percentage}
                                        onChange={e => setData('tax_percentage', e.target.value)}
                                        className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all placeholder:text-white/20 pl-4"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">%</span>
                                </div>
                                {errors.tax_percentage && <p className="text-red-500 text-xs">{errors.tax_percentage}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#FF6B00]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {processing ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </form>

                {/* Success Toast */}
                {recentlySuccessful && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <Toast message="Settings saved successfully!" onClose={() => { }} type="success" />
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
