// src/utils/dateUtils.ts

import { DueDaysResult } from '@/types/ticket';

export const getDueDays = (dueAt: string): DueDaysResult | null => {
  if (!dueAt) return null;

  const dueDate = new Date(dueAt);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0;
  const absDays = Math.abs(diffDays);

  let text: string;
  if (diffDays === 0) {
    text = 'Due today';
  } else if (diffDays === 1) {
    text = 'Due tomorrow';
  } else if (diffDays === -1) {
    text = '1 day overdue';
  } else if (isOverdue) {
    text = `${absDays} days overdue`;
  } else {
    text = `Due in ${diffDays} days`;
  }

  return { text, isOverdue };
};

export function getDaysSince(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays > 1) return `${diffDays} days ago`;
  return null;
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
