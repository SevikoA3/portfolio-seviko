type OrnamentVariant = 'page' | 'section' | 'hero';
type OrnamentTone = 'primary' | 'secondary';
type OrnamentPattern = 'orbit' | 'constellation' | 'signal' | 'halo' | 'drift';

interface OrnamentLayerProps {
  variant?: OrnamentVariant;
  tone?: OrnamentTone;
  pattern?: OrnamentPattern;
}

const toneMap = {
  primary: {
    glow: 'bg-primary/13',
    glowSoft: 'bg-primary/8',
    ring: 'border-primary/18',
    fill: 'bg-primary/9',
    dot: 'bg-primary/75',
    line: 'via-primary/85',
  },
  secondary: {
    glow: 'bg-secondary/11',
    glowSoft: 'bg-secondary/7',
    ring: 'border-secondary/18',
    fill: 'bg-secondary/8',
    dot: 'bg-secondary/72',
    line: 'via-secondary/75',
  },
} as const;

const sizeMap = {
  hero: {
    glow: 'h-72 w-72 md:h-[28rem] md:w-[28rem]',
    glowSoft: 'h-56 w-56 md:h-80 md:w-80',
    ring: 'h-28 w-28 md:h-40 md:w-40',
    ringLarge: 'h-40 w-40 md:h-56 md:w-56',
    fill: 'h-24 w-24 md:h-36 md:w-36',
    dot: 'h-2.5 w-2.5 md:h-3 md:w-3',
    dotSmall: 'h-2 w-2',
    line: 'w-32 md:w-52',
    lineLong: 'w-52 md:w-80',
  },
  section: {
    glow: 'h-48 w-48 md:h-64 md:w-64',
    glowSoft: 'h-36 w-36 md:h-52 md:w-52',
    ring: 'h-20 w-20 md:h-28 md:w-28',
    ringLarge: 'h-32 w-32 md:h-40 md:w-40',
    fill: 'h-16 w-16 md:h-24 md:w-24',
    dot: 'h-2 w-2 md:h-2.5 md:w-2.5',
    dotSmall: 'h-1.5 w-1.5',
    line: 'w-24 md:w-36',
    lineLong: 'w-40 md:w-56',
  },
  page: {
    glow: 'h-64 w-64 md:h-96 md:w-96',
    glowSoft: 'h-48 w-48 md:h-72 md:w-72',
    ring: 'h-24 w-24 md:h-32 md:w-32',
    ringLarge: 'h-36 w-36 md:h-48 md:w-48',
    fill: 'h-18 w-18 md:h-28 md:w-28',
    dot: 'h-2.5 w-2.5 md:h-3 md:w-3',
    dotSmall: 'h-1.5 w-1.5 md:h-2 md:w-2',
    line: 'w-28 md:w-44',
    lineLong: 'w-52 md:w-72',
  },
} as const;

type OrnamentColors = (typeof toneMap)[keyof typeof toneMap];
type OrnamentSize = (typeof sizeMap)[keyof typeof sizeMap];

function OrbitPattern({ colors, size }: { colors: OrnamentColors; size: OrnamentSize }) {
  return (
    <>
      <div className={`absolute -right-32 top-6 ${size.glow} rounded-full ${colors.glow} blur-3xl`} />
      <div className={`absolute right-[12%] top-24 ${size.ringLarge} rounded-full border ${colors.ring}`} />
      <div className={`absolute right-[22%] top-16 ${size.dot} rounded-full ${colors.dot} shadow-[0_0_18px_rgba(193,155,255,0.45)]`} />
      <div className={`absolute right-[8%] bottom-20 ${size.lineLong} h-px bg-linear-to-r from-transparent ${colors.line} to-transparent opacity-55`} />
      <div className={`absolute left-[12%] bottom-28 ${size.glowSoft} rounded-full ${colors.glowSoft} blur-3xl`} />
    </>
  );
}

function ConstellationPattern({ colors, size }: { colors: OrnamentColors; size: OrnamentSize }) {
  return (
    <>
      <div className={`absolute left-[4%] top-10 ${size.glow} rounded-full ${colors.glowSoft} blur-3xl`} />
      <div className={`absolute left-[12%] top-24 ${size.ring} rounded-full border ${colors.ring}`} />
      <div className={`absolute left-[28%] top-16 ${size.dot} rounded-full ${colors.dot} shadow-[0_0_14px_rgba(156,239,255,0.38)]`} />
      <div className={`absolute left-[18%] top-20 ${size.lineLong} h-px rotate-18 bg-linear-to-r from-transparent ${colors.line} to-transparent opacity-40`} />
      <div className={`absolute right-[14%] bottom-16 ${size.ringLarge} rounded-full border ${colors.ring}`} />
      <div className={`absolute right-[20%] bottom-28 ${size.dotSmall} rounded-full ${colors.dot}`} />
      <div className={`absolute right-[26%] bottom-24 ${size.dot} rounded-full ${colors.dot}`} />
    </>
  );
}

function SignalPattern({ colors, size }: { colors: OrnamentColors; size: OrnamentSize }) {
  return (
    <>
      <div className={`absolute -left-20 top-[16%] ${size.glow} rounded-full ${colors.glow} blur-3xl`} />
      <div className={`absolute left-[8%] top-[28%] ${size.lineLong} h-px bg-linear-to-r from-transparent ${colors.line} to-transparent opacity-60`} />
      <div className={`absolute left-[12%] top-[28%] ${size.dotSmall} rounded-full ${colors.dot}`} />
      <div className={`absolute left-[16%] top-[28%] ${size.dotSmall} rounded-full ${colors.dot}`} />
      <div className={`absolute left-[20%] top-[28%] ${size.dotSmall} rounded-full ${colors.dot}`} />
      <div className={`absolute right-[10%] top-[18%] ${size.fill} rounded-full border ${colors.ring} ${colors.fill} backdrop-blur-[2px]`} />
      <div className={`absolute right-[14%] bottom-[18%] ${size.ringLarge} rounded-full border ${colors.ring}`} />
    </>
  );
}

function HaloPattern({ colors, size }: { colors: OrnamentColors; size: OrnamentSize }) {
  return (
    <>
      <div className={`absolute right-[6%] top-[8%] ${size.glow} rounded-full ${colors.glow} blur-3xl`} />
      <div className={`absolute right-[12%] top-[14%] ${size.ring} rounded-full border ${colors.ring}`} />
      <div className={`absolute left-[14%] top-[24%] ${size.dot} rounded-full ${colors.dot} shadow-[0_0_18px_rgba(193,155,255,0.45)]`} />
      <div className={`absolute left-[16%] top-[18%] ${size.dotSmall} rounded-full ${colors.dot}`} />
      <div className={`absolute left-[18%] top-[22%] ${size.dotSmall} rounded-full ${colors.dot}`} />
      <div className={`absolute left-[20%] top-[20%] ${size.dotSmall} rounded-full ${colors.dot}`} />
      <div className={`absolute right-[18%] bottom-[14%] ${size.line} h-px bg-linear-to-r from-transparent ${colors.line} to-transparent opacity-55`} />
    </>
  );
}

function DriftPattern({ colors, size }: { colors: OrnamentColors; size: OrnamentSize }) {
  return (
    <>
      <div className={`absolute left-[8%] bottom-[10%] ${size.glowSoft} rounded-full ${colors.glowSoft} blur-3xl`} />
      <div className={`absolute left-[18%] bottom-[18%] ${size.fill} rounded-full border ${colors.ring} ${colors.fill} backdrop-blur-[2px]`} />
      <div className={`absolute right-[8%] top-[16%] ${size.glow} rounded-full ${colors.glow} blur-3xl`} />
      <div className={`absolute right-[18%] top-[12%] ${size.ring} rounded-full border ${colors.ring}`} />
      <div className={`absolute left-[44%] top-[12%] ${size.dot} rounded-full ${colors.dot} shadow-[0_0_18px_rgba(193,155,255,0.45)]`} />
      <div className={`absolute left-[48%] top-[16%] ${size.line} h-px bg-linear-to-r from-transparent ${colors.line} to-transparent opacity-45`} />
    </>
  );
}

export default function OrnamentLayer({
  variant = 'section',
  tone = 'primary',
  pattern = 'orbit',
}: OrnamentLayerProps) {
  const colors = toneMap[tone];
  const size = sizeMap[variant];
  const sharedProps = { colors, size };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden opacity-90"
    >
      {pattern === 'orbit' && <OrbitPattern {...sharedProps} />}
      {pattern === 'constellation' && <ConstellationPattern {...sharedProps} />}
      {pattern === 'signal' && <SignalPattern {...sharedProps} />}
      {pattern === 'halo' && <HaloPattern {...sharedProps} />}
      {pattern === 'drift' && <DriftPattern {...sharedProps} />}
    </div>
  );
}
