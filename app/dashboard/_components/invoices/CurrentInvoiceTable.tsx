import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CurrentInvoiceTableProps {
  items: any[];
  onRemove: (id: string) => void;
  isLoading: boolean;
}

const CurrentInvoiceTable = ({
  items,
  onRemove,
  isLoading,
}: CurrentInvoiceTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Vehicle</TableHead>
        <TableHead>VIN</TableHead>
        <TableHead className="text-right">Profit</TableHead>
        <TableHead className="text-right">Commission</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
          <TableCell className="font-medium">{item.clientName}</TableCell>
          <TableCell>{item.vehicle}</TableCell>
          <TableCell className="font-mono text-sm">{item.vin}</TableCell>
          <TableCell className="text-right">
            <span
              className={item.profit >= 0 ? "text-green-600" : "text-red-600"}
            >
              ${item.profit.toFixed(2)}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <span
              className={
                item.commission >= 0 ? "text-blue-600" : "text-red-600"
              }
            >
              ${item.commission.toFixed(2)}
            </span>
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item._id)}
              className="text-red-600 hover:text-red-700"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);


export default CurrentInvoiceTable;
