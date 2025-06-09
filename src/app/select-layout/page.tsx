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
    description: '후보자의 얼굴을 크게 배치하여 시각적 인지도를 높이는 레이아웃',
    preview: '/layouts/focus-person.png'
  },
  {
    id: 'FOCUS_NAME',
    name: LAYOUTS.FOCUS_NAME,
    description: '후보자의 이름을 강조하여 기억에 남기기 좋은 레이아웃',
    preview: '/layouts/focus-name.png'
  },
  {
    id: 'FOCUS_SLOGAN',
    name: LAYOUTS.FOCUS_SLOGAN,
    description: '슬로건을 중심으로 전체적인 메시지를 전달하는 레이아웃',
    preview: '/layouts/focus-slogan.png'
  },
  {
    id: 'FOCUS_INFO',
    name: LAYOUTS.FOCUS_INFO,
    description: '중요 정보를 효율적으로 전달하는 깔끔한 레이아웃',
    preview: '/layouts/focus-info.png'
  }
];

export default function SelectLayoutPage() {
  const router = useRouter();

  const handleLayoutSelect = (layoutId: string) => {
    router.push(`/generator?layout=${layoutId}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#00FFC2' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#00FFC2' }}>
            포스터 레이아웃 선택
          </h1>
          <p className="text-xl" style={{ color: '#00FFC2' }}>
            원하는 레이아웃을 선택하여 포스터를 만들어보세요
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
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#00FFC2' }}>
                  {layout.name}
                </h3>
                <p style={{ color: '#00FFC2' }}>{layout.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 