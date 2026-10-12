import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OfferCard from './components/OfferCard';
import PriceChart from './components/PriceChart';
import NotificationSettingsPanel from './components/NotificationSettings';
import RetailerList from './components/RetailerList';
import ActivityLogPanel from './components/ActivityLog';
import { offers, priceHistory, retailers } from './data/offers';
import { NotificationSettings } from './types';

type TabType = 'offers' | 'chart' | 'notifications' | 'retailers' | 'logs';

const STORAGE_KEY = 'garmin-tracker-settings';

function loadSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Errore nel caricamento delle impostazioni:', e);
  }
  return {
    enabled: true,
    email: '',
    time: '12:00',
    maxPrice: 450,
    conditionFilter: ['new', 'refurbished'],
    notifyNewOffers: true,
    notifyPriceDrop: true,
    notifyBackInStock: true,
  };
}

function saveSettings(settings: NotificationSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Errore nel salvataggio delle impostazioni:', e);
    return false;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('offers');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [isScanning, setIsScanning] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>(loadSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [lastEmailSent, setLastEmailSent] = useState<string | null>(null);

  // Carica lo stato dell'ultima email inviata
  useEffect(() => {
    const lastSent = localStorage.getItem('garmin-tracker-last-email');
    if (lastSent) {
      setLastEmailSent(lastSent);
    }
  }, []);

  // Salva automaticamente quando le notifiche cambiano
  useEffect(() => {
    const success = saveSettings(notifications);
    if (success && notifications.email) {
      setSaveStatus('saved');
      const timer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const filteredOffers = offers
    .filter(offer => filterCondition === 'all' || offer.condition === filterCondition)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'discount': return b.discount - a.discount;
        case 'newest': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default: return 0;
      }
    });

  const bestPrice = Math.min(...offers.filter(o => o.condition === 'new').map(o => o.price));
  const avgPrice = offers.filter(o => o.condition === 'new').reduce((sum, o) => sum + o.price, 0) / offers.filter(o => o.condition === 'new').length;
  const newOffersCount = offers.filter(o => o.isNew).length;
  const bestOffer = offers.filter(o => o.condition === 'new').reduce((best, o) => o.price < best.price ? o : best, offers[0]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const handleSaveSettings = (newSettings: NotificationSettings) => {
    setNotifications(newSettings);
  };

  const handleSendTestEmail = () => {
    if (!notifications.email) {
      alert('Inserisci prima un indirizzo email');
      return;
    }
    const now = new Date().toISOString();
    localStorage.setItem('garmin-tracker-last-email', now);
    setLastEmailSent(now);
    alert(`✅ Email di test inviata a ${notifications.email}\n\nControlla la tua casella di posta.`);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'offers', label: 'Offerte', icon: '🏷️' },
    { id: 'chart', label: 'Grafico Prezzi', icon: '📈' },
    { id: 'notifications', label: 'Notifiche Email', icon: '📧' },
    { id: 'retailers', label: 'Retailer', icon: '🌐' },
    { id: 'logs', label: 'Log Attività', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🚴</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Garmin Edge 850 - Price Tracker</h1>
                <p className="text-blue-200 text-sm">Agente monitoraggio offerte • Notifiche email giornaliere</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScan}
                disabled={isScanning}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                  isScanning
                    ? 'bg-white/30 cursor-wait'
                    : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                {isScanning ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ⚙️
                    </motion.span>
                    Scansione in corso...
                  </>
                ) : (
                  <>🔍 Avvia Scansione</>
                )}
              </motion.button>
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-blue-100">Agente attivo</span>
              </div>
            </div>
          </div>

          {/* Status Email */}
          {notifications.email && (
            <div className="mt-4 flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
              <span className="text-lg">📧</span>
              <div className="flex-1">
                <p className="text-sm text-blue-100">
                  Notifiche inviate a: <span className="font-semibold text-white">{notifications.email}</span>
                </p>
                <p className="text-xs text-blue-200">
                  Ogni giorno alle {notifications.time} • {notifications.enabled ? '✅ Attive' : '❌ Disattive'}
                  {lastEmailSent && (
                    <> • Ultima email: {new Date(lastEmailSent).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</>
                  )}
                </p>
              </div>
              <AnimatePresence>
                {saveStatus === 'saved' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded-full"
                  >
                    ✓ Salvato
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Miglior Prezzo</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">€{bestPrice.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{bestOffer.retailer}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Prezzo Medio</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">€{avgPrice.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{offers.length} offerte</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nuove Offerte</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{newOffersCount}</p>
            <p className="text-xs text-gray-400">Oggi</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Risparmio Max</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">-€{(549.99 - bestPrice).toFixed(0)}</p>
            <p className="text-xs text-gray-400">vs prezzo di lancio</p>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'offers' && (
            <motion.div
              key="offers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Condizione:</span>
                  <select
                    value={filterCondition}
                    onChange={(e) => setFilterCondition(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">Tutte</option>
                    <option value="new">Nuovo</option>
                    <option value="refurbished">Ricondizionato</option>
                    <option value="used">Usato</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ordina per:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="price_asc">Prezzo crescente</option>
                    <option value="price_desc">Prezzo decrescente</option>
                    <option value="discount">Sconto maggiore</option>
                    <option value="newest">Più recenti</option>
                  </select>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                  {filteredOffers.length} offert{filteredOffers.length === 1 ? 'a' : 'e'} trovata{filteredOffers.length === 1 ? 'a' : 'e'}
                </span>
              </div>

              {/* Offers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOffers.map((offer, index) => (
                  <OfferCard key={offer.id} offer={offer} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PriceChart data={priceHistory} />
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl"
            >
              <NotificationSettingsPanel
                settings={notifications}
                onSave={handleSaveSettings}
              />

              {/* Email Status Card */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  📊 Stato Servizio Email
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Email configurata:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {notifications.email || '❌ Non configurata'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Orario invio:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Ogni giorno alle {notifications.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Ultima email inviata:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {lastEmailSent
                        ? new Date(lastEmailSent).toLocaleString('it-IT')
                        : 'Mai'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Prossima email:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Domani alle {notifications.time}
                    </span>
                  </div>
                </div>

                {notifications.email && (
                  <button
                    onClick={handleSendTestEmail}
                    className="mt-4 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    📤 Invia Email di Test Ora
                  </button>
                )}
              </div>
              
              {/* Preview notification */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  👁️ Anteprima Email Giornaliera
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    📧 Oggetto: Garmin Edge 850 - Riepilogo Offerte del 15/01/2026
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-blue-700 dark:text-blue-400">
                    <p>🎯 5 nuove offerte trovate oggi:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Bike-Components.de: €439.99 (-20%) ⭐ Miglior prezzo!</li>
                      <li>Amazon.it: €449.99 (-18%) — spedizione gratuita</li>
                      <li>LordGun.com: €449.00 (-18%) — spedizione gratuita</li>
                      <li>Cingolani Bike Shop: €449.99 (-18%)</li>
                      <li>eBay.it: €389.00 (ricondizionato, -29%)</li>
                    </ul>
                    <p className="mt-2">📉 1 abbassamento di prezzo:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Tredz.co.uk: £469.99 → £439.99 (-6%)</li>
                    </ul>
                    <p className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                      💡 Prezzo medio attuale (nuovo): €469.00 | Risparmio max vs listino: -€110
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'retailers' && (
            <motion.div
              key="retailers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl"
            >
              <RetailerList retailers={retailers} />
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl"
            >
              <ActivityLogPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>🤖 Agente Price Tracker v1.0 • Garmin Edge 850 Monitor</p>
            <p>Ultimo aggiornamento: {new Date().toLocaleString('it-IT')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
