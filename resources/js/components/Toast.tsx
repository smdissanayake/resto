import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: 50, scale: 0.3 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
    };

    const colors = {
        success: 'bg-green-600/90 border-green-500/50 text-white',
        error: 'bg-red-600/90 border-red-500/50 text-white',
        info: 'bg-blue-600/90 border-blue-500/50 text-white'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-200" />,
        error: <AlertCircle className="w-5 h-5 text-red-200" />,
        info: <Info className="w-5 h-5 text-blue-200" />
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] flex justify-center w-full pointer-events-none">
                    <motion.div
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`
                min-w-[300px] max-w-md px-4 py-3 rounded-full shadow-2xl backdrop-blur-md border 
                flex items-center gap-3 pointer-events-auto
                ${colors[type]}
            `}
                    >
                        {icons[type]}
                        <p className="flex-1 text-sm font-medium">{message}</p>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={16} className="opacity-80" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
