import React, {useState} from "react";

type plotTypes = {
  _id: string;
  status: string;
  registrationCharge: number;
  plotNumber: number;
  price: number;
};

type LandDonationSelectorProps = {
  onAmountChange?: (totalAmount: number) => void;
  onPlotsChange?: (selectedPlots: plotTypes[]) => void;
  plots: plotTypes[];
};

const LandDonationSelector: React.FC<LandDonationSelectorProps> = ({
  onAmountChange,
  onPlotsChange,
  plots,
}) => {
  // Sample data matching your structure
  const [plotsData] = useState<plotTypes[]>(plots);

  const [selectedPlots, setSelectedPlots] = useState<plotTypes[]>([]);

  // Function to handle plot selection (multi-select)
  const handlePlotClick = (plot: plotTypes) => {
    if (plot.status === "available") {
      setSelectedPlots(prevSelected => {
        const isAlreadySelected = prevSelected.some(p => p._id === plot._id);
        let newSelectedPlots: plotTypes[];

        if (isAlreadySelected) {
          // Remove from selection
          newSelectedPlots = prevSelected.filter(p => p._id !== plot._id);
        } else {
          // Add to selection
          newSelectedPlots = [...prevSelected, plot];
        }

        // Calculate total amount
        const totalAmount = newSelectedPlots.reduce((sum, p) => sum + p.price, 0);
        const totalRegistrationAmount = newSelectedPlots.reduce(
          (sum, r) => sum + r.registrationCharge,
          0
        );

        const grandTotal = totalAmount + totalRegistrationAmount;

        // Call callbacks
        onAmountChange?.(grandTotal);
        onPlotsChange?.(newSelectedPlots);
        return newSelectedPlots;
      });
    }
  };

  // Function to get the appropriate styling for each plot based on status
  const getPlotStyle = (plot: plotTypes) => {
    const baseStyle =
      "w-14 h-14 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-medium";
    const isSelected = selectedPlots.some(p => p._id === plot._id);

    switch (plot.status) {
      case "occupied":
        return `${baseStyle} bg-red-300 border-red-400 text-red-800 cursor-not-allowed`;
      case "on_emi":
        return `${baseStyle} bg-green-400 border-green-500 text-white hover:bg-green-500`;
      case "payment_pending":
        return `${baseStyle} bg-blue-300 border-blue-400 text-blue-800 cursor-not-allowed`;
      case "available":
        return isSelected
          ? `${baseStyle} bg-orange-400 border-orange-500 text-white shadow-lg scale-105`
          : `${baseStyle} bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400`;
      default:
        return `${baseStyle} bg-gray-100 border-gray-300`;
    }
  };

  // Create a 7x12 grid (84 plots total)
  const rows = 7;
  const cols = 12;
  const gridPlots = Array(rows * cols)
    .fill(null)
    .map((_, index) => {
      const plotNumber = index + 1;
      return (
        plotsData.find(plot => plot.plotNumber === plotNumber) ||
        ({
          _id: `empty-${plotNumber}`,
          plotNumber,
          status: "available",
          price: 125000,
          registrationCharge: 1000,
          donor: null,
          indication: null,
        } as plotTypes)
      );
    });

  return (
    <div className="max-w-6xl bg-white">
      <h1 className="text-1xl font-bold text-gray-800 mb-2">
        Select your Land Areas to Donate
        {selectedPlots.length > 0 && (
          <span className="text-orange-600 text-1xl ml-2">({selectedPlots.length} selected)</span>
        )}
      </h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 border border-red-400 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 border border-green-500 rounded"></div>
          <span className="text-sm font-medium text-gray-700">On EMI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 border border-blue-400 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Payment Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-sm font-medium text-gray-700">
            Available (Click to select multiple)
          </span>
        </div>
      </div>

      {/* Plot Grid */}
      <div className="flex flex-wrap  gap-2 mb-8 p-4 bg-gray-50 rounded-lg">
        {gridPlots.map(plot => (
          <div
            key={plot._id}
            className={getPlotStyle(plot)}
            onClick={() => handlePlotClick(plot)}
            title={`Plot ${plot.plotNumber} - ${plot.status
              .replace("_", " ")
              .toUpperCase()} - ₹${plot.price.toLocaleString()} ${
              selectedPlots.some(p => p._id === plot._id) ? "(Selected)" : ""
            }`}>
            {plot.plotNumber}
          </div>
        ))}
      </div>

      {/* Clear Selection Button */}
      {selectedPlots.length > 0 && (
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedPlots([]);
              onAmountChange?.(0);
              onPlotsChange?.([]);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Clear All Selections
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Selected: {selectedPlots.length} plots</p>
            <p className="text-lg font-bold text-orange-600 ">
              Total Amount: ₹
              {selectedPlots.reduce((sum, plot) => sum + plot.price, 0).toLocaleString()} + ₹
              {selectedPlots
                .reduce((sum, plot) => sum + plot.registrationCharge, 0)
                .toLocaleString()}{" "}
            </p>
            <caption className="text-nowrap text-xs  font-light">
              Plot Charge + Registration charge for each yard
            </caption>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandDonationSelector;
