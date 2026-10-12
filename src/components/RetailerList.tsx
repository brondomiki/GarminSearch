import { Retailer } from '../types';

interface RetailerListProps {
  retailers: Retailer[];
}

export default function RetailerList({ retailers }: RetailerListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Attivo</span>;
      case 'error':
        return <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"><span className="w-2 h-2 rounded-full bg-red-500"></span> Errore</span>;
      case 'paused':
        return <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-400"></span> In pausa</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🌐 Retailer Monitorati
      </h3>
      <div className="space-y-2">
        {retailers.map((retailer) => (
          <div
            key={retailer.name}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{retailer.logo}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{retailer.name}</p>
                <p className="text-xs text-gray-500">
                  Controllato: {new Date(retailer.lastChecked).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {retailer.offersCount} offert{retailer.offersCount === 1 ? 'a' : 'e'}
              </span>
              {getStatusBadge(retailer.status)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {retailers.filter(r => r.status === 'active').length} retailer attivi • 
          Controllo automatico ogni 4 ore
        </p>
      </div>
    </div>
  );
}
