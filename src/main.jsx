import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bookmark,
  Camera,
  Copy,
  Dice5,
  Gamepad2,
  Library,
  Palette,
  Save,
  Sparkles,
  Sun,
  Trash2,
  Wand2,
} from "lucide-react";
import "./style.css";

const TABS = [
  { id: "background", label: "배경 전용", emoji: "🏞️" },
  { id: "character", label: "캐릭터 전용", emoji: "🧙" },
];

const BACKGROUND_OPTIONS = {
  type: {
    label: "배경 타입",
    icon: "🏘️",
    options: [
      { label: "마을", emoji: "🏘️", value: "a cozy fantasy village square" },
      { label: "상점", emoji: "🧪", value: "a cute fantasy potion shop interior" },
      { label: "던전", emoji: "🕯️", value: "a mysterious magical dungeon entrance" },
      { label: "숲", emoji: "🌲", value: "an enchanted forest path" },
      { label: "하늘섬", emoji: "☁️", value: "a floating island village in the sky" },
      { label: "이벤트맵", emoji: "🎪", value: "a festive limited-time event map" },
    ],
  },
  mood: {
    label: "분위기",
    icon: "✨",
    options: [
      { label: "밝은", emoji: "☀️", value: "cheerful" },
      { label: "포근한", emoji: "🧸", value: "cozy" },
      { label: "신비로운", emoji: "🌙", value: "mysterious" },
      { label: "모험적인", emoji: "🗺️", value: "adventurous" },
      { label: "평화로운", emoji: "🌿", value: "peaceful" },
      { label: "축제 같은", emoji: "🎈", value: "festive" },
    ],
  },
  genre: {
    label: "장르",
    icon: "🎮",
    options: [
      { label: "판타지", emoji: "🧚", value: "fantasy" },
      { label: "캐주얼 RPG", emoji: "🎮", value: "casual RPG" },
      { label: "방치형 RPG", emoji: "💤", value: "idle RPG" },
      { label: "퍼즐 RPG", emoji: "🧩", value: "puzzle RPG" },
      { label: "마을 꾸미기", emoji: "🏡", value: "town-building game" },
      { label: "수집형 RPG", emoji: "💎", value: "collectible RPG" },
    ],
  },
  lighting: {
    label: "조명",
    icon: "🌤️",
    options: [
      { label: "부드러운 햇빛", emoji: "🌤️", value: "soft sunlight" },
      { label: "따뜻한 석양", emoji: "🌅", value: "warm sunset lighting" },
      { label: "은은한 달빛", emoji: "🌙", value: "gentle moonlight" },
      { label: "마법광", emoji: "✨", value: "soft magical glow" },
      { label: "밝은 아침", emoji: "☀️", value: "bright morning light" },
      { label: "시네마틱", emoji: "🎬", value: "cinematic soft lighting" },
    ],
  },
  color: {
    label: "컬러",
    icon: "🎨",
    options: [
      { label: "파스텔", emoji: "🌈", value: "vibrant pastel colors" },
      { label: "따뜻한 색감", emoji: "🍯", value: "warm colorful palette" },
      { label: "블루골드", emoji: "🔵", value: "blue and gold palette" },
      { label: "핑크퍼플", emoji: "💜", value: "pink and purple palette" },
      { label: "싱그러운 그린", emoji: "🌱", value: "fresh green palette" },
      { label: "밝은 판타지", emoji: "🦄", value: "bright fantasy colors" },
    ],
  },
  artStyle: {
    label: "아트스타일",
    icon: "🖌️",
    options: [
      { label: "한국 캐주얼", emoji: "🇰🇷", value: "Korean casual mobile game style" },
      { label: "모바일 RPG", emoji: "🎮", value: "stylized mobile RPG art" },
      { label: "귀여운 판타지", emoji: "🍄", value: "cute fantasy game art" },
      { label: "고퀄 일러스트", emoji: "💫", value: "polished casual game illustration" },
      { label: "애니메풍", emoji: "🌸", value: "anime-inspired stylized art" },
    ],
  },
  artMood: {
    label: "아트풍",
    icon: "💎",
    options: [
      { label: "둥글고 귀여운", emoji: "🍡", value: "rounded cute shapes" },
      { label: "장난감 같은", emoji: "🧸", value: "toy-like materials" },
      { label: "깔끔한 쉐입", emoji: "🔷", value: "clean simple shape language" },
      { label: "풍부한 장식", emoji: "💐", value: "rich decorative details" },
      { label: "작은 화면 최적화", emoji: "📱", value: "optimized for small mobile screens" },
    ],
  },
  camera: {
    label: "카메라 구도",
    icon: "📷",
    options: [
      { label: "아이소메트릭", emoji: "🔷", value: "isometric view" },
      { label: "3/4 뷰", emoji: "📐", value: "three-quarter view" },
      { label: "탑다운", emoji: "⬇️", value: "top-down game view" },
      { label: "와이드 샷", emoji: "🎥", value: "wide cinematic shot" },
      { label: "맵 화면", emoji: "🗺️", value: "game map composition" },
    ],
  },
};

const CHARACTER_OPTIONS = {
  race: {
    label: "종족",
    icon: "🧬",
    options: [
      { label: "인간", emoji: "🙂", value: "human" },
      { label: "엘프", emoji: "🧝", value: "elf" },
      { label: "수인", emoji: "🦊", value: "animal-eared fantasy character" },
      { label: "마족", emoji: "😈", value: "cute demon fantasy character" },
      { label: "정령", emoji: "✨", value: "spirit fantasy character" },
      { label: "요정", emoji: "🧚", value: "fairy fantasy character" },
    ],
  },
  job: {
    label: "직업",
    icon: "⚔️",
    options: [
      { label: "마법사", emoji: "🪄", value: "mage" },
      { label: "전사", emoji: "⚔️", value: "warrior" },
      { label: "힐러", emoji: "💚", value: "healer" },
      { label: "궁수", emoji: "🏹", value: "archer" },
      { label: "상인", emoji: "🧺", value: "merchant NPC" },
      { label: "아이돌", emoji: "🎤", value: "fantasy idol character" },
    ],
  },
  personality: {
    label: "성격",
    icon: "💬",
    options: [
      { label: "밝은", emoji: "☀️", value: "cheerful" },
      { label: "차분한", emoji: "🌿", value: "calm" },
      { label: "장난꾸러기", emoji: "🎈", value: "playful" },
      { label: "당당한", emoji: "👑", value: "confident" },
      { label: "신비로운", emoji: "🌙", value: "mysterious" },
      { label: "귀여운", emoji: "🍓", value: "cute and charming" },
    ],
  },
  costume: {
    label: "의상",
    icon: "👗",
    options: [
      { label: "판타지 로브", emoji: "🧥", value: "fantasy robe" },
      { label: "가벼운 갑옷", emoji: "🛡️", value: "light fantasy armor" },
      { label: "모험가 복장", emoji: "🥾", value: "adventurer outfit" },
      { label: "귀여운 드레스", emoji: "🎀", value: "cute fantasy dress" },
      { label: "상점 NPC룩", emoji: "🧺", value: "cozy shopkeeper outfit" },
      { label: "현대 판타지", emoji: "🧢", value: "modern fantasy outfit" },
    ],
  },
  weapon: {
    label: "무기 / 소품",
    icon: "🪄",
    options: [
      { label: "스태프", emoji: "🪄", value: "glowing magical staff" },
      { label: "검", emoji: "⚔️", value: "fantasy sword" },
      { label: "활", emoji: "🏹", value: "ornate bow" },
      { label: "책", emoji: "📘", value: "magical spellbook" },
      { label: "포션", emoji: "🧪", value: "colorful potion bottles" },
      { label: "마스코트", emoji: "🐾", value: "small cute mascot companion" },
    ],
  },
  pose: {
    label: "포즈",
    icon: "🧍",
    options: [
      { label: "정면 전신", emoji: "🧍", value: "full body front view" },
      { label: "액션 포즈", emoji: "💥", value: "dynamic action pose" },
      { label: "전투 자세", emoji: "⚔️", value: "battle-ready stance" },
      { label: "귀여운 인사", emoji: "👋", value: "cute greeting pose" },
      { label: "아이콘용", emoji: "🔲", value: "clean character icon composition" },
    ],
  },
  color: {
    label: "컬러",
    icon: "🎨",
    options: [
      { label: "파스텔", emoji: "🌈", value: "vibrant pastel colors" },
      { label: "블루화이트", emoji: "💙", value: "blue and white color palette" },
      { label: "핑크퍼플", emoji: "💜", value: "pink and purple color palette" },
      { label: "레드골드", emoji: "❤️", value: "red and gold color palette" },
      { label: "그린아이보리", emoji: "💚", value: "green and ivory color palette" },
    ],
  },
  artStyle: {
    label: "캐릭터풍",
    icon: "🌸",
    options: [
      { label: "한국 캐주얼", emoji: "🇰🇷", value: "Korean casual mobile game character design" },
      { label: "애니메풍", emoji: "🌸", value: "anime-inspired stylized character art" },
      { label: "수집형 RPG", emoji: "💎", value: "collectible RPG character concept art" },
      { label: "귀여운 SD", emoji: "🍡", value: "cute super-deformed proportions" },
      { label: "모바일 RPG", emoji: "🎮", value: "mobile RPG character concept art" },
    ],
  },
};

const DESIGN_DIRECTION_OPTIONS = [
  { label: "모바일 가독성", emoji: "📱", value: "high readability for mobile screens" },
  { label: "실루엣 강조", emoji: "🔳", value: "clean recognizable silhouette" },
  { label: "심플한 쉐입", emoji: "🔷", value: "simple shape language" },
  { label: "장식 디테일", emoji: "💐", value: "rich but controlled decorative details" },
  { label: "게임용 구성", emoji: "🎮", value: "game-ready composition" },
  { label: "부드러운 쉐이딩", emoji: "🫧", value: "soft shading" },
];

const NEGATIVE_OPTIONS = [
  { label: "저퀄 제거", emoji: "🧹", value: "low quality, blurry, rough sketch" },
  { label: "실사 제거", emoji: "🚫", value: "photorealistic, realistic skin texture" },
  { label: "공포풍 제거", emoji: "👻", value: "horror, creepy, dark gritty realism" },
  { label: "복잡함 제거", emoji: "🧩", value: "messy composition, overly complex details" },
  { label: "가독성 문제 제거", emoji: "👁️", value: "unreadable silhouette, unclear focal point" },
  { label: "왜곡 제거", emoji: "🖐️", value: "bad anatomy, distorted hands, extra fingers" },
];

const DEFAULT_SELECTION = {
  background: {
    type: "a cozy fantasy village square",
    mood: "cheerful",
    genre: "casual RPG",
    lighting: "soft sunlight",
    color: "vibrant pastel colors",
    artStyle: "Korean casual mobile game style",
    artMood: "rounded cute shapes",
    camera: "isometric view",
    detail: "cute stylized houses, colorful banners, flower pots, a small fountain, winding stone paths",
  },
  character: {
    race: "animal-eared fantasy character",
    job: "mage",
    personality: "cheerful",
    costume: "fantasy robe",
    weapon: "glowing magical staff",
    pose: "full body front view",
    color: "vibrant pastel colors",
    artStyle: "Korean casual mobile game character design",
    detail: "large expressive eyes, charming smile, soft hair, appealing costume details",
  },
};

function randomOf(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function App() {
  const [activeTab, setActiveTab] = useState("background");
  const [background, setBackground] = useState(DEFAULT_SELECTION.background);
  const [character, setCharacter] = useState(DEFAULT_SELECTION.character);
  const [designDirections, setDesignDirections] = useState([
    "high readability for mobile screens",
    "clean recognizable silhouette",
    "soft shading",
  ]);
  const [negativeItems, setNegativeItems] = useState([
    "low quality, blurry, rough sketch",
    "messy composition, overly complex details",
    "unreadable silhouette, unclear focal point",
  ]);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [copied, setCopied] = useState("");
  const [savedStyles, setSavedStyles] = useState([]);
  const [styleName, setStyleName] = useState("내 스타일 01");

  useEffect(() => {
    const saved = localStorage.getItem("conceptToolV2Styles");
    if (!saved) return;
    try {
      setSavedStyles(JSON.parse(saved));
    } catch {
      setSavedStyles([]);
    }
  }, []);

  const currentSelection = activeTab === "background" ? background : character;

  const saveStyles = (items) => {
    setSavedStyles(items);
    localStorage.setItem("conceptToolV2Styles", JSON.stringify(items));
  };

  const setSelection = (key, value) => {
    if (activeTab === "background") {
      setBackground((prev) => ({ ...prev, [key]: value }));
    } else {
      setCharacter((prev) => ({ ...prev, [key]: value }));
    }
  };

  const toggleListValue = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const randomize = () => {
    if (activeTab === "background") {
      const next = {};
      Object.entries(BACKGROUND_OPTIONS).forEach(([key, group]) => {
        next[key] = randomOf(group.options).value;
      });
      next.detail = background.detail;
      setBackground(next);
    } else {
      const next = {};
      Object.entries(CHARACTER_OPTIONS).forEach(([key, group]) => {
        next[key] = randomOf(group.options).value;
      });
      next.detail = character.detail;
      setCharacter(next);
    }
  };

  const buildPrompt = () => {
    const directions = designDirections.join(", ");
    const negatives = negativeItems.join(", ");

    if (activeTab === "background") {
      const prompt = [
        `A ${background.mood} ${background.genre} background concept art of ${background.type}.`,
        `Scene details: ${background.detail}.`,
        `Lighting: ${background.lighting}.`,
        `Color palette: ${background.color}.`,
        `Art style: ${background.artStyle}, ${background.artMood}.`,
        `Camera and composition: ${background.camera}.`,
        `Design direction: ${directions}.`,
        `Quality keywords: highly polished, clean shapes, soft shading, high readability, mobile game art, game-ready environment design, 4k.`,
        `Negative prompt: ${negatives}.`,
      ].join("\n");
      setFinalPrompt(prompt);
      return;
    }

    const prompt = [
      `A ${character.personality} ${character.race} ${character.job} character concept art.`,
      `Character design: wearing ${character.costume}, holding ${character.weapon}.`,
      `Pose and composition: ${character.pose}.`,
      `Character details: ${character.detail}.`,
      `Color palette: ${character.color}.`,
      `Art style: ${character.artStyle}.`,
      `Design direction: ${directions}.`,
      `Quality keywords: highly polished, clean silhouette, expressive face, appealing costume design, soft shading, mobile game character art, 4k.`,
      `Negative prompt: ${negatives}.`,
    ].join("\n");
    setFinalPrompt(prompt);
  };

  const copyText = async (text, label) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1200);
  };

  const saveCurrentStyle = () => {
    const name = styleName.trim() || `내 스타일 ${savedStyles.length + 1}`;
    const item = {
      id: Date.now().toString(),
      name,
      tab: activeTab,
      background,
      character,
      designDirections,
      negativeItems,
    };
    const next = [item, ...savedStyles];
    saveStyles(next);
    setStyleName(`내 스타일 ${next.length + 1}`);
  };

  const applySavedStyle = (item) => {
    setActiveTab(item.tab || "background");
    setBackground(item.background || DEFAULT_SELECTION.background);
    setCharacter(item.character || DEFAULT_SELECTION.character);
    setDesignDirections(item.designDirections || []);
    setNegativeItems(item.negativeItems || []);
    setFinalPrompt("");
  };

  const deleteSavedStyle = (id) => {
    saveStyles(savedStyles.filter((item) => item.id !== id));
  };

  const groups = activeTab === "background" ? BACKGROUND_OPTIONS : CHARACTER_OPTIONS;
  const detailLabel = activeTab === "background" ? "배경 디테일" : "캐릭터 디테일";
  const detailHelp =
    activeTab === "background"
      ? "건물, 장식, 소품, 길, 식물, 분위기 요소를 영어로 적어보세요."
      : "헤어, 표정, 눈, 의상 포인트, 소품, 매력을 영어로 적어보세요.";

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="badge"><Sparkles size={16} /> Concept Tool v2 · Korean UI · English Prompt</div>
          <h1>게임 컨셉 프롬프트 제작 툴</h1>
          <p>배경과 캐릭터를 분리해서 선택하고, 마지막에 프롬프트 만들기 버튼으로 완성 영문 프롬프트를 생성합니다.</p>
        </div>
        <div className="heroButtons">
          <button className="button secondary" onClick={randomize}><Dice5 size={18} /> 랜덤 선택</button>
          <button className="button primary" onClick={buildPrompt}><Wand2 size={18} /> 프롬프트 만들기</button>
        </div>
      </header>

      <main className="appLayout">
        <section className="builderPanel">
          <div className="topTabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={activeTab === tab.id ? "topTab active" : "topTab"}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFinalPrompt("");
                }}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="sectionTitle">
            <Gamepad2 size={18} />
            {activeTab === "background" ? "배경 옵션" : "캐릭터 옵션"}
          </div>

          <div className="optionSections">
            {Object.entries(groups).map(([key, group]) => (
              <OptionGroup
                key={key}
                label={group.label}
                icon={group.icon}
                value={currentSelection[key]}
                options={group.options}
                onChange={(value) => setSelection(key, value)}
              />
            ))}
          </div>

          <div className="textInputBlock">
            <label>{detailLabel}</label>
            <p>{detailHelp}</p>
            <textarea
              rows={4}
              value={currentSelection.detail}
              onChange={(e) => setSelection("detail", e.target.value)}
            />
          </div>

          <MultiSelectGroup
            label="추가 디자인 방향"
            icon={<Palette size={18} />}
            values={designDirections}
            options={DESIGN_DIRECTION_OPTIONS}
            onToggle={(value) => toggleListValue(designDirections, setDesignDirections, value)}
          />

          <MultiSelectGroup
            label="네거티브 프롬프트"
            icon={<Trash2 size={18} />}
            values={negativeItems}
            options={NEGATIVE_OPTIONS}
            onToggle={(value) => toggleListValue(negativeItems, setNegativeItems, value)}
          />

          <button className="generateButton" onClick={buildPrompt}>
            <Wand2 size={22} />
            프롬프트 만들기
          </button>
        </section>

        <section className="resultPanel">
          <div className="card promptCard">
            <div className="cardHeader">
              <div>
                <h2>완성 프롬프트</h2>
                <p>모든 선택을 마친 뒤 프롬프트 만들기 버튼을 누르면 여기에 영문 프롬프트가 생성됩니다.</p>
              </div>
              <button
                className="button secondary"
                disabled={!finalPrompt}
                onClick={() => copyText(finalPrompt, "prompt")}
              >
                <Copy size={18} /> {copied === "prompt" ? "복사됨" : "복사"}
              </button>
            </div>
            <pre className={!finalPrompt ? "placeholderPrompt" : ""}>
              {finalPrompt || "아직 생성된 프롬프트가 없습니다.\n왼쪽 옵션을 고른 뒤 [프롬프트 만들기]를 눌러주세요."}
            </pre>
          </div>

          <div className="card saveCard">
            <div className="cardHeader">
              <div>
                <h2><Bookmark size={22} /> 내 스타일 저장</h2>
                <p>현재 선택 조합을 저장하고 나중에 다시 불러올 수 있습니다.</p>
              </div>
            </div>

            <div className="saveRow">
              <input value={styleName} onChange={(e) => setStyleName(e.target.value)} placeholder="저장할 스타일 이름" />
              <button className="button primary" onClick={saveCurrentStyle}><Save size={18} /> 저장</button>
            </div>

            <div className="savedList">
              {savedStyles.length === 0 ? (
                <p className="emptyText">아직 저장한 스타일이 없습니다.</p>
              ) : (
                savedStyles.map((item) => (
                  <div className="savedItem" key={item.id}>
                    <button className="savedLoad" onClick={() => applySavedStyle(item)}>
                      <strong>{item.name}</strong>
                      <span>{item.tab === "background" ? "배경 전용" : "캐릭터 전용"} · {item.tab === "background" ? item.background.artStyle : item.character.artStyle}</span>
                    </button>
                    <button className="iconButton" onClick={() => deleteSavedStyle(item.id)} aria-label="삭제">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card guideCard">
            <h2><Library size={22} /> 사용 흐름</h2>
            <ol>
              <li>가장 위에서 배경 전용 또는 캐릭터 전용을 선택합니다.</li>
              <li>각 옵션을 버튼으로 고릅니다.</li>
              <li>디자인 방향과 네거티브 프롬프트를 템플릿으로 선택합니다.</li>
              <li>프롬프트 만들기 버튼을 눌러 완성 프롬프트를 생성합니다.</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}

function OptionGroup({ label, icon, value, options, onChange }) {
  return (
    <div className="optionGroup">
      <div className="optionLabel">
        <span>{icon}</span>
        {label}
      </div>
      <div className="optionGrid">
        {options.map((option) => (
          <button
            key={option.value}
            className={value === option.value ? "option active" : "option"}
            onClick={() => onChange(option.value)}
          >
            <span>{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelectGroup({ label, icon, values, options, onToggle }) {
  return (
    <div className="multiGroup">
      <div className="sectionTitle smallTitle">
        {icon}
        {label}
      </div>
      <div className="optionGrid">
        {options.map((option) => (
          <button
            key={option.value}
            className={values.includes(option.value) ? "option active multi" : "option multi"}
            onClick={() => onToggle(option.value)}
          >
            <span>{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
