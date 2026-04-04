// 📁 저장 경로: components/ImageCrop.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

function getCroppedCanvas(image: HTMLImageElement, crop: PixelCrop): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);

  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0, 0,
    canvas.width,
    canvas.height,
  );
  return canvas;
}

export default function ImageCrop({ imageSrc, onCropComplete, onCancel, aspectRatio }: ImageCropProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspectRatio);

  const handleSave = useCallback(async () => {
    if (!completedCrop || !imgRef.current) return;
    setSaving(true);
    const canvas = getCroppedCanvas(imgRef.current, completedCrop);
    if (!canvas) { setSaving(false); return; }
    canvas.toBlob(
      (blob) => { if (blob) onCropComplete(blob); setSaving(false); },
      'image/jpeg', 0.9,
    );
  }, [completedCrop, onCropComplete]);

  const presets = [
    { label: '자유', ratio: undefined },
    { label: '1:1', ratio: 1 },
    { label: '4:3', ratio: 4 / 3 },
    { label: '3:4', ratio: 3 / 4 },
    { label: '16:9', ratio: 16 / 9 },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 20,
        maxWidth: 600, width: '100%', maxHeight: '85vh', overflow: 'auto',
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
          ✂️ 사진 크롭
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={currentAspect}
            style={{ maxHeight: '55vh' }}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="크롭할 이미지"
              style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>

        {/* 비율 프리셋 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {presets.map(({ label, ratio }) => (
            <button
              key={label}
              onClick={() => {
                setCurrentAspect(ratio);
                setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
              }}
              style={{
                padding: '6px 14px',
                border: currentAspect === ratio ? '2px solid #FF3B1E' : '1px solid #ddd',
                borderRadius: 8,
                background: currentAspect === ratio ? '#FFF5F4' : '#f9f9f9',
                fontSize: 13, cursor: 'pointer',
                color: currentAspect === ratio ? '#FF3B1E' : '#555',
                fontWeight: currentAspect === ratio ? 700 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 24px', border: '1px solid #ddd', borderRadius: 10,
              background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#666',
            }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !completedCrop}
            style={{
              padding: '10px 24px', border: 'none', borderRadius: 10,
              background: saving ? '#ccc' : '#FF3B1E',
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: saving ? 'default' : 'pointer',
            }}
          >
            {saving ? '처리 중...' : '✓ 적용'}
          </button>
        </div>
      </div>
    </div>
  );
}
