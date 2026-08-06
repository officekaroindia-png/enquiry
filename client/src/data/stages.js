export const STAGES = [
  {
    id: 'enquiry_received', label: 'Enquiry Received', short: 'Enquiry', step: 1,
    color: {
      light: { bg: '#E0F2FE', border: '#7DD3FC', text: '#0369A1', dot: '#38BDF8' },
      dark:  { bg: '#0C2D48', border: '#0369A1', text: '#7DD3FC', dot: '#38BDF8' },
    },
  },
  {
    id: 'contact', label: 'Contact', short: 'Contact', step: 2,
    color: {
      light: { bg: '#DBEAFE', border: '#93C5FD', text: '#1D4ED8', dot: '#3B82F6' },
      dark:  { bg: '#0F1F4A', border: '#1D4ED8', text: '#93C5FD', dot: '#3B82F6' },
    },
  },
  {
    id: 'presentation', label: 'Presentation', short: 'Presentation', step: 3,
    color: {
      light: { bg: '#FEFCE8', border: '#FACC15', text: '#713F12', dot: '#FACC15' },
      dark:  { bg: '#2D2200', border: '#FACC15', text: '#FDE047', dot: '#FACC15' },
    },
  },
  {
    id: 'site_visit', label: 'Site Visit', short: 'Site Visit', step: 4,
    color: {
      light: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', dot: '#D97706' },
      dark:  { bg: '#2D1A00', border: '#D97706', text: '#FCD34D', dot: '#D97706' },
    },
  },
  {
    id: 'commercial_offer', label: 'Commercial Offer', short: 'Commercial', step: 5,
    color: {
      light: { bg: '#FFF4E6', border: '#FF8C00', text: '#C2410C', dot: '#FF8C00' },
      dark:  { bg: '#2D1200', border: '#FF8C00', text: '#FDBA74', dot: '#FF8C00' },
    },
  },
  {
    id: 'order', label: 'Order', short: 'Order', step: 6,
    color: {
      light: { bg: '#FFF1EE', border: '#FF4500', text: '#9A1E00', dot: '#FF4500' },
      dark:  { bg: '#2D0A00', border: '#FF4500', text: '#FCA89A', dot: '#FF4500' },
    },
  },
  {
    id: 'execution', label: 'Execution', short: 'Execution', step: 7,
    color: {
      light: { bg: '#DCFCE7', border: '#86EFAC', text: '#166534', dot: '#4ADE80' },
      dark:  { bg: '#052E16', border: '#166534', text: '#86EFAC', dot: '#4ADE80' },
    },
  },
  {
    id: 'payment', label: 'Payment', short: 'Payment', step: 8,
    color: {
      light: { bg: '#D1FAE5', border: '#34D399', text: '#065F46', dot: '#059669' },
      dark:  { bg: '#022C22', border: '#065F46', text: '#34D399', dot: '#059669' },
    },
  },
];

export const CLOSED_WON = {
  id: 'closed_won', label: 'Closed Won',
  color: {
    light: { bg: '#ECFDF5', border: '#6EE7B7', text: '#064E3B', dot: '#10B981' },
    dark:  { bg: '#012018', border: '#064E3B', text: '#6EE7B7', dot: '#10B981' },
  },
};

export const CLOSED_LOST = {
  id: 'closed_lost', label: 'Closed Lost',
  color: {
    light: { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', dot: '#EF4444' },
    dark:  { bg: '#2D0A0A', border: '#991B1B', text: '#FCA5A5', dot: '#EF4444' },
  },
};

export const getStageById = (id) =>
  STAGES.find((s) => s.id === id) ||
  (id === 'closed_won' ? CLOSED_WON : null) ||
  (id === 'closed_lost' ? CLOSED_LOST : null);

// All stages the user can move TO from current (all stages except current one)
export const getValidNextStages = (currentId) => {
  return STAGES.filter((s) => s.id !== currentId);
};
