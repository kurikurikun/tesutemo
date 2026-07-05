import type { ReactNode } from 'react';

// --- Flow-diagram icon kit (hand-drawn line icons, reused across service cards) ---
// Each icon is the inner <g> content, drawn relative to (0,0) = node centre.
export const iconLink = (
  <g transform="rotate(45)">
    <rect x="-11" y="-4" width="9" height="8" rx="4" />
    <rect x="1" y="-4" width="9" height="8" rx="4" />
  </g>
);
export const iconWave = (
  <>
    <line x1="-8" y1="-3" x2="-8" y2="3" />
    <line x1="-4" y1="-6" x2="-4" y2="6" />
    <line x1="0" y1="-8" x2="0" y2="8" />
    <line x1="4" y1="-6" x2="4" y2="6" />
    <line x1="8" y1="-3" x2="8" y2="3" />
  </>
);
export const iconShortlist = <path d="M-6,-9 L6,-9 L6,7 L0,2 L-6,7 Z" />;
export const iconCalendar = (
  <>
    <rect x="-9" y="-7" width="18" height="16" rx="2" />
    <line x1="-9" y1="-2" x2="9" y2="-2" />
    <line x1="-4.5" y1="-10" x2="-4.5" y2="-6" />
    <line x1="4.5" y1="-10" x2="4.5" y2="-6" />
  </>
);
export const iconVideoCall = (
  <>
    <rect x="-10" y="-6" width="13" height="12" rx="2" />
    <path d="M4,-3 L10,-7 L10,5 L4,1 Z" />
  </>
);
export const iconBox = (
  <>
    <rect x="-9" y="-4" width="18" height="13" rx="1" />
    <path d="M-9,-4 L0,3 L9,-4" />
  </>
);
export const iconPhoneTripod = (
  <>
    <rect x="-5" y="-10" width="10" height="17" rx="2" />
    <line x1="-5" y1="7" x2="-10" y2="11" />
    <line x1="5" y1="7" x2="10" y2="11" />
    <path d="M5,-13 a7,7 0 0 1 6,6" />
    <circle cx="11" cy="-7" r="1.4" fill="#FFFFFF" stroke="none" />
  </>
);
export const iconBrowserRecord = (
  <>
    <rect x="-10" y="-8" width="20" height="16" rx="2" />
    <line x1="-10" y1="-3" x2="10" y2="-3" />
    <circle cx="0" cy="3.5" r="3.2" fill="#FFFFFF" stroke="none" />
  </>
);
// Shared "you get a finished video" output icon (navy, 3 of 4 cards)
export const iconOutput = (
  <>
    <rect x="-10" y="-8" width="20" height="16" rx="2" />
    <path d="M-3,-4 L6,0 L-3,4 Z" fill="#1E2A38" stroke="none" />
  </>
);

export type FlowNode = { caption: string; icon: ReactNode };

// 3-step flow diagram: two outline nodes flanking an emphasized orange centre node,
// joined by dashed connectors, with a caption under each.
export default function ServiceFlowDiagram({ nodes }: { nodes: [FlowNode, FlowNode, FlowNode] }) {
  const cx = [36, 230, 424];
  return (
    <svg viewBox="0 0 460 100" width="100%" height={100} className="block" aria-hidden="true">
      <line x1="62" y1="38" x2="204" y2="38" stroke="#D9CFC0" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />
      <line x1="258" y1="38" x2="398" y2="38" stroke="#D9CFC0" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />
      {nodes.map((n, i) => {
        const mid = i === 1;
        return (
          <g key={i}>
            <circle
              cx={cx[i]}
              cy={38}
              r={mid ? 28 : 26}
              fill={mid ? '#e95228' : '#FFFFFF'}
              stroke={mid ? 'none' : '#E4DCCF'}
              strokeWidth={mid ? 0 : 1.5}
            />
            <g
              transform={`translate(${cx[i]},38)`}
              stroke={mid ? '#FFFFFF' : '#1E2A38'}
              strokeWidth="1.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {n.icon}
            </g>
            <text x={cx[i]} y={mid ? 84 : 82} textAnchor="middle" fontSize="12.5" fill="#9A9086">
              {n.caption}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
