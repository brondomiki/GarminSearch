import { useState, useEffect } from 'react';
import { NotificationSettings } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

export default function NotificationSettingsPanel({ settings, onSave }: NotificationSettingsProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  // Sincronizza con le impostazioni esterne
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Salva automaticamente quando le impostazioni cambiano
  useEffect(() => {
    if (localSettings.email && emailValid) {
      onSave(localSettings);
    }
  }, [localSettings, emailValid, onSave]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (email: string) => {
    setLocalSettings(prev => ({ ...prev, email }));
    setEmailValid(email === '' || validateEmail(email));
    
    if (email && validateEmail(email)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const toggleCondition = (condition: 'new' | 'refurbished' | 'used') => {
    setLocalSettings(prev => ({
      ...prev,
      conditionFilter: prev.conditionFilter.includes(condition)
        ? prev.conditionFilter.filter(c => c !== condition)
        : [...prev.conditionFilter, condition]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📧 Configurazione Notifiche Email
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocalSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              localSettings.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              localSettings.enabled ? 'translate-x-6.5' : 'translate-x-0.5'
            }`} />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {localSettings.enabled ? 'Attive' : 'Disattive'}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {localSettings.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                📧 Indirizzo Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={localSettings.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                    !emailValid 
                      ? 'border-red-500 focus:ring-red-500' 
                      : localSettings.email && emailValid
                      ? 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="la-tua-email@esempio.it"
                />
                {localSettings.email && emailValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    ✓
                  </div>
                )}
              </div>
              {!emailValid && (
                <p className="text-xs text-red-500 mt-1">⚠️ Inserisci un indirizzo email valido</p>
              )}
              {localSettings.email && emailValid && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Email salvata! Riceverai le notifiche ogni giorno alle {localSettings.time}
                </p>
              )}
              <AnimatePresence>
                {saved && localSettings.email && emailValid && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg text-sm flex items-center gap-2"
                  >
                    <span>✅</span>
                    <span>Impostazioni salvate automaticamente</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Orario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                🕐 Orario notifica giornaliera
              </label>
              <input
                type="time"
                value={localSettings.time}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Riceverai un riepilogo delle nuove offerte ogni giorno a quest'ora</p>
            </div>

            {/* Prezzo massimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                💰 Prezzo massimo desiderato
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">€</span>
                <input
                  type="number"
                  value={localSettings.maxPrice}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Ricevi una notifica immediata se un'offerta scende sotto questo prezzo</p>
            </div>

            {/* Tipo condizioni */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📦 Condizioni prodotto
              </label>
              <div className="flex gap-3">
                {(['new', 'refurbished', 'used'] as const).map(condition => (
                  <button
                    key={condition}
                    onClick={() => toggleCondition(condition)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      localSettings.conditionFilter.includes(condition)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-300 dark:border-blue-600'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {condition === 'new' ? '🆕 Nuovo' : condition === 'refurbished' ? '🔄 Ricondizionato' : '📦 Usato'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipi di notifica */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📋 Tipi di notifica
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notifyNewOffers}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, notifyNewOffers: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Nuove offerte trovate</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notifyPriceDrop}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, notifyPriceDrop: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Abbassamento prezzi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notifyBackInStock}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, notifyBackInStock: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Prodotto di nuovo disponibile</span>
                </label>
              </div>
            </div>

            {/* Info salvataggio automatico */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <span>💾</span>
                <span>Le modifiche vengono salvate automaticamente nel browser</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
