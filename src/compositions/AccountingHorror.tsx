import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// NBG palette
const COLORS = {
  darkTeal: '#003841',
  teal: '#007B85',
  cyan: '#00ADBF',
  offWhite: '#F5F8F6',
  white: '#FFFFFF',
  darkText: '#202020',
  mediumGray: '#5A5F5A',
  alertRed: '#AA0028',
  deepRed: '#660018',
} as const;

const FONT = "'Aptos', 'Inter', 'Helvetica Neue', Arial, sans-serif";

const FPS = 30;

// Scene timing in seconds → frames
const T = (s: number) => Math.round(s * FPS);

const fadeIn = (frame: number, dur = 15) =>
  interpolate(frame, [0, dur], [0, 1], { extrapolateRight: 'clamp' });

const _fadeInOut = (frame: number, totalDur: number, inDur = 15, outDur = 15) =>
  interpolate(frame, [0, inDur, totalDur - outDur, totalDur], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// ---------- Scene 1: Cover (0-5s) ----------
const SceneCover: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 30);
  const subtitleOpacity = interpolate(frame, [25, 55], [0, 1], { extrapolateRight: 'clamp' });
  const dateOpacity = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <div style={{ position: 'absolute', top: 220, left: 100, opacity: titleOpacity }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 120,
            color: COLORS.darkTeal,
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Accounting
          <br />
          Reconciliation
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 510,
          left: 100,
          opacity: subtitleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 54,
            color: COLORS.teal,
            fontWeight: 400,
            letterSpacing: -0.5,
          }}
        >
          A silent €36 million story
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 640,
          left: 100,
          opacity: dateOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 28,
            color: COLORS.mediumGray,
          }}
        >
          Cards & Digital Business · 21 May 2026
        </div>
      </div>
      <Img
        src={staticFile('nbg-logo.png')}
        style={{
          position: 'absolute',
          left: 100,
          bottom: 100,
          width: 380,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Scene 2: The setup (5-15s) ----------
const SceneSetup: React.FC = () => {
  const frame = useCurrentFrame();

  // Three lines fade in sequentially
  const line1 = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: 'clamp' });
  const line2 = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: 'clamp' });
  const line3 = interpolate(frame, [140, 175], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '80%', textAlign: 'center', fontFamily: FONT }}>
        <div
          style={{
            fontSize: 64,
            color: COLORS.darkTeal,
            opacity: line1,
            marginBottom: 50,
            fontWeight: 300,
          }}
        >
          139 incidents
        </div>
        <div
          style={{
            fontSize: 64,
            color: COLORS.darkTeal,
            opacity: line2,
            marginBottom: 50,
            fontWeight: 300,
          }}
        >
          7 months
        </div>
        <div
          style={{
            fontSize: 64,
            color: COLORS.darkTeal,
            opacity: line3,
            fontWeight: 300,
          }}
        >
          62% still open
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 3: The Red Flag — Priority Broken (15-25s) ----------
const ScenePriorityBroken: React.FC = () => {
  const frame = useCurrentFrame();
  const headline = interpolate(frame, [5, 35], [0, 1], { extrapolateRight: 'clamp' });
  const punchline = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp' });
  // Pulsing effect on punchline
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '85%', textAlign: 'center', fontFamily: FONT }}>
        <div
          style={{
            fontSize: 52,
            color: COLORS.darkText,
            opacity: headline,
            marginBottom: 60,
            fontWeight: 300,
            lineHeight: 1.3,
          }}
        >
          Every single ticket is marked
        </div>
        <div
          style={{
            fontSize: 140,
            color: COLORS.alertRed,
            opacity: punchline,
            fontWeight: 700,
            letterSpacing: -3,
            transform: `scale(${frame > 80 ? pulse : 1})`,
            textShadow: frame > 110 ? '0 0 30px rgba(170,0,40,0.3)' : 'none',
          }}
        >
          LOW or MEDIUM
        </div>
        <div
          style={{
            fontSize: 32,
            color: COLORS.mediumGray,
            opacity: interpolate(frame, [180, 220], [0, 1], { extrapolateRight: 'clamp' }),
            marginTop: 80,
            fontStyle: 'italic',
          }}
        >
          No High. No Critical. Not even one.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 4: The Number — €36M Count-Up (25-42s) ----------
const SceneTheNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A (0-2s): "One ticket..."
  // Phase B (2-12s): Count-up from 0 to 36,063,306
  // Phase C (12-17s): Hold + tagline appears

  const introOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const introOut = interpolate(frame, [40, 60], [1, 0.3], { extrapolateRight: 'clamp' });

  // Count-up using easeOut
  const countStart = 60;
  const countEnd = 360;
  const countProgress = interpolate(frame, [countStart, countEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Ease-out cubic
  const eased = 1 - Math.pow(1 - countProgress, 3);
  const target = 36063306;
  const current = Math.round(target * eased);
  const formatted = current.toLocaleString('el-GR');

  // Number appears at frame countStart
  const numberOpacity = interpolate(frame, [countStart - 10, countStart + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scale up at climax (when it reaches the target)
  const scaleBoost = spring({
    frame: frame - countEnd,
    fps,
    config: { damping: 8, stiffness: 80 },
  });
  const scale = 1 + scaleBoost * 0.08;

  // Tagline after climax
  const taglineOpacity = interpolate(frame, [countEnd + 20, countEnd + 60], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '90%', textAlign: 'center', fontFamily: FONT }}>
        <div
          style={{
            fontSize: 44,
            color: COLORS.darkTeal,
            opacity: introOpacity * introOut,
            marginBottom: 80,
            fontWeight: 300,
            letterSpacing: 1,
          }}
        >
          One ticket carries
        </div>
        <div
          style={{
            fontSize: 220,
            color: COLORS.alertRed,
            opacity: numberOpacity,
            fontWeight: 700,
            letterSpacing: -6,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            lineHeight: 1.0,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          €{formatted}
        </div>
        <div
          style={{
            fontSize: 36,
            color: COLORS.mediumGray,
            opacity: taglineOpacity,
            marginTop: 60,
            fontWeight: 300,
          }}
        >
          Account 5996051401 · SAP/FPSL · open credit balance
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 5: The Drumbeat (42-58s) ----------
const SceneDrumbeat: React.FC = () => {
  const frame = useCurrentFrame();

  // Five facts appear in rapid succession, each red-highlighted
  const facts = [
    { label: 'Submitted', value: '21 January 2026', delay: 0 },
    { label: 'Days open', value: '120', delay: 50 },
    { label: 'Priority', value: 'Medium', delay: 100 },
    { label: 'Pattern tagged', value: 'None', delay: 150 },
    { label: 'Last comment', value: '«περιμένουν απάντηση»', delay: 200 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        padding: '120px 100px',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          fontSize: 38,
          color: COLORS.mediumGray,
          marginBottom: 80,
          opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Status of that €36M ticket today:
      </div>
      {facts.map((f, i) => {
        const o = interpolate(frame, [f.delay + 20, f.delay + 45], [0, 1], {
          extrapolateRight: 'clamp',
        });
        const slide = interpolate(frame, [f.delay + 20, f.delay + 45], [-40, 0], {
          extrapolateRight: 'clamp',
        });
        const isAlert =
          f.value === 'None' || f.value === 'Medium' || f.value.includes('περιμένουν');
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: 38,
              opacity: o,
              transform: `translateX(${slide}px)`,
            }}
          >
            <div
              style={{
                fontSize: 36,
                color: COLORS.darkTeal,
                fontWeight: 300,
                width: 380,
              }}
            >
              {f.label}
            </div>
            <div
              style={{
                fontSize: 54,
                color: isAlert ? COLORS.alertRed : COLORS.darkTeal,
                fontWeight: 700,
                letterSpacing: -1,
              }}
            >
              {f.value}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Scene 6: The Key Person Risk (58-68s) ----------
const SceneKeyPerson: React.FC = () => {
  const frame = useCurrentFrame();
  const headline = interpolate(frame, [5, 35], [0, 1], { extrapolateRight: 'clamp' });
  const numberOp = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({
    frame: frame - 50,
    fps: FPS,
    config: { damping: 12, stiffness: 100 },
  });
  const punchline = interpolate(frame, [150, 180], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT,
      }}
    >
      <div style={{ width: '85%', textAlign: 'center' }}>
        <div
          style={{
            fontSize: 44,
            color: COLORS.darkTeal,
            opacity: headline,
            marginBottom: 80,
            fontWeight: 300,
          }}
        >
          One person carries
        </div>
        <div
          style={{
            fontSize: 280,
            color: COLORS.alertRed,
            opacity: numberOp,
            fontWeight: 700,
            letterSpacing: -8,
            transform: `scale(${0.5 + scale * 0.5})`,
            lineHeight: 1.0,
          }}
        >
          59%
        </div>
        <div
          style={{
            fontSize: 40,
            color: COLORS.darkTeal,
            opacity: numberOp,
            marginTop: 30,
            fontWeight: 300,
          }}
        >
          of all accounting reconciliation tickets
        </div>
        <div
          style={{
            fontSize: 34,
            color: COLORS.mediumGray,
            opacity: punchline,
            marginTop: 70,
            fontStyle: 'italic',
          }}
        >
          If she takes a holiday, the books stop reconciling
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 7: The Verdict (68-76s) ----------
const SceneVerdict: React.FC = () => {
  const frame = useCurrentFrame();
  const q = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: 'clamp' });
  const a = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp' });
  const aScale = spring({
    frame: frame - 80,
    fps: FPS,
    config: { damping: 10, stiffness: 90 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.darkTeal,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT,
      }}
    >
      <div style={{ width: '85%', textAlign: 'center' }}>
        <div
          style={{
            fontSize: 96,
            color: COLORS.offWhite,
            opacity: q,
            fontWeight: 300,
            marginBottom: 80,
          }}
        >
          Should you be scared?
        </div>
        <div
          style={{
            fontSize: 320,
            color: COLORS.white,
            opacity: a,
            fontWeight: 700,
            letterSpacing: -10,
            transform: `scale(${0.6 + aScale * 0.4})`,
            lineHeight: 1.0,
            textShadow: '0 0 60px rgba(170,0,40,0.7), 0 0 120px rgba(170,0,40,0.4)',
          }}
        >
          Yes.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 8: NBG outro (76-78s) ----------
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const logoOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Img
        src={staticFile('nbg-logo.png')}
        style={{
          width: 500,
          opacity: logoOp,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// Main composition
// ============================================================
export const AccountingHorror: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <Audio src={staticFile('jaws_tension.mp3')} />

      <Sequence from={0} durationInFrames={T(5)}>
        <SceneCover />
      </Sequence>

      <Sequence from={T(5)} durationInFrames={T(10)}>
        <SceneSetup />
      </Sequence>

      <Sequence from={T(15)} durationInFrames={T(10)}>
        <ScenePriorityBroken />
      </Sequence>

      <Sequence from={T(25)} durationInFrames={T(17)}>
        <SceneTheNumber />
      </Sequence>

      <Sequence from={T(42)} durationInFrames={T(16)}>
        <SceneDrumbeat />
      </Sequence>

      <Sequence from={T(58)} durationInFrames={T(10)}>
        <SceneKeyPerson />
      </Sequence>

      <Sequence from={T(68)} durationInFrames={T(8)}>
        <SceneVerdict />
      </Sequence>

      <Sequence from={T(76)} durationInFrames={T(2)}>
        <SceneOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
