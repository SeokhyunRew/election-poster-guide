'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { CSSProperties } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

// Types
interface PosterData {
  layout: string | null;
  imageSrc: string | null;
  candidateName: string;
  slogan: string;
  smallSlogan: string;
  smallSloganColor: string;
  nameColor: string;
  sloganColor: string;
  infoSubLayout?: 'name' | 'slogan';
}

interface LayoutStyle {
  imageStyle: CSSProperties;
  nameStyle: CSSProperties;
  sloganStyle: CSSProperties;
  smallSloganStyle?: CSSProperties;
}

// Constants
const LAYOUTS = {
  FOCUS_PERSON: '인물 집중 유도형',
  FOCUS_NAME: '이름 인지 강화형',
  FOCUS_SLOGAN: '슬로건 집중 유도형 및 전반 탐색 유도형',
  FOCUS_INFO: '정보 효율 전달형',
} as const;

const INITIAL_POSTER_DATA: PosterData = {
  layout: null,
  imageSrc: null,
  candidateName: '',
  slogan: '',
  smallSlogan: '',
  smallSloganColor: '#000000',
  nameColor: '#000000',
  sloganColor: '#000000',
  infoSubLayout: undefined,
};

const getLayoutStyle = (layout: string | null, infoSubLayout?: 'name' | 'slogan'): LayoutStyle => {
  switch (layout) {
    case 'FOCUS_PERSON':
      return {
        imageStyle: {
          position: 'absolute' as const,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          borderRadius: 0,
          objectFit: 'cover',
          maxHeight: '85%',
        },
        nameStyle: {
          position: 'absolute' as const,
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '6.2rem',
          color: '#fff',
          fontWeight: 900,
          width: '95%',
          textAlign: 'center' as const,
          letterSpacing: '-2px',
          lineHeight: 1.05,
          textShadow: '0 2px 8px rgba(0,0,0,0.25)',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '38%',
          left: '5%',
          width: '40%',
          textAlign: 'left' as const,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#9C27B0',
          whiteSpace: 'pre-line',
        },
      };
    case 'FOCUS_NAME':
      return {
        imageStyle: {
          position: 'absolute' as const,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          borderRadius: 0,
          objectFit: 'cover',
          maxHeight: '85%',
        },
        nameStyle: {
          position: 'absolute' as const,
          top: '1.6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '6.2rem',
          color: '#fff',
          fontWeight: 900,
          width: '95%',
          textAlign: 'center' as const,
          letterSpacing: '-2px',
          lineHeight: 1.1,
          textShadow: '0 2px 8px rgba(0,0,0,0.25)',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '38%',
          left: '5%',
          width: '40%',
          textAlign: 'left' as const,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#9C27B0',
          whiteSpace: 'pre-line',
        },
        smallSloganStyle: {
          position: 'absolute' as const,
          top: 0,
          left: 0,
          width: '100%',
          textAlign: 'center' as const,
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#fff',
        },
      };
    case 'FOCUS_SLOGAN':
      return {
        imageStyle: {
          position: 'absolute' as const,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          borderRadius: 0,
          objectFit: 'cover',
          maxHeight: '85%',
        },
        nameStyle: {
          position: 'absolute' as const,
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '6.2rem',
          color: '#fff',
          fontWeight: 900,
          width: '95%',
          textAlign: 'center' as const,
          letterSpacing: '-2px',
          lineHeight: 1.05,
          textShadow: '0 2px 8px rgba(0,0,0,0.25)',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '38%',
          right: '5%',
          width: '40%',
          textAlign: 'right' as const,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#9C27B0',
          whiteSpace: 'pre-line',
        },
        smallSloganStyle: {
          position: 'absolute' as const,
          bottom: '6.5rem',
          left: 0,
          width: '100%',
          textAlign: 'center' as const,
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#fff',
        },
      };
    case 'FOCUS_INFO':
      if (infoSubLayout === 'name') {
        return {
          imageStyle: {
            position: 'absolute' as const,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '100%',
            borderRadius: 0,
            objectFit: 'cover',
            maxHeight: '85%',
          },
          nameStyle: {
            position: 'absolute' as const,
            top: '2.2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '6.2rem',
            color: '#fff',
            fontWeight: 900,
            width: '95%',
            textAlign: 'center' as const,
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textShadow: '0 2px 8px rgba(0,0,0,0.25)',
          },
          sloganStyle: {
            position: 'absolute' as const,
            top: '38%',
            left: '5%',
            width: '40%',
            textAlign: 'left' as const,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#9C27B0',
            whiteSpace: 'pre-line',
          },
          smallSloganStyle: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            textAlign: 'center' as const,
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#fff',
          },
        };
      } else {
        return {
          imageStyle: {
            position: 'absolute' as const,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '100%',
            borderRadius: 0,
            objectFit: 'cover',
            maxHeight: '85%',
          },
          nameStyle: {
            position: 'absolute' as const,
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '6.2rem',
            color: '#fff',
            fontWeight: 900,
            width: '95%',
            textAlign: 'center' as const,
            letterSpacing: '-2px',
            lineHeight: 1.05,
            textShadow: '0 2px 8px rgba(0,0,0,0.25)',
          },
          sloganStyle: {
            position: 'absolute' as const,
            top: '38%',
            left: '5%',
            width: '40%',
            textAlign: 'left' as const,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#9C27B0',
            whiteSpace: 'pre-line',
          },
          smallSloganStyle: {
            position: 'absolute' as const,
            bottom: '6.5rem',
            left: 0,
            width: '100%',
            textAlign: 'center' as const,
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#fff',
          },
        };
      }
    default:
      return {
        imageStyle: {
          position: 'absolute' as const,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%',
          borderRadius: 0,
          objectFit: 'cover',
          maxHeight: '85%',
        },
        nameStyle: {
          position: 'absolute' as const,
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '6.2rem',
          color: '#fff',
          fontWeight: 900,
          width: '95%',
          textAlign: 'center' as const,
          letterSpacing: '-2px',
          lineHeight: 1.05,
          textShadow: '0 2px 8px rgba(0,0,0,0.25)',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '38%',
          left: '5%',
          width: '40%',
          textAlign: 'left' as const,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#9C27B0',
          whiteSpace: 'pre-line',
        },
      };
  }
};

// Components
const LayoutSelector = ({ onSelect }: { onSelect: (layout: string) => void }) => (
  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
    {Object.values(LAYOUTS).map((layout) => (
      <button key={layout} onClick={() => onSelect(layout)}>
        {layout}
      </button>
    ))}
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div style={{ marginTop: '1.5rem', border: '2px solid #00FFC2', borderRadius: 8, padding: '0.75rem', background: 'rgba(0,255,194,0.07)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <h3 style={{ margin: 0, color: '#00FFC2', fontWeight: 600, fontSize: '1rem', minWidth: 90 }}>{label}</h3>
    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer' }} />
  </div>
);

// PosterPreview 컴포넌트 내부에서 사용할 슬로건 4글자 단위 줄바꿈 함수
function splitSloganBy4(str: string) {
  if (!str) return '';
  // 한글, 영문, 숫자 모두 4글자 단위로 줄바꿈
  return str.replace(/(.{4})/g, '$1\n').trim();
}

const PosterPreview = ({ data, posterRef, layoutStyle }: { data: PosterData; posterRef: React.RefObject<HTMLDivElement | null>; layoutStyle: LayoutStyle }) => {
  return (
    <div
      ref={posterRef}
      style={{
        position: 'relative',
        marginTop: '2rem',
        border: '3px solid #000000',
        backgroundColor: '#ffffff',
        width: '420px',
        height: '594px',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {data.imageSrc && (
        <img
          src={data.imageSrc}
          alt="Uploaded"
          style={layoutStyle.imageStyle}
        />
      )}
      {/* 슬로건 (왼쪽/오른쪽) - 4글자마다 줄바꿈 */}
      <div
        style={{
          ...layoutStyle.sloganStyle,
          color: data.sloganColor,
          zIndex: 2,
          pointerEvents: 'none',
          whiteSpace: 'pre-line',
        }}
      >
        {splitSloganBy4(data.slogan.trim() || '모두가 행복한 세상')}
      </div>
      {/* 이름 및 번호 */}
      <h2 style={{ ...layoutStyle.nameStyle, color: data.nameColor, zIndex: 2 }}>
        {data.candidateName.trim() || '1 홍길동'}
      </h2>
      {/* 작은 슬로건 (이름/번호 위에, 겹치지 않게) */}
      {(data.layout === 'FOCUS_NAME' || data.layout === 'FOCUS_SLOGAN' || data.layout === 'FOCUS_INFO') && layoutStyle.smallSloganStyle && (
        <div
          style={{
            ...layoutStyle.smallSloganStyle,
            color: data.smallSloganColor,
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          {data.smallSlogan.trim() || '세상을 바꾸는'}
        </div>
      )}
    </div>
  );
};

// 스타일 공통 변수로 선언
const inputStyle = {
  padding: '0.5rem',
  fontSize: '1rem',
  width: '300px',
  border: '2px solid #00FFC2',
  borderRadius: '4px',
  background: '#000',
  color: '#00FFC2',
  outline: 'none',
};

function GeneratorPage({ initialLayout }: { initialLayout?: string }) {
  const [posterData, setPosterData] = useState<PosterData>({
    ...INITIAL_POSTER_DATA,
    layout: initialLayout || null,
    infoSubLayout: 'name', // 기본값
  });
  const [showLayoutSelector, setShowLayoutSelector] = useState(!initialLayout);
  const posterRef = useRef<HTMLDivElement | null>(null);
  const hiddenPosterRef = useRef<HTMLDivElement | null>(null); // 다운로드용 hidden ref 추가

  // If initialLayout is set, do not show the layout selector
  const handleLayoutSelect = (layout: string) => {
    setPosterData((prev) => ({ ...prev, layout, infoSubLayout: 'name' }));
    setShowLayoutSelector(false);
  };

  // Poster form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPosterData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterData((prev) => ({ ...prev, imageSrc: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleColorChange = (field: keyof PosterData, value: string) => {
    setPosterData((prev) => ({ ...prev, [field]: value }));
  };
  const handleInfoSubLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosterData((prev) => ({ ...prev, infoSubLayout: e.target.value as 'name' | 'slogan' }));
  };

  // Download logic (hiddenPosterRef 사용)
  const handleDownload = async () => {
    if (!hiddenPosterRef.current) return;
    const canvas = await html2canvas(hiddenPosterRef.current);
    const link = document.createElement('a');
    link.download = 'poster.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const layoutStyle = getLayoutStyle(posterData.layout, posterData.infoSubLayout);

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#00FFC2', paddingBottom: '3rem' }}>
      {showLayoutSelector && (
        <LayoutSelector onSelect={handleLayoutSelect} />
      )}
      {posterData.layout && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', width: '100%', maxWidth: 480, margin: '0 auto' }}>
          <div style={{ width: '100%', padding: '0 1rem' }}>
            <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
              선택한 레이아웃: {LAYOUTS[posterData.layout as keyof typeof LAYOUTS] || ''}
            </div>
            {/* FOCUS_INFO일 때 infoSubLayout 선택 UI */}
            {posterData.layout === 'FOCUS_INFO' && (
              <div style={{ marginBottom: '1rem' }}>
                <span>세부 유형 선택: </span>
                <label style={{ marginRight: '1rem' }}>
                  <input
                    type="radio"
                    name="infoSubLayout"
                    value="name"
                    checked={posterData.infoSubLayout === 'name'}
                    onChange={handleInfoSubLayoutChange}
                  />
                  정보 효율 전달 1형
                </label>
                <label>
                  <input
                    type="radio"
                    name="infoSubLayout"
                    value="slogan"
                    checked={posterData.infoSubLayout === 'slogan'}
                    onChange={handleInfoSubLayoutChange}
                  />
                  정보 효율 전달형 2형
                </label>
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              얼굴 사진 업로드:<br />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              후보자 이름 및 번호 입력:<br />
              <input
                type="text"
                name="candidateName"
                value={posterData.candidateName}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="1 홍길동"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              슬로건 입력:<br />
              <textarea
                name="slogan"
                value={posterData.slogan}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="모두가 행복한 세상"
              />
            </div>
            {/* 작은 슬로건 입력 및 색상 선택은 인물 집중형이 아닐 때만 표시 */}
            {posterData.layout !== 'FOCUS_PERSON' && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  작은 슬로건 입력:<br />
                  <input
                    type="text"
                    name="smallSlogan"
                    value={posterData.smallSlogan}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="세상을 바꾸는"
                  />
                </div>
                <ColorPicker label="작은 슬로건 글자색 선택:" value={posterData.smallSloganColor} onChange={(v) => handleColorChange('smallSloganColor', v)} />
              </>
            )}
            <ColorPicker label="이름 글자색 선택:" value={posterData.nameColor} onChange={(v) => handleColorChange('nameColor', v)} />
            <ColorPicker label="슬로건 글자색 선택:" value={posterData.sloganColor} onChange={(v) => handleColorChange('sloganColor', v)} />
          </div>
          {/* 미리보기: 슬로건 글자색 선택 바로 아래, 모바일 비율로 */}
          <div style={{ width: '100vw', maxWidth: 420, margin: '2rem auto 0 auto', display: 'flex', justifyContent: 'center' }}>
            <PosterPreview data={posterData} posterRef={posterRef} layoutStyle={layoutStyle} />
          </div>
          {/* 다운로드용 hidden DOM */}
          <div style={{ position: 'absolute', left: -9999, top: 0 }} aria-hidden="true">
            <PosterPreview data={posterData} posterRef={hiddenPosterRef} layoutStyle={layoutStyle} />
          </div>
          <div style={{ width: '100%', padding: '0 1rem' }}>
            <div style={{ marginTop: '2rem' }}>
              <button onClick={handleDownload} style={{ width: '100%', padding: '0.75rem 2rem', fontSize: '1.1rem', background: '#00FFC2', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                포스터 이미지 다운로드
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GeneratorPageWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const layout = searchParams.get('layout');

  if (!layout) {
    router.replace('/select-layout');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#00FFC2' }}>
      <button onClick={() => router.push('/select-layout')} style={{ marginBottom: '1rem', color: '#00FFC2' }}>← 뒤로가기</button>
      <GeneratorPage initialLayout={layout} />
    </div>
  );
}

function GeneratorPageWrapperWithSuspense() {
  return (
    <Suspense fallback={<div style={{ color: '#00FFC2', background: '#000', minHeight: '100vh' }}>로딩 중...</div>}>
      <GeneratorPageWrapper />
    </Suspense>
  );
}

export default GeneratorPageWrapperWithSuspense;

//test