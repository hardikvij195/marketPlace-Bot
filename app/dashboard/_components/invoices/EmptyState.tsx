import { FileText } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="text-center py-8 text-gray-500">
    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
    <p>{title}</p>
    {description && <p className="text-sm">{description}</p>}
  </div>
);


export default EmptyState;