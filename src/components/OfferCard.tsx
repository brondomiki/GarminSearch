import { Offer } from '../types';
import { motion } from 'framer-motion';

interface OfferCardProps {
  offer: Offer;
  index: number;
}

export default function OfferCard({ offer, index }: OfferCardProps) {
  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Disponibile</span>;
      case 'low_stock':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">Ultime disponibilità</span>;
      case 'preorder':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Pre-ordine</span>;
      case 'out_of_stock':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Esaurito</span>;
      default:
        return null;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Nuovo</span>;
      case 'refurbished':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Ricondizionato</span>;
      case 'used':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Usato</span>;
      default:
        return null;
    }
  };

  const getShippingInfo = (offer: Offer) => {
    switch (offer.shipping) {
      case 'free':
        return <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Spedizione gratuita</span>;
      case 'paid':
        return <span className="text-gray-500 dark:text-gray-400 text-sm">Spedizione: €{offer.shippingCost?.toFixed(2)}</span>;
      case 'pickup':
        return <span className="text-gray-500 dark:text-gray-400 text-sm">Ritiro a mano</span>;
      default:
        return null;
    }
  };

  const totalPrice = offer.price + (offer.shippingCost || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
    >
      {offer.isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          NUOVO
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{offer.retailerLogo}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{offer.retailer}</h3>
            <div className="flex gap-2 mt-1">
              {getConditionBadge(offer.condition)}
              {getAvailabilityBadge(offer.availability)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            €{offer.price.toFixed(2)}
          </div>
          {offer.originalPrice > offer.price && (
            <div className="text-sm text-gray-400 line-through">
              €{offer.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">{'★'.repeat(Math.floor(offer.rating || 0))}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {offer.rating} ({offer.reviews} recensioni)
          </span>
        </div>
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full text-sm font-bold">
          -{offer.discount}%
        </div>
      </div>

      <div className="flex items-center justify-between">
        {getShippingInfo(offer)}
        {offer.shippingCost && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Totale: €{totalPrice.toFixed(2)}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Aggiornato: {new Date(offer.lastUpdated).toLocaleString('it-IT')}
        </span>
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Vai all'offerta →
        </a>
      </div>
    </motion.div>
  );
}
