import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set, get) => ({
      // Flight search state
      searchParams: {
        from: '',
        to: '',
        departure: '',
        return: '',
        passengers: 1,
        tripType: 'one-way'
      },
      
      setSearchParams: (params) => set((state) => ({
        searchParams: { ...state.searchParams, ...params }
      })),
      
      clearSearchParams: () => set({
        searchParams: {
          from: '',
          to: '',
          departure: '',
          return: '',
          passengers: 1,
          tripType: 'one-way'
        }
      }),
      
      // Booking state
      selectedFlight: null,
      
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      
      clearSelectedFlight: () => set({ selectedFlight: null }),
      
      // Seat selection state
      selectedSeats: [],
      
      addSeat: (seatId) => set((state) => ({
        selectedSeats: [...state.selectedSeats, seatId]
      })),
      
      removeSeat: (seatId) => set((state) => ({
        selectedSeats: state.selectedSeats.filter(id => id !== seatId)
      })),
      
      clearSelectedSeats: () => set({ selectedSeats: [] }),
      
      // Passenger data state
      passengerData: {},
      
      setPassengerData: (data) => set({ passengerData: data }),
      
      clearPassengerData: () => set({ passengerData: {} }),
      
      // Payment state
      paymentData: {},
      
      setPaymentData: (data) => set({ paymentData: data }),
      
      clearPaymentData: () => set({ paymentData: {} }),
      
      // UI state
      loading: false,
      
      setLoading: (loading) => set({ loading }),
      
      // Reset all booking-related state
      resetBooking: () => set({
        selectedFlight: null,
        selectedSeats: [],
        passengerData: {},
        paymentData: {},
        loading: false
      })
    })
  )
);

export default useStore;