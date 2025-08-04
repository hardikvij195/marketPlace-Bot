// app/dashboard/calculator/_components/DeductionsSection.tsx
import { DealData } from "@/lib/data";
import React from "react";

interface DeductionsSectionProps {
  dealData: DealData;
  handleInputChange: (field: keyof DealData, value: string | number) => void;
}

export const DeductionsSection = ({ 
  dealData, 
  handleInputChange 
}: DeductionsSectionProps) => (
  <div className="md:col-span-1">
    <h3 className="text-lg font-semibold mb-4 text-red-700">Deductions</h3>
    
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Cost
          </label>
          <input
            type="number"
            value={dealData.vehicleCost}
            onChange={(e) => handleInputChange("vehicleCost", parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warranty Cost
          </label>
          <input
            type="number"
            value={dealData.warrantyCost}
            onChange={(e) => handleInputChange("warrantyCost", parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GAP Cost
        </label>
        <input
          type="number"
          value={dealData.gapCost}
          onChange={(e) => handleInputChange("gapCost", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product 1 Cost
        </label>
        <input
          type="number"
          value={dealData.product1Cost}
          onChange={(e) => handleInputChange("product1Cost", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product 2 Cost
        </label>
        <input
          type="number"
          value={dealData.product2Cost}
          onChange={(e) => handleInputChange("product2Cost", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product 3 Cost
        </label>
        <input
          type="number"
          value={dealData.product3Cost}
          onChange={(e) => handleInputChange("product3Cost", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Safety Cost
        </label>
        <input
          type="number"
          value={dealData.safetyCost}
          onChange={(e) => handleInputChange("safetyCost", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pack
        </label>
        <input
          type="number"
          value={dealData.packCost}
          onChange={(e) => handleInputChange("packCost", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reserve Cost
        </label>
        <input
          type="number"
          value={dealData.reserveCost}
          onChange={(e) => handleInputChange("reserveCost", parseFloat(e.target.value) || 0)}
          placeholder="0"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  </div>
);