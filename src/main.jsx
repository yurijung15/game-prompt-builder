import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Copy, Sparkles, Dice5, ImagePlus } from "lucide-react";
import "./style.css";

const PRESETS = {
  background: {
    label: "배경 전용",
    subjectLabel: "핵심 장소 / 오브젝트",
    subject: "a cozy fantasy village square",
    detail: "cute stylized houses, colorful banners, flower pots, a small fountain, winding stone paths",
    camera: "isometric view",
    extra: "game-ready layout, readable environment design, foreground and background separation",
  },
  character: {
    label: "캐릭터 컨셉",
    subjectLabel: "캐릭터 역할 / 직업",
    subject: "a cheerful young fantasy mage",
    detail: "large expressive eyes, blue and white robe, glowing crystal staff, short silver hair, charming smile",
    camera: "full body character concept, front view, dynamic pose",
    extra: "clean silhouette, iconic shape language, high readability, appealing costume design",
  },
  casualKorea: {
    label: "한국 캐주얼 모바일",
    subjectLabel: "컨셉 대상",
    subject: "a cute fantasy potion shop",
    detail: "rounded shapes, soft materials, colorful roof, glowing bottles, tiny magical decorations",
    camera: "three-quarter isometric view",
    extra: "Korean casual mobile game style, vibrant colors, soft shading, polished illustration",
  },
};

const moods = ["cheerful", "cozy", "magical", "adventurous", "mysterious", "peaceful", "playful", "heroic"];
const genres = ["fantasy", "casual RPG", "idle RPG", "puzzle RPG", "adventure", "town-building", "collectible RPG"];
const lighting = ["soft sunlight", "warm sunset lighting", "gentle moonlight", "bright morning light", "soft magical glow", "cinematic soft lighting"];
const palettes = ["vibrant pastel colors", "warm colorful palette", "blue and gold palette", "fresh green palette", "pink and purple palette", "bright fantasy colors"];
const styles = ["Korean casual mobile game style", "stylized mobile RPG art", "cute fantasy game art", "polished casual game illustration", "anime-inspired stylized art"];
const quality = ["highly polished", "high readability", "clean shapes", "soft shading", "simple but rich details", "game concept art", "mobile game art", "4k"];

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function App() {
  const [mode, setMode] = useState("background");
  const [mood, setMood] = useState("cheerful");
  const [genre, setGenre] = useState("fantasy");
  const [subject, setSubject] = useState(PRESETS.background.subject);
  const [details, setDetails] = useState(PRESETS.background.detail);
  const [light, setLight] = useState("warm sunset lighting");
  const [palette, setPalette] = useState("vibrant pastel colors");
  const [style, setStyle] = useState("Korean casual mobile game style");
  const [camera, setCamera] = useState(PRESETS.background.camera);
  const [extra, setExtra] = useState(PRESETS.background.extra);
  const [negative, setNegative] = useState("realistic horror, dark gritty realism, noisy details, unreadable silhouette, messy composition, low quality, blurry");
  const [copied, setCopied] = useState("");

  const prompt = useMemo(() => {
    return [
      `A ${mood} ${genre} concept image featuring ${subject},`,
      `with ${details}.`,
      `The scene has ${light}, ${palette}, and a ${mood} atmosphere.`,
      `Art style: ${style}.`,
      `Camera and composition: ${camera}.`,
      `Design direction: ${extra}.`,
      `Quality keywords: ${quality.join(", ")}.`,
    ].join("\n");
  }, [mood, genre, subject, details, light, palette, style, camera, extra]);

  const applyPreset = (nextMode) => {
    const p = PRESETS[nextMode];
    setMode(nextMode);
    setSubject(p.subject);
    setDetails(p.detail);
    setCamera(p.camera);
    setExtra(p.extra);
    if (nextMode === "casualKorea") {
      setMood("cheerful");
      setGenre("casual RPG");
      setStyle("Korean casual mobile game style");
      setPalette("vibrant pastel colors");
      setLight("soft sunlight");
    }
  };

  const randomize = () => {
    setMood(randomOf(moods));
    setGenre(randomOf(genres));
    setLight(randomOf(lighting));
    setPalette(randomOf(palettes));
    setStyle(randomOf(styles));
  };

  const copyText = async (text, label) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1200);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="badge"><Sparkles size={16} /> Game Concept Prompt Builder</div>
          <h1>게임 컨셉 이미지 프롬프트 에디터</h1>
          <p>배경, 캐릭터, 한국 캐주얼 모바일 게임 스타일 프롬프트를 버튼식으로 조합하고 복사하는 도구입니다.</p>
        </div>
        <div className="heroButtons">
          <button className="button secondary" onClick={randomize}><Dice5 size={18} /> 랜덤 조합</button>
          <button className="button primary" onClick={() => copyText(`${prompt}\n\nNegative prompt:\n${negative}`, "all")}><Copy size={18} /> 전체 복사</button>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <label>프리셋</label>
          <div className="presetGrid">
            {Object.entries(PRESETS).map(([key, value]) => (
              <button key={key} onClick={() => applyPreset(key)} className={mode === key ? "preset active" : "preset"}>
                {value.label}
              </button>
            ))}
          </div>

          <Select label="분위기" value={mood} setValue={setMood} options={moods} />
          <Select label="장르" value={genre} setValue={setGenre} options={genres} />
          <Field label={PRESETS[mode].subjectLabel} value={subject} setValue={setSubject} />
          <Area label="디테일" value={details} setValue={setDetails} />
          <Select label="조명" value={light} setValue={setLight} options={lighting} />
          <Select label="컬러 팔레트" value={palette} setValue={setPalette} options={palettes} />
          <Select label="아트 스타일" value={style} setValue={setStyle} options={styles} />
          <Field label="카메라 / 구도" value={camera} setValue={setCamera} />
          <Area label="추가 디자인 방향" value={extra} setValue={setExtra} />
          <Area label="네거티브 프롬프트" value={negative} setValue={setNegative} />
        </section>

        <section className="resultArea">
          <div className="card">
            <div className="cardHeader">
              <div>
                <h2>완성 프롬프트</h2>
                <p>복사해서 ChatGPT에 붙여넣고 “이걸로 이미지 만들어줘”라고 말하면 됩니다.</p>
              </div>
              <button className="button secondary" onClick={() => copyText(prompt, "prompt")}>
                <Copy size={18} /> {copied === "prompt" ? "복사됨" : "복사"}
              </button>
            </div>
            <pre>{prompt}</pre>
          </div>

          <div className="twoCards">
            <div className="card small">
              <h2>네거티브 프롬프트</h2>
              <p className="negative">{negative}</p>
            </div>
            <div className="card small">
              <h2><ImagePlus size={20} /> 사용법</h2>
              <ol>
                <li>왼쪽에서 옵션을 고릅니다.</li>
                <li>완성 프롬프트를 복사합니다.</li>
                <li>ChatGPT에 붙여넣고 이미지 생성을 요청합니다.</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, value, setValue }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

function Area({ label, value, setValue }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea rows="3" value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

function Select({ label, value, setValue, options }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
