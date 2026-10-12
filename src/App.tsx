import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OfferCard from './components/OfferCard';
import PriceChart from './components/PriceChart';
import NotificationSettingsPanel from './components/NotificationSettings';
import RetailerList from './components/RetailerList';
import ActivityLogPanel from './components/ActivityLog';
import { offers, priceHistory, retailers } from './data/offers';
import { NotificationSettings } from './types';

type TabType = 'offers' | 'chart' | 'notifications' | 'retailers' | 'logs';

interface SearchResult {
  id: string;
  name: string;
  image: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  offersCount: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('offers');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('Garmin Edge 850');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    enabled: true,
    email: 'utente@email.it',
    time: '12:00',
    maxPrice: 450,
    conditionFilter: ['new', 'refurbished'],
    notifyNewOffers: true,
    notifyPriceDrop: true,
    notifyBackInStock: true,
  });

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setShowSearchResults(true);
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 1500);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSelectProduct = (productName: string) => {
    setSelectedProduct(productName);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Simulated search results
  const searchResults: SearchResult[] = searchQuery.trim().length > 0 ? [
    {
      id: '1',
      name: searchQuery,
      image: '📱',
      category: 'Elettronica',
      minPrice: 299,
      maxPrice: 899,
      offersCount: 15,
    },
    {
      id: '2',
      name: `${searchQuery} Pro`,
      image: '⚡',
      category: 'Elettronica',
      minPrice: 499,
      maxPrice: 1299,
      offersCount: 8,
    },
    {
      id: '3',
      name: `${searchQuery} Plus`,
      image: '✨',
      category: 'Elettronica',
      minPrice: 599,
      maxPrice: 1499,
      offersCount: 12,
    },
  ] : [];

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'offers', label: 'Offerte', icon: '🏷️' },
    { id: 'chart', label: 'Grafico Prezzi', icon: '📈' },
    { id: 'notifications', label: 'Notifiche', icon: '🔔' },
    { id: 'retailers', label: 'Retailer', icon: '🌐' },
    { id: 'logs', label: 'Log Attività', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Price Tracker Agent</h1>
                <p className="text-blue-200 text-sm">Monitoraggio offerte • Aggiornamento automatico ogni 4h</p>
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

          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cerca un prodotto da monitorare... (es: iPhone 15, PlayStation 5, Nike Air Max)"
                className="w-full px-5 py-3 pl-12 bg-white/95 text-gray-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-500 text-base"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </div>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  {isSearching ? (
                    <div className="p-6 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block text-3xl"
                      >
                        ⚙️
                      </motion.div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">Ricerca in corso...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Risultati per "{searchQuery}"
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSelectProduct(result.name)}
                            className="w-full px-4 py-3 flex items-center gap-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <span className="text-3xl">{result.image}</span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{result.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{result.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                €{result.minPrice} - €{result.maxPrice}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {result.offersCount} offerte
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          💡 Seleziona un prodotto per iniziare il monitoraggio
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Current Product Badge */}
          {selectedProduct && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-blue-200">Prodotto monitorato:</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {selectedProduct}
              </span>
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
                onSave={setNotifications}
              />
              
              {/* Preview notification */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  👁️ Anteprima Notifica Giornaliera
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
