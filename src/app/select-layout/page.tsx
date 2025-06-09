'use client';

import { useRouter } from 'next/navigation';

// Constants
const LAYOUTS = {
  FOCUS_PERSON: '인물 집중 유도형',
  FOCUS_NAME: '이름 인지 강화형',
  FOCUS_SLOGAN: '슬로건 집중 유도형 및 전반 탐색 유도형',
  FOCUS_INFO: '정보 효율 전달형',
} as const;

const layoutDetails = [
  {
    id: 'FOCUS_PERSON',
    name: LAYOUTS.FOCUS_PERSON,
    description: '후보자의 얼굴을 강조하여 기억에 남기기 좋은 레이아웃 <br /><br /> 레이아웃 추천 분야: <br />첫 인상 중심의 후보 브랜딩 포스터',
    preview: '/layouts/focus-person.png'
  },
  {
    id: 'FOCUS_NAME',
    name: LAYOUTS.FOCUS_NAME,
    description: '후보자의 이름을 강조하여 기억에 남기기 좋은 레이아웃 <br /><br /> 레이아웃 추천 분야: <br />첫 출마 후보의 이름 인지도 제고용 포스터, 유사 이름의 타 후보와 구분이 필요한 경우',
    preview: '/layouts/focus-name.png'
  },
  {
    id: 'FOCUS_SLOGAN',
    name: LAYOUTS.FOCUS_SLOGAN,
    description: '슬로건을 중심으로 전체적인 메시지를 전달하는 레이아웃 <br /><br /> 레이아웃 추천 분야: <br />유사한 포스터 속에서 이질적인 디자인으로 주목도를 높이려는 경우, 후보자의 이미지 또는 감성적 메시지를 강조하고자 할 때',
    preview: '/layouts/focus-slogan.png'
  },
  {
    id: 'FOCUS_INFO',
    name: LAYOUTS.FOCUS_INFO,
    description: '정제된 정보를 안정적으로 전달하는 익숙한 레이아웃 <br /><br /> 레이아웃 추천 분야: <br />명확한 전달 목적을 가진 포스터 (예: 공약 비교, 정책 요약 등), 행정기관 주도형 정보 게시물, 투표 안내 포스터 등 공식적 톤 강조시',
    preview: '/layouts/focus-info.png'
  }
];

export default function SelectLayoutPage() {
  const router = useRouter();

  const handleLayoutSelect = (layoutId: string) => {
    router.push(`/generator?layout=${layoutId}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#00FFC2', paddingBottom: '3rem' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#00FFC2' }}>
            전공종합설계및논문 2조
          </h1>
          <p className="text-xl" style={{ color: '#00FFC2' }}>
          -구세영, 김나은, 류석현, 최예서, 한재원
          </p>
          <br />
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#00FFC2' }}>
            선거 포스터 가이드라인 <br /> 도우미&제작 서비스
          </h1>
          <p className="text-xl" style={{ color: '#00FFC2' }}>
            후보자님의 목적에 맞는 레이아웃을 선택하여<br /> 포스터를 만들어보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {layoutDetails.map((layout) => (
            <div
              key={layout.id}
              className="bg-black rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-102 active:scale-98 border border-[#00FFC2]"
              onClick={() => handleLayoutSelect(layout.id)}
              style={{ color: '#00FFC2' }}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-900 flex items-center justify-center">
                <img
                  src={layout.preview}
                  alt={layout.name}
                  className="object-cover w-full h-full"
                  style={{ borderBottom: '1px solid #00FFC2' }}
                />
              </div>
              <div className="p-3">
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#00FFC2' }}>
                  {layout.name}
                </h3>
                <p style={{ color: '#00FFC2', fontSize: '0.95rem', margin: 0 }} dangerouslySetInnerHTML={{ __html: layout.description }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 