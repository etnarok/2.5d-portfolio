// src/App.jsx
import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Environment, Html, useProgress } from '@react-three/drei';
import Character from './components/3d/Character';
import Level from './components/3d/Level';
import { useControls } from './hooks/useControls';
import useStore from './store/useStore';

// --- YÜKLEME EKRANI (PRELOADER) ---
function Preloader({ onStarted }) {
  const { progress } = useProgress(); 
  
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#0f172a', zIndex: 9999999, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white'
    }}>
      
      {/* KENDİ LOGON */}
      <img 
        src="/images/logo.png" 
        alt="Portfolio Logo" 
        style={{ 
          width: '150px',
          marginBottom: '20px',
          opacity: progress < 100 ? 0.8 : 1,
          transition: 'opacity 0.5s ease'
        }} 
      />
      
      <h2 style={{ fontSize: '24px', marginBottom: '15px', letterSpacing: '2px' }}>MODELS LOADING</h2>
      
      {/* Progress Bar */}
      <div style={{ width: '300px', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.3s ease-out' }} />
      </div>
      
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '30px' }}>
        {Math.round(progress)}%
      </div>

      {/* Yüzde 100 olunca butonu göster */}
      {progress >= 100 && (
        <button 
          onClick={onStarted}
          style={{
            padding: '12px 30px', fontSize: '18px', fontWeight: 'bold', color: 'white',
            backgroundColor: '#10b981', border: 'none', borderRadius: '8px',
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
          }}
        >
          Enter Portfolio
        </button>
      )}
    </div>
  );
}

// Ses Dosyaları
const closeSound = new Audio('/sounds/close.wav');

export default function App() {
  useControls();
  const setMovement = useStore((state) => state.setMovement);
  const activeProject = useStore((state) => state.activeProject);
  const setActiveProject = useStore((state) => state.setActiveProject);

  const started = useStore((state) => state.started);
  const setStarted = useStore((state) => state.setStarted);
  
  // ÇİFT YAZILAN KISIM DÜZELTİLDİ (Sadece 1 kere tanımladık):
  const [isPlaying, setIsPlaying] = useState(true); 
  
  const bgmRef = useRef(new Audio('/sounds/bgm.mp3'));
  bgmRef.current.loop = true; 
  bgmRef.current.volume = 0.3; 

  const handleStart = () => {
    setStarted(true);
    bgmRef.current.play().catch(e => console.log("Tarayıcı sesi engelledi", e));
  };

  const toggleMusic = () => {
    if (isPlaying) {
      bgmRef.current.pause();
    } else {
      bgmRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', touchAction: 'none' }}>
      
      {/* 1. YÜKLEME EKRANI */}
      {!started && <Preloader onStarted={handleStart} />}

      {/* 2. MÜZİK KONTROL BUTONU */}
      {started && (
        <button
          onClick={toggleMusic}
          style={{
            position: 'absolute', top: '20px', right: '20px', zIndex: 100,
            width: '45px', height: '45px', borderRadius: '50%', border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)',
            color: 'white', fontSize: '20px', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          {isPlaying ? '🔊' : '🔇'}
        </button>
      )}

      {/* 3. MOBİL DOKUNMATİK ALANLAR */}
      {started && !activeProject && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex' }}>
          <div style={{ flex: 1, opacity: 0 }} onTouchStart={() => setMovement(-1)} onTouchEnd={() => setMovement(0)} onMouseDown={() => setMovement(-1)} onMouseUp={() => setMovement(0)} onMouseLeave={() => setMovement(0)} />
          <div style={{ flex: 1, opacity: 0 }} onTouchStart={() => setMovement(1)} onTouchEnd={() => setMovement(0)} onMouseDown={() => setMovement(1)} onMouseUp={() => setMovement(0)} onMouseLeave={() => setMovement(0)} />
        </div>
      )}

      {/* 4. 3D SAHNE */}
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="city" />
          <Character />
          <Level />
        </Suspense>
      </Canvas>

      {/* 5. POP-UP (MODAL) EKRANI */}
      {activeProject && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#1f2937', width: '90%', maxWidth: '450px',
            borderRadius: '20px', padding: '25px', color: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: `2px solid ${activeProject.color}`,
            transform: 'translateY(0)', transition: 'all 0.3s ease-out'
          }}>
            <div style={{ width: '100%', height: '200px', backgroundColor: activeProject.color, borderRadius: '12px', marginBottom: '20px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {activeProject.image ? (
                <img src={activeProject.image} alt={activeProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '40px' }}>🖼️</span>
              )}
            </div>
            
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>{activeProject.title}</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#cbd5e1', marginBottom: '25px' }}>
              {activeProject.detailedDescription}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
              <button 
                onClick={() => {
                  closeSound.play().catch(e => console.log(e));
                  setActiveProject(null);
                }} 
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '2px solid #475569', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Kapat
              </button>
              
              <button 
                style={{ flex: 1, padding: '12px', backgroundColor: activeProject.color, border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => {
                  if(activeProject.link) window.open(activeProject.link, '_blank');
                  else alert("Bu proje için henüz link eklenmemiş!");
                }}
              >
                {activeProject.buttonText || "Projeye Git"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}