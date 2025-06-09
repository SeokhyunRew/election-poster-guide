'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import { useRef } from 'react';


export default function GeneratorPage() {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [candidateName, setCandidateName] = useState<string>('');
  const [slogan, setSlogan] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('#ffffff'); // 배경색 기본 흰색
  const [nameColor, setNameColor] = useState<string>('#000000'); // 이름 글자색
  const [sloganColor, setSloganColor] = useState<string>('#000000'); // 슬로건 글자색
  const posterRef = useRef<HTMLDivElement>(null); //포스터 영역 감싸줄 ref


  const handleSelectLayout = (layout: string) => {
    setSelectedLayout(layout);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (posterRef.current) {
      html2canvas(posterRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'election_poster.png';
        link.click();
      });
    }
  };


  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎨 Election Poster Generator</h1>

      {/* 강조 포인트 선택 */}
      <h2>1️⃣ 강조하고 싶은 점을 선택하세요:</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => handleSelectLayout('얼굴 강조형')}>얼굴 강조형</button>
        <button onClick={() => handleSelectLayout('이름 강조형')}>이름 강조형</button>
        <button onClick={() => handleSelectLayout('슬로건 강조형')}>슬로건 강조형</button>
        <button onClick={() => handleSelectLayout('정보 전달형')}>정보 전달형</button>
        <button onClick={() => handleSelectLayout('전반 탐색형')}>전반 탐색형</button>
      </div>

      {selectedLayout && (
        <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
          <h2>선택한 레이아웃: {selectedLayout}</h2>

          {/* 이미지 업로드 */}
          <h3 style={{ marginTop: '1.5rem' }}>2️⃣ 얼굴 사진 업로드:</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {imageSrc && (
            <div style={{ marginTop: '1rem' }}>
              <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '300px', height: 'auto' }} />
            </div>
          )}

          {/* 이름 입력 */}
          <h3 style={{ marginTop: '1.5rem' }}>3️⃣ 후보자 이름 입력:</h3>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="예) 홍길동"
            style={{ padding: '0.5rem', fontSize: '1rem', width: '300px' }}
          />

          {/* 슬로건 입력 */}
          <h3 style={{ marginTop: '1.5rem' }}>4️⃣ 슬로건 입력:</h3>
          <input
            type="text"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            placeholder="예) 모두가 행복한 세상"
            style={{ padding: '0.5rem', fontSize: '1rem', width: '300px' }}
          />

          {/* 색상 변경 */}
          <h3 style={{ marginTop: '1.5rem' }}>5️⃣ 배경색 선택:</h3>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />

          <h3 style={{ marginTop: '1.5rem' }}>6️⃣ 이름 글자색 선택:</h3>
          <input
            type="color"
            value={nameColor}
            onChange={(e) => setNameColor(e.target.value)}
          />

          <h3 style={{ marginTop: '1.5rem' }}>7️⃣ 슬로건 글자색 선택:</h3>
          <input
            type="color"
            value={sloganColor}
            onChange={(e) => setSloganColor(e.target.value)}
          />

          {/* 미리보기 */}
          <div ref={posterRef} style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #999', backgroundColor: bgColor }}>
            <h2>📢 포스터 미리보기</h2>
            {imageSrc && <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '200px', height: 'auto' }} />}
            <h2 style={{ fontSize: '2rem', marginTop: '1rem', color: nameColor }}>{candidateName}</h2>
            <p style={{ fontSize: '1.2rem', color: sloganColor }}>{slogan}</p>
          </div>
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
                cursor: 'pointer'
            }}
            >
            📥 포스터 다운로드
            </button>
        </div>
      )}
    </div>
  );
}
