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
  bgColor: string;
  nameColor: string;
  sloganColor: string;
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
  bgColor: '#ffffff',
  nameColor: '#000000',
  sloganColor: '#000000',
};

const getLayoutStyle = (layout: string | null): LayoutStyle => {
  switch (layout) {
    case LAYOUTS.FOCUS_PERSON: // 인물 집중 유도형
      return {
        imageStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '60%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: 'auto',
          borderRadius: '8px',
        },
        nameStyle: {
          position: 'absolute' as const,
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2.5rem',
          color: '#000000',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '25%',
          transform: 'translateX(-50%)',
          fontSize: '1.8rem',
          color: '#000000',
          textAlign: 'center',
          padding: '0 20px',
          width: '180px',
        },
      };
    case LAYOUTS.FOCUS_NAME: // 이름 인지 강화형
      return {
        imageStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '60%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: 'auto',
          borderRadius: '8px',
        },
        nameStyle: {
          position: 'absolute' as const,
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2.5rem',
          color: '#000000',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '25%',
          transform: 'translateX(-50%)',
          fontSize: '1.8rem',
          color: '#000000',
          textAlign: 'center',
          padding: '0 20px',
          width: '180px',
        },
        smallSloganStyle: {
          position: 'absolute' as const,
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.2rem',
          color: '#000000',
          textAlign: 'center',
        },
      };
    case LAYOUTS.FOCUS_SLOGAN: // 슬로건 집중 유도형 및 전반 탐색 유도형
      return {
        imageStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '40%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: 'auto',
          borderRadius: '8px',
        },
        nameStyle: {
          position: 'absolute' as const,
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2.5rem',
          color: '#000000',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '75%',
          transform: 'translateX(-50%)',
          fontSize: '1.8rem',
          color: '#000000',
          textAlign: 'center',
          padding: '0 20px',
          width: '180px',
        },
        smallSloganStyle: {
          position: 'absolute' as const,
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.2rem',
          color: '#000000',
          textAlign: 'center',
        },
      };
    case LAYOUTS.FOCUS_INFO: // 정보 효율 전달형
      return {
        imageStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '60%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: 'auto',
          borderRadius: '8px',
        },
        nameStyle: {
          position: 'absolute' as const,
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2.5rem',
          color: '#000000',
        },
        sloganStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '25%',
          transform: 'translateX(-50%)',
          fontSize: '1.8rem',
          color: '#000000',
          textAlign: 'center',
          padding: '0 20px',
          width: '180px',
        },
        smallSloganStyle: {
          position: 'absolute' as const,
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.2rem',
          color: '#000000',
          textAlign: 'center',
        },
      };
    default:
      return {
        imageStyle: {
          position: 'absolute' as const,
          top: '150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: 'auto',
          borderRadius: '8px',
        },
        nameStyle: {
          position: 'absolute' as const,
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2.5rem',
          color: '#000000',
        },
        sloganStyle: {
          position: 'absolute' as const,
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.5rem',
          color: '#000000',
          textAlign: 'center',
          padding: '0 20px',
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

const PosterPreview = ({ data, posterRef }: { data: PosterData; posterRef: React.RefObject<HTMLDivElement | null> }) => {
  const layoutStyle = getLayoutStyle(data.layout);
  
  return (
    <div
      ref={posterRef}
      style={{
        marginTop: '2rem',
        border: '3px solid #000000',
        backgroundColor: '#ffffff',
        width: '420px',
        height: '594px',
        position: 'relative',
        color: '#000000',
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

      <h2 style={layoutStyle.nameStyle}>
        {data.candidateName || '후보자 이름'}
      </h2>

      <p style={layoutStyle.sloganStyle}>
        {data.slogan || '여기에 슬로건 입력'}
      </p>

      {(data.layout === LAYOUTS.FOCUS_NAME || 
        data.layout === LAYOUTS.FOCUS_SLOGAN || 
        data.layout === LAYOUTS.FOCUS_INFO) && 
        layoutStyle.smallSloganStyle && (
        <p style={layoutStyle.smallSloganStyle}>
          {data.slogan || '작은 슬로건'}
        </p>
      )}
    </div>
  );
};

export default function GeneratorPage() {
  const [posterData, setPosterData] = useState<PosterData>(INITIAL_POSTER_DATA);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleSelectLayout = useCallback((layout: string) => {
    setPosterData(prev => ({ ...prev, layout }));
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
  
      <h2>1️⃣ 강조하고 싶은 점을 선택하세요:</h2>
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
  
          <h3 style={{ marginTop: '1.5rem' }}>2️⃣ 얼굴 사진 업로드:</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />
  
          {posterData.imageSrc && (
            <div style={{ marginTop: '1rem' }}>
              <img src={posterData.imageSrc} alt="Uploaded" style={{ maxWidth: '300px', height: 'auto' }} />
            </div>
          )}
  
          <h3 style={{ marginTop: '1.5rem' }}>3️⃣ 후보자 이름 입력:</h3>
          <input
            type="text"
            value={posterData.candidateName}
            onChange={(e) => updatePosterData('candidateName', e.target.value)}
            placeholder="예) 홍길동"
            style={{ padding: '0.5rem', fontSize: '1rem', width: '300px' }}
          />
  
          <h3 style={{ marginTop: '1.5rem' }}>4️⃣ 슬로건 입력:</h3>
          <input
            type="text"
            value={posterData.slogan}
            onChange={(e) => updatePosterData('slogan', e.target.value)}
            placeholder="예) 모두가 행복한 세상"
            style={{ padding: '0.5rem', fontSize: '1rem', width: '300px' }}
          />
  
          <ColorPicker
            label="5️⃣ 배경색 선택:"
            value={posterData.bgColor}
            onChange={(value) => updatePosterData('bgColor', value)}
          />
  
          <ColorPicker
            label="6️⃣ 이름 글자색 선택:"
            value={posterData.nameColor}
            onChange={(value) => updatePosterData('nameColor', value)}
          />
  
          <ColorPicker
            label="7️⃣ 슬로건 글자색 선택:"
            value={posterData.sloganColor}
            onChange={(value) => updatePosterData('sloganColor', value)}
          />
  
          <PosterPreview data={posterData} posterRef={posterRef} />
  
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
