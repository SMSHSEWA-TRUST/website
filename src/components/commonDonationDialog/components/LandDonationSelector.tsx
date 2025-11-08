import React, { useState, useEffect } from "react";

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
  initialSelectedPlots?: plotTypes[];
};

const LandDonationSelector: React.FC<LandDonationSelectorProps> = ({
  onAmountChange,
  onPlotsChange,
  plots,
  initialSelectedPlots = [],
}) => {
  // Use the incoming plots prop directly; keep selectedPlots in state
  const plotsData = plots || [];

  const [selectedPlots, setSelectedPlots] = useState<plotTypes[]>(initialSelectedPlots);
  const [showAllPlots, setShowAllPlots] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is md breakpoint in Tailwind
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize callbacks with initial selected plots
  useEffect(() => {
    if (initialSelectedPlots.length > 0) {
      const totalAmount = initialSelectedPlots.reduce((sum, p) => sum + p.price, 0);
      onAmountChange?.(totalAmount);
      onPlotsChange?.(initialSelectedPlots);
    }
  }, []); // Empty dependency array since we only want this to run once on mount

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
        // const totalRegistrationAmount = newSelectedPlots.reduce(
        //   (sum, r) => sum + r.registrationCharge,
        //   0
        // );

        const grandTotal = totalAmount

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

    // Normalize API status values and map them to UI styles.
    const status = String(plot.status || '').toLowerCase();
    // API may return statuses such as: 'available', 'purchases', 'EMI', or other variants.
    if (status === 'available') {
      return isSelected
        ? `${baseStyle} bg-orange-400 border-orange-500 text-white shadow-lg scale-105`
        : `${baseStyle} bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400`;
    }

    if (status === 'purchases' || status === 'purchased' || status === 'occupied') {
      return `${baseStyle} bg-red-300 border-red-400 text-red-800 cursor-not-allowed`;
    }

    if (status === 'pending' || status === 'payment_pending' || status === 'payment-pending') {
      return `${baseStyle} bg-blue-300 border-blue-400 text-blue-800 cursor-not-allowed`;
    }

    if (status === 'emi' || status === 'on_emi' || status === 'on-emi') {
      return `${baseStyle} bg-green-400 border-green-500 text-white hover:bg-green-500`;
    }

    // fallback to a neutral "payment pending" / unknown state
    return `${baseStyle} bg-blue-300 border-blue-400 text-blue-800 cursor-not-allowed`;
  };

  // Use only the plots returned by the API. Sort them by plotNumber so the
  // UI displays plots in numeric order. We no longer create placeholder
  // entries — everything comes from the API as you requested.
  const sortedPlots = [...plotsData].sort((a, b) => (a.plotNumber || 0) - (b.plotNumber || 0));

  // Determine which plots to display based on mobile view and showAllPlots state
  const MOBILE_INITIAL_LIMIT = 10;
  const displayedPlots = isMobile && !showAllPlots
    ? sortedPlots.slice(0, MOBILE_INITIAL_LIMIT)
    : sortedPlots;

  const hasMorePlots = isMobile && sortedPlots.length > MOBILE_INITIAL_LIMIT;
  const hiddenPlotsCount = sortedPlots.length - MOBILE_INITIAL_LIMIT;

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
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Available (Click to select)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-300 border border-blue-400 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 border border-green-500 rounded"></div>
          <span className="text-sm font-medium text-gray-700">EMI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 border border-red-400 rounded"></div>
          <span className="text-sm font-medium text-gray-700">Purchased / Occupied</span>
        </div>
      </div>

      {/* Plot Grid */}
      <div className="flex flex-wrap  gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
        {displayedPlots.map((plot: plotTypes) => {
          const titleText = `Plot ${plot.plotNumber} - ${String(plot.status || '').replace(/_/g, ' ').toUpperCase()} - ₹${Number(plot.price || 0).toLocaleString()}${selectedPlots.some(p => p._id === plot._id) ? ' (Selected)' : ''}`;
          return (
            <div
              key={plot._id}
              className={getPlotStyle(plot)}
              onClick={() => handlePlotClick(plot)}
              title={titleText}
            >
              {plot.plotNumber}
            </div>
          );
        })}
      </div>

      {/* View All Button - Only visible on mobile when there are more plots */}
      {hasMorePlots && !showAllPlots && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowAllPlots(true)}
            className="bg-[#AD2F16] hover:bg-[#8B1810] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2">
            <span>View All Plots</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
              +{hiddenPlotsCount} more
            </span>
          </button>
        </div>
      )}

      {/* Show Less Button - Visible on mobile when all plots are shown */}
      {isMobile && showAllPlots && hasMorePlots && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowAllPlots(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md">
            Show Less
          </button>
        </div>
      )}

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
              {selectedPlots.reduce((sum, plot) => sum + plot.price, 0).toLocaleString()}
              {/* + ₹
              {selectedPlots
                .reduce((sum, plot) => sum + plot.registrationCharge, 0)
                .toLocaleString()}{" "} */}
            </p>
            <caption className="text-nowrap text-xs  font-light">
              Plot Charge
            </caption>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandDonationSelector;
