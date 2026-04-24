import type { Experience, ExperienceRole } from './types';

type MonthParts = {
  year: number;
  month: number;
};

function parseYearMonth(value?: string | null): MonthParts | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})$/.exec(trimmed);

  if (!match) {
    return null;
  }

  const month = Number(match[2]);

  if (month < 1 || month > 12) {
    return null;
  }

  return {
    year: Number(match[1]),
    month,
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
  return parseYearMonth(role.endDate) ?? getCurrentMonthParts();
}

function formatMonthYear(value?: string | null): string | null {
  const parts = parseYearMonth(value);

  if (!parts) {
    return null;
  }

  const { year, month } = parts;
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatExperiencePeriod(role: ExperienceRole): string {
  const start = formatMonthYear(role.startDate);
  const end = role.endDate ? formatMonthYear(role.endDate) : 'Present';

  if (!start && !end) {
    return 'Date unavailable';
  }

  if (!start) {
    return end === 'Present' ? 'Present' : `Until ${end}`;
  }

  if (!end) {
    return `${start} - Date unavailable`;
  }

  return `${start} - ${end}`;
}

export function calculateRoleDuration(role: ExperienceRole): string {
  const startParts = parseYearMonth(role.startDate);

  if (!startParts) {
    return 'Duration unavailable';
  }

  const start = monthIndex(startParts);
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

  const validRoleRanges = experience.roles
    .map((role) => {
      const start = parseYearMonth(role.startDate);

      if (!start) {
        return null;
      }

      return {
        start: monthIndex(start),
        end: monthIndex(getRoleEndParts(role)),
      };
    })
    .filter((range): range is { start: number; end: number } => range !== null);

  if (validRoleRanges.length === 0) {
    return null;
  }

  const starts = validRoleRanges.map((range) => range.start);
  const ends = validRoleRanges.map((range) => range.end);
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
