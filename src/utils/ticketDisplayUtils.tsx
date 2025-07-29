// utils/ticketDisplayUtils.tsx
import React from 'react';
import { BiChevronsUp, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FaWarehouse, FaHouseUser } from "react-icons/fa";
import { 
  Priority, 
  TicketStatus, 
  Location, 
  PriorityConfig, 
  StatusConfig, 
  LocationConfig 
} from '@/types/ticket';

export const PRIORITY_CONFIG: PriorityConfig = {
  low: { label: 'Low', icon: BiChevronDown, className: 'text-yellow-400' },
  normal: { label: 'Normal', icon: BiChevronUp, className: 'text-green-400' },
  high: { label: 'High', icon: BiChevronsUp, className: 'text-red-500' },
};

export const STATUS_CONFIG: StatusConfig = {
  pending: 'Pending',
  in_progress: 'In Progress', 
  waiting: 'Waiting',
  ready: 'Ready',
  closed: 'Closed',
  open: 'Open',
};

export const LOCATION_CONFIG: LocationConfig = {
  in_shop: { label: 'In Shop', icon: FaWarehouse, className: 'text-white' },
  on_site: { label: 'On Site', icon: FaHouseUser, className: 'text-green-400' },
};

export const getPriorityDisplay = (priority: Priority): React.JSX.Element => {
  const config = PRIORITY_CONFIG[priority] || { label: priority };
  const Icon = config.icon;
  
  return (
    <span className="inline-flex items-center">
      {config.label}
      {Icon && <Icon className={`${config.className} ml-1`} />}
    </span>
  );
};

export const getStatusDisplay = (status: TicketStatus): React.JSX.Element => {
  const label = STATUS_CONFIG[status] || status;
  return (
    <span className="inline-flex items-center font-normal gap-1 ml-1">
      {label}
    </span>
  );
};

export const getLocationDisplay = (location: Location): React.JSX.Element => {
  const config = LOCATION_CONFIG[location] || { label: location };
  const Icon = config.icon;
  
  return (
    <span className="inline-flex items-center font-normal gap-1">
      {config.label}
      {Icon && <Icon className={`${config.className} ml-1`} />}
    </span>
  );
};