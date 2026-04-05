import { Country } from '@/types';

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'South Asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'East Asia & Pacific' },
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'East Asia & Pacific' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'Latin America' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Sub-Saharan Africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Sub-Saharan Africa' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'East Asia & Pacific' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'East Asia & Pacific' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Latin America' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'East Asia & Pacific' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'Middle East & North Africa' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East & North Africa' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'Latin America' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'South Asia' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'South Asia' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Middle East & North Africa' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'East Asia & Pacific' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // India
