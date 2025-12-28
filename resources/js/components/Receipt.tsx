import React from 'react';

export interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
}

export interface ReceiptData {
    orderNumber: string;
    date: string;
    items: ReceiptItem[];
    subtotal: number;
    tax: number;
    total: number;
}

interface ReceiptProps {
    data: ReceiptData | null;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ data }, ref) => {
    return (
        <>
            <style>
                {`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { margin: 0; padding: 0; }
                }
                `}
            </style>
            <div className="hidden print:block print:w-full print:absolute print:top-0 print:left-0 bg-white text-black p-2 text-xs font-mono" ref={ref}>
                {data ? (
                    <div className="max-w-[80mm] mx-auto">
                        <div className="text-center mb-4">
                            <h1 className="text-xl font-bold uppercase">Resto POS</h1>
                            <p className="text-[10px]">123 Food Street, Colombo</p>
                            <p className="text-[10px]">Tel: +94 77 123 4567</p>
                        </div>

                        <div className="border-b-2 border-dashed border-black my-2"></div>

                        <div className="flex justify-between font-bold">
                            <span>Order:</span>
                            <span>{data.orderNumber}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-[10px]">
                            <span>Date:</span>
                            <span>{data.date}</span>
                        </div>

                        <div className="border-b-2 border-dashed border-black my-2"></div>

                        <div className="space-y-1">
                            {data.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="w-8">{item.quantity} x</span>
                                    <span className="flex-1">{item.name}</span>
                                    <span className="text-right">{(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-b-2 border-dashed border-black my-2"></div>

                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{data.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (8%):</span>
                            <span>{data.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2 border-y-2 border-black py-1">
                            <span>TOTAL:</span>
                            <span>{data.total.toFixed(2)}</span>
                        </div>

                        <div className="text-center mt-6 text-[10px]">
                            <p>Thank you & Come Again!</p>
                            <p>Powered by Resto</p>
                        </div>
                    </div>
                ) : (
                    <p>No data to print</p>
                )}
            </div>
        </>
    );
});
