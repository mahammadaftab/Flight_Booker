export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString([], { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const calculateDuration = (departureTime, arrivalTime) => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const diffInMs = arrival - departure;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  return diffInMinutes;
};