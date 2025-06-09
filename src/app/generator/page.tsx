'use client';

import { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { CSSProperties } from 'react';

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
    case LAYOUTS.FOCUS_PERSON: // 인물 집중형
      return {
        imageStyle: {
          position: 'absolute' as const,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '100%', // 아래 70%만 채움
          borderRadius: 0,
          objectFit: 'cover',
          maxHeight: '85%',
        },
        nameStyle: {
          position: 'absolute' as const,
          bottom: 0,
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
          top: '38%', // 얼굴 높이쯤
          left: '5%', // 왼쪽에 붙임
          width: '40%',
          textAlign: 'left' as const,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#9C27B0',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          whiteSpace: 'pre-line',
        },
      };
    case LAYOUTS.FOCUS_NAME:
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
          top: '1.6rem', // 간격을 줄임
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
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          whiteSpace: 'pre-line',
        },
        smallSloganStyle: {
          position: 'absolute' as const,
          top: 0,
          left: 0,
          width: '100%',
          textAlign: 'center' as const,
          fontSize: '1.3rem', // 글자 크기도 살짝 줄임
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
        },
      };
    case LAYOUTS.FOCUS_SLOGAN:
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
          bottom: 0,
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
          right: '5%', // 오른쪽에 붙임
          width: '40%',
          textAlign: 'right' as const,
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#9C27B0',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          whiteSpace: 'pre-line',
        },
        smallSloganStyle: {
          position: 'absolute' as const,
          bottom: '6.5rem', // 이름(6.2rem)+여백, 이름/번호 위
          left: 0,
          width: '100%',
          textAlign: 'center' as const,
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
        },
      };
    case LAYOUTS.FOCUS_INFO:
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
            top: '2.2rem', // 작은 슬로건 높이만큼 아래로
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
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
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
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
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
            bottom: 0,
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
            right: '5%',
            width: '40%',
            textAlign: 'right' as const,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#9C27B0',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
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
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
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
          bottom: 0,
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
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
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
  <div style={{ marginTop: '1.5rem' }}>
    <h3>{label}</h3>
    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
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
        backgroundColor: '#ffffff', // 항상 흰색
        width: '420px',
        height: '594px',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
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
      {(data.layout === LAYOUTS.FOCUS_NAME || data.layout === LAYOUTS.FOCUS_SLOGAN || data.layout === LAYOUTS.FOCUS_INFO) && layoutStyle.smallSloganStyle && (
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

export default function GeneratorPage() {
  const [posterData, setPosterData] = useState<PosterData>(INITIAL_POSTER_DATA);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleSelectLayout = useCallback((layout: string) => {
    setPosterData(prev => ({ 
      ...prev, 
      layout,
      infoSubLayout: layout === LAYOUTS.FOCUS_INFO ? 'name' : undefined 
    }));
  }, []);

  const handleSelectInfoSubLayout = useCallback((subLayout: 'name' | 'slogan') => {
    setPosterData(prev => ({ ...prev, infoSubLayout: subLayout }));
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPosterData(prev => ({ ...prev, imageSrc: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (posterRef.current) {
      html2canvas(posterRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'election_poster.png';
        link.click();
      });
    }
  }, []);

  const updatePosterData = useCallback((key: keyof PosterData, value: string) => {
    setPosterData(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#000000', // 서비스 전체 배경 검정
        color: '#00FFC2', // 서비스 전체 글씨 민트
        minHeight: '100vh', // 화면 꽉 차게
      }}
    >
      <h1>🎨 Election Poster Generator</h1>

      <h2>강조하고 싶은 점을 선택하세요:</h2>
      <LayoutSelector onSelect={handleSelectLayout} />
  
      {posterData.layout && (
        <div
          style={{
            border: '1px solid #00FFC2', // 테두리 민트 (서비스 느낌 통일)
            padding: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <h2>선택한 레이아웃: {posterData.layout}</h2>
  
          {posterData.layout === LAYOUTS.FOCUS_INFO && (
            <div style={{ marginTop: '1rem' }}>
              <h3>정보 효율 전달형 서브 레이아웃 선택:</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleSelectInfoSubLayout('name')}
                  style={{ 
                    backgroundColor: posterData.infoSubLayout === 'name' ? '#4CAF50' : '#ccc',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  이름 인지 강화형
                </button>
                <button 
                  onClick={() => handleSelectInfoSubLayout('slogan')}
                  style={{ 
                    backgroundColor: posterData.infoSubLayout === 'slogan' ? '#4CAF50' : '#ccc',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  슬로건 집중 유도형
                </button>
              </div>
      </div>
          )}

          <h3 style={{ marginTop: '1.5rem' }}>얼굴 사진 업로드:</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={inputStyle}
          />

          {posterData.imageSrc && (
            <div style={{ marginTop: '1rem' }}>
              <img src={posterData.imageSrc} alt="Uploaded" style={{ maxWidth: '300px', height: 'auto' }} />
            </div>
          )}

          <h3 style={{ marginTop: '1.5rem' }}>후보자 이름 및 번호 입력:</h3>
          <input
            type="text"
            value={posterData.candidateName}
            onChange={(e) => updatePosterData('candidateName', e.target.value)}
            placeholder="1 홍길동"
            style={inputStyle}
          />

          <h3 style={{ marginTop: '1.5rem' }}>슬로건 입력:</h3>
          <input
            type="text"
            value={posterData.slogan}
            onChange={(e) => updatePosterData('slogan', e.target.value)}
            placeholder="모두가 행복한 세상"
            style={inputStyle}
          />

          {/* 작은 슬로건 입력 (특정 레이아웃에서만 표시) */}
          {(posterData.layout === LAYOUTS.FOCUS_NAME || 
            posterData.layout === LAYOUTS.FOCUS_SLOGAN || 
            posterData.layout === LAYOUTS.FOCUS_INFO) && (
            <>
              <h3 style={{ marginTop: '1.5rem' }}>작은 슬로건 입력:</h3>
              <input
                type="text"
                value={posterData.smallSlogan}
                onChange={(e) => updatePosterData('smallSlogan', e.target.value)}
                placeholder="세상을 바꾸는"
                style={inputStyle}
              />
              <ColorPicker
                label="작은 슬로건 글자색 선택:"
                value={posterData.smallSloganColor}
                onChange={(value) => updatePosterData('smallSloganColor', value)}
              />
            </>
          )}
  
          <ColorPicker
            label="이름 글자색 선택:"
            value={posterData.nameColor}
            onChange={(value) => updatePosterData('nameColor', value)}
          />
  
          <ColorPicker
            label="슬로건 글자색 선택:"
            value={posterData.sloganColor}
            onChange={(value) => updatePosterData('sloganColor', value)}
          />
  
          <PosterPreview 
            data={posterData} 
            posterRef={posterRef} 
            layoutStyle={getLayoutStyle(posterData.layout, posterData.infoSubLayout)} 
          />
  
          <button
            onClick={handleDownload}
            style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
              cursor: 'pointer',
            }}
            >
            📥 포스터 다운로드
            </button>
        </div>
      )}
    </div>
  );
}
