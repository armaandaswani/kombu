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
            bottom: 290,
            left: 100,
            right: 100,
            textAlign: "center",
            fontFamily: "Jakarta",
            fontWeight: 500,
            fontSize: 40,
            lineHeight: 1.22,
            color: "#fff",
            textWrap: "balance",
            textShadow: "0 2px 4px rgba(0,0,0,.8), 0 0 10px rgba(0,0,0,.22)",
            WebkitTextStroke: ".35px rgba(0,0,0,.25)",
          }}
        >
          <span>{cue.text}</span>
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
    defaultProps={{ id: null, cues: [] }}
    calculateMetadata={async ({ props }) => {
      const input = props.id
        ? props
        : await (await fetch(staticFile("generated/latest.json"))).json();
      return {
        props: input,
        durationInFrames: Math.ceil((input.duration || 20) * 30),
      };
    }}
  />
));
