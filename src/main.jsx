import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Copy, Sparkles, Dice5, ImagePlus, Wand2, Palette, Camera, Sun, Gamepad2, Upload } from "lucide-react";
import "./style.css";

const PRESETS = {
  background: {
    label: "배경 전용",
    emoji: "🏞️",
    subjectLabel: "무엇을 그릴까요?",
    subjectHelp: "예: 마법 상점, 판타지 마을, 던전 입구",
    subject: "a cozy fantasy village square",
    detail: "cute stylized houses, colorful banners, flower pots, a small fountain, winding stone paths",
    camera: "isometric view",
    extra: "game-ready layout, readable environment design, foreground and background separation",
  },
  character: {
    label: "캐릭터 컨셉",
    emoji: "🧙",
    subjectLabel: "어떤 캐릭터인가요?",
    subjectHelp: "예: 마법사 소녀, 여우 전사, 힐러 NPC",
    subject: "a cheerful young fantasy mage",
    detail: "large expressive eyes, blue and white robe, glowing crystal staff, short silver hair, charming smile",
    camera: "full body character concept, front view, dynamic pose",
    extra: "clean silhouette, iconic shape language, high readability, appealing costume design",
  },
  casualKorea: {
    label: "한국 캐주얼 모바일",
    emoji: "🍰",
    subjectLabel: "컨셉 대상",
    subjectHelp: "예: 귀여운 포션 상점, 이벤트 맵, 수집형 RPG 캐릭터",
    subject: "a cute fantasy potion shop",
    detail: "rounded shapes, soft materials, colorful roof, glowing bottles, tiny magical decorations",
    camera: "three-quarter isometric view",
    extra: "Korean casual mobile game style, vibrant colors, soft shading, polished illustration",
  },
};

const moodOptions = [
  { label: "밝은", emoji: "☀️", value: "cheerful" },
  { label: "포근한", emoji: "🧸", value: "cozy" },
  { label: "마법적인", emoji: "✨", value: "magical" },
  { label: "모험적인", emoji: "🗺️", value: "adventurous" },
  { label: "신비로운", emoji: "🌙", value: "mysterious" },
  { label: "평화로운", emoji: "🌿", value: "peaceful" },
  { label: "장난스러운", emoji: "🎈", value: "playful" },
  { label: "영웅적인", emoji: "⚔️", value: "heroic" },
];

const genreOptions = [
  { label: "판타지", emoji: "🧚", value: "fantasy" },
  { label: "캐주얼 RPG", emoji: "🎮", value: "casual RPG" },
  { label: "방치형 RPG", emoji: "💤", value: "idle RPG" },
  { label: "퍼즐 RPG", emoji: "🧩", value: "puzzle RPG" },
  { label: "어드벤처", emoji: "🧭", value: "adventure" },
  { label: "마을 꾸미기", emoji: "🏘️", value: "town-building" },
  { label: "수집형 RPG", emoji: "💎", value: "collectible RPG" },
];

const lightingOptions = [
  { label: "부드러운 햇빛", emoji: "🌤️", value: "soft sunlight" },
  { label: "따뜻한 석양", emoji: "🌅", value: "warm sunset lighting" },
  { label: "은은한 달빛", emoji: "🌙", value: "gentle moonlight" },
  { label: "밝은 아침", emoji: "☀️", value: "bright morning light" },
  { label: "마법 빛", emoji: "✨", value: "soft magical glow" },
  { label: "시네마틱", emoji: "🎬", value: "cinematic soft lighting" },
];

const paletteOptions = [
  { label: "선명한 파스텔", emoji: "🌈", value: "vibrant pastel colors" },
  { label: "따뜻한 색감", emoji: "🍯", value: "warm colorful palette" },
  { label: "블루 & 골드", emoji: "🔵", value: "blue and gold palette" },
  { label: "싱그러운 그린", emoji: "🌱", value: "fresh green palette" },
  { label: "핑크 & 퍼플", emoji: "💜", value: "pink and purple palette" },
  { label: "밝은 판타지", emoji: "🦄", value: "bright fantasy colors" },
];

const styleOptions = [
  { label: "한국 캐주얼 모바일", emoji: "🇰🇷", value: "Korean casual mobile game style" },
  { label: "스타일라이즈드 RPG", emoji: "🎨", value: "stylized mobile RPG art" },
  { label: "귀여운 판타지", emoji: "🍄", value: "cute fantasy game art" },
  { label: "고퀄 캐주얼 일러스트", emoji: "💫", value: "polished casual game illustration" },
  { label: "애니메풍", emoji: "🌸", value: "anime-inspired stylized art" },
];

const cameraOptions = [
  { label: "아이소메트릭", emoji: "🔷", value: "isometric view" },
  { label: "정면 전신", emoji: "🧍", value: "full body character concept, front view" },
  { label: "3/4 뷰", emoji: "📐", value: "three-quarter view" },
  { label: "탑다운", emoji: "⬇️", value: "top-down game view" },
  { label: "와이드 샷", emoji: "🎥", value: "wide cinematic shot" },
];

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
  const [imagePreview, setImagePreview] = useState("");
  const [imageMemo, setImageMemo] = useState("rounded cute shapes, pastel colors, soft shading, mobile game illustration style");
  const [useImageReference, setUseImageReference] = useState(false);

  const preset = PRESETS[mode];

  const prompt = useMemo(() => {
    return [
      `A ${mood} ${genre} concept image featuring ${subject},`,
      `with ${details}.`,
      `The scene has ${light}, ${palette}, and a ${mood} atmosphere.`,
      `Art style: ${style}.`,
      `Camera and composition: ${camera}.`,
      `Design direction: ${extra}.`,
      useImageReference ? `Image reference notes: ${imageMemo}.` : "",
      `Quality keywords: ${quality.join(", ")}.`,
    ].filter(Boolean).join("\n");
  }, [mood, genre, subject, details, light, palette, style, camera, extra, useImageReference, imageMemo]);

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
    setMood(randomOf(moodOptions).value);
    setGenre(randomOf(genreOptions).value);
    setLight(randomOf(lightingOptions).value);
    setPalette(randomOf(paletteOptions).value);
    setStyle(randomOf(styleOptions).value);
    setCamera(randomOf(cameraOptions).value);
  };

  const copyText = async (text, label) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1200);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setUseImageReference(true);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="badge"><Sparkles size={16} /> Korean UI · English Prompt</div>
          <h1>게임 컨셉 이미지 프롬프트 에디터</h1>
          <p>화면은 한국어로 쉽게 고르고, 완성 프롬프트는 이미지 생성에 적합한 영어로 만들어집니다.</p>
        </div>
        <div className="heroButtons">
          <button className="button secondary" onClick={randomize}><Dice5 size={18} /> 랜덤 조합</button>
          <button className="button primary" onClick={() => copyText(`${prompt}\n\nNegative prompt:\n${negative}`, "all")}><Copy size={18} /> 전체 복사</button>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <OptionGroup label="프리셋" icon={<Gamepad2 size={16} />} value={mode} options={Object.entries(PRESETS).map(([key, item]) => ({ label: item.label, emoji: item.emoji, value: key }))} onChange={applyPreset} columns="three" />
          <OptionGroup label="분위기" icon={<Sparkles size={16} />} value={mood} options={moodOptions} onChange={setMood} />
          <OptionGroup label="장르" icon={<Gamepad2 size={16} />} value={genre} options={genreOptions} onChange={setGenre} />

          <div className="uploadBox">
            <div className="optionLabel"><Upload size={16} /> 이미지 참고</div>
            <p className="help">참고 이미지를 올리고, 특징을 메모하면 완성 프롬프트에 영어로 반영됩니다.</p>
            <label className="uploadButton">
              <ImagePlus size={18} />
              이미지 업로드
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            {imagePreview && (
              <div className="previewWrap">
                <img src={imagePreview} alt="uploaded reference" />
              </div>
            )}
            <label className="checkLine">
              <input
                type="checkbox"
                checked={useImageReference}
                onChange={(e) => setUseImageReference(e.target.checked)}
              />
              이 이미지 메모를 프롬프트에 반영
            </label>
            <Area
              label="이미지 특징 메모"
              help="AI가 이미지를 자동 분석하는 단계는 아니지만, 그림을 보고 느낀 특징을 적으면 영문 프롬프트에 합쳐집니다."
              value={imageMemo}
              setValue={setImageMemo}
            />
          </div>


          <Field label={preset.subjectLabel} help={preset.subjectHelp} value={subject} setValue={setSubject} placeholder="영어로 적으면 결과가 더 안정적이에요" />
          <Area label="디테일" help="의상, 소품, 건물, 장식, 재질, 감정 등을 자유롭게 적어보세요." value={details} setValue={setDetails} />

          <OptionGroup label="조명" icon={<Sun size={16} />} value={light} options={lightingOptions} onChange={setLight} />
          <OptionGroup label="컬러 팔레트" icon={<Palette size={16} />} value={palette} options={paletteOptions} onChange={setPalette} />
          <OptionGroup label="아트 스타일" icon={<Wand2 size={16} />} value={style} options={styleOptions} onChange={setStyle} />
          <OptionGroup label="카메라 / 구도" icon={<Camera size={16} />} value={camera} options={cameraOptions} onChange={setCamera} />

          <Area label="추가 디자인 방향" help="작은 화면에서 잘 보이게, 실루엣을 단순하게 같은 방향성을 넣으면 좋아요." value={extra} setValue={setExtra} />
          <Area label="네거티브 프롬프트" help="원하지 않는 느낌을 영어로 적어두는 영역입니다." value={negative} setValue={setNegative} />
        </section>

        <section className="resultArea">
          <div className="card">
            <div className="cardHeader">
              <div>
                <h2>완성 프롬프트</h2>
                <p>아래 결과는 영어로 생성됩니다. 복사해서 ChatGPT에 붙여넣고 “이걸로 이미지 만들어줘”라고 말하면 됩니다.</p>
              </div>
              <button className="button secondary" onClick={() => copyText(prompt, "prompt")}>
                <Copy size={18} /> {copied === "prompt" ? "복사됨" : "복사"}
              </button>
            </div>
            <pre>{prompt}</pre>
          </div>

          <div className="twoCards">
            <div className="card small">
              <h2><Wand2 size={20} /> 네거티브 프롬프트</h2>
              <p className="negative">{negative}</p>
            </div>
            <div className="card small">
              <h2><ImagePlus size={20} /> 사용 방법</h2>
              <ol>
                <li>왼쪽에서 한국어 버튼을 눌러 방향을 정합니다.</li>
                <li>참고 이미지가 있으면 업로드하고 특징을 메모합니다.</li>
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

function OptionGroup({ label, icon, value, options, onChange, columns = "two" }) {
  return (
    <div className="optionGroup">
      <div className="optionLabel">{icon}{label}</div>
      <div className={`optionGrid ${columns}`}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? "option active" : "option"}
          >
            <span>{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, help, value, setValue, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      {help && <p className="help">{help}</p>}
      <input value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

function Area({ label, help, value, setValue }) {
  return (
    <div className="field">
      <label>{label}</label>
      {help && <p className="help">{help}</p>}
      <textarea rows="3" value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
