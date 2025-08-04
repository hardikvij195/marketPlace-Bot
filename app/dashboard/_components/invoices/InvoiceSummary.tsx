import { Badge } from '@/components/ui/badge';

interface InvoiceSummaryProps {
  totalDeals: number;
  totalProfit: number;
  totalCommission: number;
}

const InvoiceSummary = ({ totalDeals, totalProfit, totalCommission }: InvoiceSummaryProps) => (
  <div className="bg-blue-50 p-4 rounded-lg mb-6">
    <div className="grid md:grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-sm text-gray-600">Total Deals</p>
        <p className="text-2xl font-bold text-blue-600">{totalDeals}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Total Profit</p>
        <p className="text-2xl font-bold text-green-600">${totalProfit.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Total Commission</p>
        <p className="text-2xl font-bold text-blue-600">${totalCommission.toFixed(2)}</p>
      </div>
    </div>
  </div>
);


export default InvoiceSummary;