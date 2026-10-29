import React from "react";
import {
  registerRoot,
  Composition,
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
export function Film({ id, cues = [] }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.start && t < c.end);
  return (
    <AbsoluteFill style={{ background: "#f2eddf" }}>
      <style>{`@font-face{font-family:Jakarta;src:url('${staticFile("generated/" + id + "/assets/sans.woff2")}')}`}</style>
      <OffthreadVideo src={staticFile("generated/" + id + "/base.mp4")} />
      <Audio
        src={staticFile("generated/" + id + "/voice-master.wav")}
        startFrom={0}
      />
      {cue && (
        <div
          style={{
            position: "absolute",
            bottom: 235,
            left: 100,
            right: 100,
            textAlign: "center",
            fontFamily: "Jakarta",
            fontWeight: 500,
            fontSize: 43,
            lineHeight: 1.4,
            color: "#fff",
            textWrap: "balance",
          }}
        >
          <span
            style={{
              backgroundColor: "#243e26",
              padding: "12px 23px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              borderRadius: 5,
            }}
          >
            {cue.text}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
}
registerRoot(() => (
  <Composition
    id="KombuReel"
    component={Film}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={600}
    defaultProps={{ id: "primeiro-reel", cues: [] }}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.ceil((props.duration || 20) * 30),
    })}
  />
));
