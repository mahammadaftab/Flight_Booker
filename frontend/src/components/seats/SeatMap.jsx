import React from 'react';

const SeatMap = ({ seats, selectedSeats, onSeatToggle }) => {
  const getSeatClass = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return '';

    if (!seat.available) return 'bg-gray-300 cursor-not-allowed';
    
    if (selectedSeats.includes(seatId)) {
      switch (seat.type) {
        case 'business': return 'bg-yellow-500';
        case 'premium': return 'bg-purple-500';
        case 'economy': return 'bg-blue-500';
        default: return 'bg-blue-500';
      }
    }

    switch (seat.type) {
      case 'business': return 'bg-yellow-200 hover:bg-yellow-300';
      case 'premium': return 'bg-purple-200 hover:bg-purple-300';
      case 'economy': return 'bg-blue-200 hover:bg-blue-300';
      default: return 'bg-blue-200 hover:bg-blue-300';
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-6 gap-3">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => onSeatToggle(seat.id)}
            disabled={!seat.available}
            className={`w-12 h-12 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${getSeatClass(seat.id)} ${seat.available ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            {seat.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;