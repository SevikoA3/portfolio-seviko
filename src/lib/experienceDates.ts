import type { Experience, ExperienceRole } from './types';

type MonthParts = {
  year: number;
  month: number;
};

function parseYearMonth(value: string): MonthParts {
  const match = /^(\d{4})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error(`Invalid year-month value: ${value}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
  };
}

function monthIndex(parts: MonthParts): number {
  return parts.year * 12 + (parts.month - 1);
}

function getCurrentMonthParts(): MonthParts {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

function getRoleEndParts(role: ExperienceRole): MonthParts {
  return role.endDate ? parseYearMonth(role.endDate) : getCurrentMonthParts();
}

function formatMonthYear(value: string): string {
  const { year, month } = parseYearMonth(value);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatExperiencePeriod(role: ExperienceRole): string {
  const start = formatMonthYear(role.startDate);
  const end = role.endDate ? formatMonthYear(role.endDate) : 'Present';

  return `${start} - ${end}`;
}

export function calculateRoleDuration(role: ExperienceRole): string {
  const start = monthIndex(parseYearMonth(role.startDate));
  const end = monthIndex(getRoleEndParts(role));
  const totalMonths = Math.max(1, end - start + 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} year${years === 1 ? '' : 's'}`);
  }

  if (months > 0) {
    parts.push(`${months} month${months === 1 ? '' : 's'}`);
  }

  return parts.join(' ');
}

export function calculateExperienceTotalDuration(experience: Experience): string | null {
  if (experience.roles.length === 0) {
    return null;
  }

  const starts = experience.roles.map((role) => monthIndex(parseYearMonth(role.startDate)));
  const ends = experience.roles.map((role) => monthIndex(getRoleEndParts(role)));
  const earliestStart = Math.min(...starts);
  const latestEnd = Math.max(...ends);
  const totalMonths = Math.max(1, latestEnd - earliestStart + 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} year${years === 1 ? '' : 's'}`);
  }

  if (months > 0) {
    parts.push(`${months} month${months === 1 ? '' : 's'}`);
  }

  return parts.join(' ');
}
