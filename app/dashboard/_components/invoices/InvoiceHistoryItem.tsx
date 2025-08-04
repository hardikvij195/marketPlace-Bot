import { Badge } from '@/components/ui/badge';

interface InvoiceHistoryItemProps {
  invoice: {
    id: string;
    month: string;
    submittedDate: string;
    status: string;
    deals: any[];
    totalProfit: number;
    totalCommission: number;
  };
}

const InvoiceHistoryItem = ({ invoice }: InvoiceHistoryItemProps) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="font-semibold">{invoice.month}</h3>
        <p className="text-sm text-gray-600">
          Submitted: {new Date(invoice.submittedDate).toLocaleDateString()}
        </p>
      </div>
      <Badge variant={invoice.status === 'pending' ? 'secondary' : 'default'}>
        {invoice.status}
      </Badge>
    </div>
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-gray-600">Deals:</span> {invoice.deals.length}
      </div>
      <div>
        <span className="text-gray-600">Total Profit:</span> ${invoice.totalProfit.toFixed(2)}
      </div>
      <div>
        <span className="text-gray-600">Commission:</span> ${invoice.totalCommission.toFixed(2)}
      </div>
    </div>
  </div>
);

export default InvoiceHistoryItem