import { motion } from 'framer-motion';

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'scan' | 'offer_found' | 'price_drop' | 'notification_sent' | 'error';
  message: string;
}

const activityLogs: ActivityLog[] = [
  { id: '1', timestamp: '2026-01-15T12:30:00', type: 'notification_sent', message: 'Notifica giornaliera inviata a utente@email.it con 5 nuove offerte' },
  { id: '2', timestamp: '2026-01-15T12:00:00', type: 'offer_found', message: 'Nuova offerta su Amazon.it: €449.99 (-18%) — spedizione gratuita' },
  { id: '3', timestamp: '2026-01-15T11:00:00', type: 'offer_found', message: 'Nuova offerta su Cingolani Bike Shop: €449.99 (-18%)' },
  { id: '4', timestamp: '2026-01-15T10:30:00', type: 'offer_found', message: 'Nuova offerta su LordGun.com: €449.00 (-18%) — spedizione gratuita' },
  { id: '5', timestamp: '2026-01-15T10:00:00', type: 'scan', message: 'Scansione completata: 10 retailer controllati, 10 offerte trovate' },
  { id: '6', timestamp: '2026-01-15T09:15:00', type: 'price_drop', message: 'Prezzo abbassato su Tredz.co.uk: da £469.99 a £439.99 (-6%)' },
  { id: '7', timestamp: '2026-01-15T08:00:00', type: 'scan', message: 'Scansione completata: 10 retailer controllati, 9 offerte trovate' },
  { id: '8', timestamp: '2026-01-15T07:30:00', type: 'offer_found', message: 'Nuova offerta su eBay.it: €389.00 (ricondizionato, -29%)' },
  { id: '9', timestamp: '2026-01-14T18:00:00', type: 'price_drop', message: 'Prezzo abbassato su Bike-Components.de: da €459.99 a €439.99 (-20%)' },
  { id: '10', timestamp: '2026-01-14T16:00:00', type: 'notification_sent', message: 'Notifica giornaliera inviata a utente@email.it con 2 nuove offerte' },
  { id: '11', timestamp: '2026-01-14T12:00:00', type: 'scan', message: 'Scansione completata: 10 retailer controllati, 8 offerte trovate' },
  { id: '12', timestamp: '2026-01-14T10:00:00', type: 'offer_found', message: 'idealo.it: miglior prezzo attuale €449.00 da 3 venditori diversi' },
];

export default function ActivityLogPanel() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'scan': return '🔍';
      case 'offer_found': return '🎯';
      case 'price_drop': return '📉';
      case 'notification_sent': return '📧';
      case 'error': return '⚠️';
      default: return '📋';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'scan': return 'border-l-blue-500';
      case 'offer_found': return 'border-l-green-500';
      case 'price_drop': return 'border-l-yellow-500';
      case 'notification_sent': return 'border-l-purple-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          📋 Log Attività Agente
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          Ultime 24h
        </span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {activityLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-l-4 ${getColor(log.type)}`}
          >
            <span className="text-lg">{getIcon(log.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 dark:text-gray-200">{log.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(log.timestamp).toLocaleString('it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
