import { motion } from 'framer-motion';

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'scan' | 'offer_found' | 'price_drop' | 'notification_sent' | 'error';
  message: string;
}

const activityLogs: ActivityLog[] = [
  { id: '1', timestamp: '2026-01-15T12:00:00', type: 'notification_sent', message: 'Notifica giornaliera inviata a utente@email.it con 3 nuove offerte' },
  { id: '2', timestamp: '2026-01-15T12:00:00', type: 'offer_found', message: 'Nuova offerta trovata su Bike-Components.de: €439.99 (-20%)' },
  { id: '3', timestamp: '2026-01-15T11:00:00', type: 'offer_found', message: 'Nuova offerta trovata su eBay: €389.00 (ricondizionato)' },
  { id: '4', timestamp: '2026-01-15T10:30:00', type: 'offer_found', message: 'Nuova offerta trovata su Decathlon: €469.00 (-15%)' },
  { id: '5', timestamp: '2026-01-15T10:00:00', type: 'scan', message: 'Scansione completata: 8 retailer controllati, 8 offerte trovate' },
  { id: '6', timestamp: '2026-01-15T09:15:00', type: 'price_drop', message: 'Prezzo abbassato su Bikester.it: da €479.90 a €459.90' },
  { id: '7', timestamp: '2026-01-15T08:00:00', type: 'scan', message: 'Scansione completata: 8 retailer controllati, 7 offerte trovate' },
  { id: '8', timestamp: '2026-01-14T18:00:00', type: 'error', message: 'Errore connessione con Wiggle.it - timeout' },
  { id: '9', timestamp: '2026-01-14T16:00:00', type: 'offer_found', message: 'Nuova offerta trovata su Subito.it: €350.00 (usato)' },
  { id: '10', timestamp: '2026-01-14T12:00:00', type: 'notification_sent', message: 'Notifica giornaliera inviata a utente@email.it con 2 nuove offerte' },
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
      <div className="space-y-2 max-h-80 overflow-y-auto">
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
