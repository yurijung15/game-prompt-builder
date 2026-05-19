import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Beaker,
  Bookmark,
  Copy,
  Dice5,
  Layers3,
  Save,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import "./style.css";

const TABS = [
  { id: "background", label: "배경 연구", emoji: "🏞️" },
  { id: "character", label: "캐릭터 연구", emoji: "🧙" },
];

const SUBJECTS = {
  background: [
    { label: "마을", value: "a cozy fantasy village square" },
    { label: "상점", value: "a cute fantasy potion shop interior" },
    { label: "던전", value: "a mysterious magical dungeon entrance" },
    { label: "숲", value: "an enchanted forest path" },
    { label: "하늘섬", value: "a floating island village in the sky" },
    { label: "이벤트맵", value: "a festive limited-time event map" },
  ],
  character: [
    { label: "마법사", value: "a cheerful young fantasy mage" },
    { label: "전사", value: "a heroic fantasy warrior" },
    { label: "힐러", value: "a gentle fantasy healer" },
    { label: "수인", value: "a cute animal-eared fantasy character" },
    { label: "상인 NPC", value: "a cozy fantasy merchant NPC" },
    { label: "정령", value: "a magical spirit character" },
  ],
};

const LAYERS = {
  world: {
    label: "세계관",
    help: "결과 차이를 크게 만드는 1순위 레이어",
    options: [
      { label: "클래식 판타지", value: "classic fantasy world" },
      { label: "동양 판타지", value: "eastern fantasy world" },
      { label: "스팀펑크", value: "steampunk fantasy world" },
      { label: "사이버 판타지", value: "cyber fantasy world" },
      { label: "동화풍", value: "dreamy fairytale world" },
      { label: "고대 유적", value: "ancient ruins fantasy world" },
    ],
  },
  render: {
    label: "렌더링",
    help: "붓질, 재질, 쉐이딩을 바꾸는 레이어",
    options: [
      { label: "한국 캐주얼", value: "Korean casual mobile game art" },
      { label: "애니 셀쉐이딩", value: "anime cel-shaded illustration" },
      { label: "페인터리", value: "painterly hand-painted illustration" },
      { label: "스타일 3D", value: "stylized 3D game art" },
      { label: "수채화", value: "watercolor fantasy illustration" },
      { label: "플랫 그래픽", value: "flat graphic stylized illustration" },
    ],
  },
  color: {
    label: "색감",
    help: "이미지 인상을 크게 바꾸는 색 언어",
    options: [
      { label: "파스텔", value: "soft pastel color language" },
      { label: "고채도", value: "high saturation color language" },
      { label: "저채도", value: "muted low-saturation color language" },
      { label: "웜톤", value: "warm earthy color language" },
      { label: "네온", value: "neon fantasy color language" },
      { label: "모노톤 포인트", value: "mostly monochrome with one accent color" },
    ],
  },
  density: {
    label: "밀도",
    help: "심플함과 복잡함을 조절",
    options: [
      { label: "심플", value: "minimal visual density" },
      { label: "중간", value: "readable medium visual density" },
      { label: "장식적", value: "decorative visual density" },
      { label: "풍부한 디테일", value: "rich detailed visual density" },
      { label: "복잡한 환경", value: "dense environment visual density" },
    ],
  },
  light: {
    label: "조명",
    help: "분위기와 대비를 바꾸는 레이어",
    options: [
      { label: "확산광", value: "soft diffuse lighting" },
      { label: "시네마틱", value: "hard cinematic lighting" },
      { label: "마법광", value: "magical bloom lighting" },
      { label: "달빛 대비", value: "moonlit high contrast lighting" },
      { label: "안개", value: "foggy atmospheric lighting" },
      { label: "골든아워", value: "golden hour lighting" },
    ],
  },
  composition: {
    label: "구도",
    help: "같은 소재라도 다른 그림처럼 보이게 하는 레이어",
    options: [
      { label: "아이소메트릭", value: "isometric composition" },
      { label: "와이드샷", value: "wide cinematic composition" },
      { label: "로우앵글", value: "low angle dramatic composition" },
      { label: "탑다운", value: "top-down game view composition" },
      { label: "클로즈업", value: "close-up hero composition" },
    ],
  },
};

const VARIATION_PRESETS = [
  {
    id: "A",
    label: "A 안정형",
    hidden: "soft painterly texture, gentle edge softness, calm visual rhythm",
    note: "가장 안정적인 모바일 게임 스타일",
  },
  {
    id: "B",
    label: "B 쉐입형",
    hidden: "chunky stylized rendering, bold shape language, simplified readable masses",
    note: "실루엣과 덩어리감 차이를 크게 보기",
  },
  {
    id: "C",
    label: "C 그래픽형",
    hidden: "flat simplified shading, clean graphic shapes, crisp silhouette separation",
    note: "플랫하고 그래픽적인 차이 보기",
  },
  {
    id: "D",
    label: "D 페인터리형",
    hidden: "hand-painted materials, visible brush texture, organic fantasy details",
    note: "붓터치와 재질감 차이 보기",
  },
];

const NEGATIVES = [
  "low quality, blurry, rough sketch",
  "messy composition, overly complex details",
  "unreadable silhouette, unclear focal point",
  "photorealistic, realistic skin texture",
  "horror, creepy, dark gritty realism",
];

const DEFAULT_LAYERS = {
  world: "classic fantasy world",
  render: "Korean casual mobile game art",
  color: "soft pastel color language",
  density: "readable medium visual density",
  light: "soft diffuse lighting",
  composition: "isometric composition",
};

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function App() {
  const [tab, setTab] = useState("background");
  const [subject, setSubject] = useState("a cozy fantasy village square");
  const [detail, setDetail] = useState("small fountain, colorful banners, flower pots, cozy fantasy architecture");
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [styleStrength, setStyleStrength] = useState(55);
  const [hypothesis, setHypothesis] = useState("렌더링 스타일과 색감 언어를 바꾸면 결과 이미지가 얼마나 달라지는지 확인한다.");
  const [generated, setGenerated] = useState([]);
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("artDirectionExperiments");
    if (!saved) return;
    try {
      setExperiments(JSON.parse(saved));
    } catch {
      setExperiments([]);
    }
  }, []);

  useEffect(() => {
    setSubject(SUBJECTS[tab][0].value);
    setDetail(
      tab === "background"
        ? "small fountain, colorful banners, flower pots, cozy fantasy architecture"
        : "large expressive eyes, charming smile, soft hair, appealing costume details"
    );
    setGenerated([]);
  }, [tab]);

  const strengthLine = useMemo(() => {
    if (styleStrength >= 75) return "strong cohesive visual identity, keep the selected style dominant";
    if (styleStrength >= 40) return "balanced style diversity, allow visible differences while keeping the result usable";
    return "loose exploratory interpretation, allow bold variation and unexpected visual direction";
  }, [styleStrength]);

  const buildSinglePrompt = (variation) => {
    const base =
      tab === "background"
        ? `A ${layers.world} background concept art of ${subject}.`
        : `A ${layers.world} character concept art of ${subject}.`;

    const detailLine = tab === "background" ? `Scene details: ${detail}.` : `Character details: ${detail}.`;

    const quality =
      tab === "background"
        ? "game-ready environment design, strong focal point, readable layout, polished concept art, 4k"
        : "appealing silhouette, expressive face, readable character design, polished concept art, 4k";

    return [
      base,
      detailLine,
      "",
      `Rendering style: ${layers.render}.`,
      `Color language: ${layers.color}.`,
      `Visual density: ${layers.density}.`,
      `Lighting style: ${layers.light}.`,
      `Composition: ${layers.composition}.`,
      "",
      `Research variation layer: ${variation.hidden}.`,
      `Style strength: ${strengthLine}.`,
      "",
      `Quality keywords: ${quality}.`,
      `Negative prompt: ${NEGATIVES.join(", ")}.`,
    ].join("\n");
  };

  const generateExperiment = () => {
    const prompts = VARIATION_PRESETS.map((variation) => ({
      ...variation,
      prompt: buildSinglePrompt(variation),
      resultNote: "",
    }));
    setGenerated(prompts);
  };

  const randomizeLayers = () => {
    const next = {};
    Object.entries(LAYERS).forEach(([key, group]) => {
      next[key] = randomFrom(group.options).value;
    });
    setLayers(next);
    setGenerated([]);
  };

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const saveExperiment = () => {
    if (generated.length === 0) return;
    const item = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("ko-KR"),
      tab,
      subject,
      detail,
      layers,
      styleStrength,
      hypothesis,
      generated,
    };
    const next = [item, ...experiments];
    setExperiments(next);
    localStorage.setItem("artDirectionExperiments", JSON.stringify(next));
  };

  const deleteExperiment = (id) => {
    const next = experiments.filter((item) => item.id !== id);
    setExperiments(next);
    localStorage.setItem("artDirectionExperiments", JSON.stringify(next));
  };

  const updateResultNote = (id, value) => {
    setGenerated((prev) => prev.map((item) => (item.id === id ? { ...item, resultNote: value } : item)));
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="badge"><Beaker size={16} /> AI Art Direction Lab</div>
          <h1>AI 아트 디렉션 연구 에디터</h1>
          <p>프롬프트를 하나만 만드는 도구가 아니라, Variation A/B/C/D를 비교하면서 결과 차이를 연구하는 에디터입니다.</p>
        </div>
        <div className="heroButtons">
          <button className="button secondary" onClick={randomizeLayers}><Dice5 size={18} /> 레이어 랜덤</button>
          <button className="button primary" onClick={generateExperiment}><Wand2 size={18} /> 실험 프롬프트 생성</button>
        </div>
      </header>

      <main className="layout">
        <section className="builder">
          <div className="tabs">
            {TABS.map((item) => (
              <button key={item.id} className={tab === item.id ? "tab active" : "tab"} onClick={() => setTab(item.id)}>
                <span>{item.emoji}</span>{item.label}
              </button>
            ))}
          </div>

          <Section title="1. 실험 대상" icon={<Sparkles size={18} />}>
            <div className="optionGrid three">
              {SUBJECTS[tab].map((item) => (
                <button key={item.value} className={subject === item.value ? "option active" : "option"} onClick={() => setSubject(item.value)}>
                  {item.label}
                </button>
              ))}
            </div>
            <label className="fieldLabel">직접 수정</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} />
            <label className="fieldLabel">디테일</label>
            <textarea rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} />
          </Section>

          <Section title="2. 스타일 레이어" icon={<Layers3 size={18} />}>
            {Object.entries(LAYERS).map(([key, group]) => (
              <div className="layerGroup" key={key}>
                <div className="layerHead">
                  <strong>{group.label}</strong>
                  <span>{group.help}</span>
                </div>
                <div className="optionGrid">
                  {group.options.map((item) => (
                    <button
                      key={item.value}
                      className={layers[key] === item.value ? "option active" : "option"}
                      onClick={() => {
                        setLayers({ ...layers, [key]: item.value });
                        setGenerated([]);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Section>

          <Section title={`3. 스타일 강도 ${styleStrength}%`} icon={<Wand2 size={18} />}>
            <input className="range" type="range" min="0" max="100" value={styleStrength} onChange={(e) => setStyleStrength(Number(e.target.value))} />
            <p className="hint">낮음: 다양성 탐색 / 중간: 균형 / 높음: 스타일 안정화</p>
          </Section>

          <Section title="4. 연구 가설" icon={<Beaker size={18} />}>
            <textarea rows={3} value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} />
          </Section>

          <button className="generate" onClick={generateExperiment}>
            <Wand2 size={22} />
            실험 프롬프트 생성
          </button>
        </section>

        <section className="result">
          <div className="card">
            <div className="cardHeader">
              <div>
                <h2>Variation 비교 프롬프트</h2>
                <p>각 Variation을 따로 복사해서 이미지 생성 후 결과 메모를 남겨보세요.</p>
              </div>
              <button className="button primary" disabled={generated.length === 0} onClick={saveExperiment}>
                <Save size={18} /> 실험 저장
              </button>
            </div>

            {generated.length === 0 ? (
              <div className="emptyPrompt">왼쪽에서 레이어를 고른 뒤 [실험 프롬프트 생성]을 눌러주세요.</div>
            ) : (
              <div className="variationList">
                {generated.map((item) => (
                  <div className="variationCard" key={item.id}>
                    <div className="variationHeader">
                      <div>
                        <strong>{item.label}</strong>
                        <span>{item.note}</span>
                      </div>
                      <button className="button secondary" onClick={() => copy(item.prompt)}><Copy size={16} /> 복사</button>
                    </div>
                    <pre>{item.prompt}</pre>
                    <label className="fieldLabel">결과 메모</label>
                    <textarea
                      rows={2}
                      placeholder="예: B가 가장 실루엣이 좋았지만 색감은 C가 더 좋음"
                      value={item.resultNote}
                      onChange={(e) => updateResultNote(item.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="cardHeader">
              <div>
                <h2><Bookmark size={22} /> 저장된 실험</h2>
                <p>좋았던 실험 조합을 다시 확인할 수 있습니다.</p>
              </div>
            </div>

            <div className="savedList">
              {experiments.length === 0 ? (
                <p className="empty">아직 저장된 실험이 없습니다.</p>
              ) : (
                experiments.map((item) => (
                  <div className="savedItem" key={item.id}>
                    <button
                      className="savedLoad"
                      onClick={() => {
                        setTab(item.tab);
                        setSubject(item.subject);
                        setDetail(item.detail);
                        setLayers(item.layers);
                        setStyleStrength(item.styleStrength);
                        setHypothesis(item.hypothesis);
                        setGenerated(item.generated);
                      }}
                    >
                      <strong>{item.date} · {item.tab === "background" ? "배경" : "캐릭터"} 실험</strong>
                      <span>{item.layers.world} / {item.layers.render} / {item.layers.color}</span>
                    </button>
                    <button className="deleteBtn" onClick={() => deleteExperiment(item.id)}><Trash2 size={18} /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="section">
      <div className="sectionTitle">{icon}{title}</div>
      {children}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
