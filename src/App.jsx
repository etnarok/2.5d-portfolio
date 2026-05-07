// src/App.jsx
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Environment, Html, useProgress } from '@react-three/drei';
import Character from './components/3d/Character';
import Level from './components/3d/Level';
import { useControls } from './hooks/useControls';
import useStore from './store/useStore';

// --- YÜKLEME EKRANI ---
function Preloader({ onStarted }) {
  const { progress } = useProgress(); 
  
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onStarted();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, onStarted]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#0f172a', zIndex: 9999999, display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white'
    }}>
      <img src="/images/logo.png" alt="Etnarok Logo" style={{ width: '150px', marginBottom: '20px', opacity: progress < 100 ? 0.8 : 1, transition: 'opacity 0.5s ease' }} />
      <h2 style={{ fontSize: '24px', marginBottom: '15px', letterSpacing: '2px' }}>MODELS LOADING</h2>
      
      <div style={{ width: '300px', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.3s ease-out' }} />
      </div>
      
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

export default function App() {
  useControls();
  const setMovement = useStore((state) => state.setMovement);
  const activeProject = useStore((state) => state.activeProject);
  const setActiveProject = useStore((state) => state.setActiveProject);

  const started = useStore((state) => state.started);
  const setStarted = useStore((state) => state.setStarted);
  
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSending, setIsSending] = useState(false); // Form gönderiliyor mu durumu

  // YENİ: Ses objelerini useState ile sabitliyoruz (React'in iki kere yükleme bug'ını çözer)
  // DİKKAT: .wav mı .mp3 mü olduğunu kendi dosyana göre mutlaka kontrol et!
  const [bgm] = useState(() => new Audio('/sounds/bgm.mp3')); 
  const [closeSound] = useState(() => new Audio('/sounds/close.wav'));

  // Oyun başladığında ses ayarlarını yapıyoruz
  useEffect(() => {
    bgm.loop = true;
    bgm.volume = 0.3;
  }, [bgm]);

  const handleStart = () => {
    setStarted(true);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      bgm.pause();
    } else {
      bgm.play().catch(e => console.log("Ses çalınamadı, dosya yolunu/adını kontrol et!", e));
    }
    setIsPlaying(!isPlaying);
  };

  // YENİ: Mail Gönderme Fonksiyonu (Sayfa yenilenmez, arkadan gönderir)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const formData = new FormData(e.target);

    try {
      // DİKKAT: BURAYA KENDİ FORMSPREE LİNKİNİ YAPIŞTIR
      const response = await fetch("https://formspree.io/f/mojrnjjv", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        alert("Your message was sent successfully!");
        setIsContactOpen(false); // Başarılıysa pop-up'ı kapat
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      alert("A connection error occurred.");
    } finally {
      setIsSending(false);
      e.target.reset(); // Formun içini temizle
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', touchAction: 'none' }}>
      
      {!started && <Preloader onStarted={handleStart} />}

      {started && (
        <>
          <button
            onClick={() => setIsContactOpen(true)}
            style={{
              position: 'absolute', top: '20px', left: '20px', zIndex: 100,
              width: '45px', height: '45px', borderRadius: '50%', border: 'none',
              backgroundColor: 'rgba(59, 130, 246, 0.8)', backdropFilter: 'blur(5px)',
              color: 'white', fontSize: '20px', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            ✉️
          </button>

          <button
            onClick={toggleMusic}
            style={{
              position: 'absolute', top: '20px', right: '20px', zIndex: 100,
              width: '45px', height: '45px', borderRadius: '50%', border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)',
              color: 'white', fontSize: '20px', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            {isPlaying ? '🔊' : '🔇'}
          </button>
        </>
      )}

      {/* YENİ İLETİŞİM FORMU (AJAX / Fetch ile) */}
      {isContactOpen && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          zIndex: 999999, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#1e293b', width: '90%', maxWidth: '400px',
            borderRadius: '20px', padding: '30px', color: 'white',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            border: '1px solid #334155'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '26px', color: '#3b82f6' }}>Contact Me</h2>
            <p style={{ marginBottom: '20px', color: '#94a3b8' }}>
              You can contact me regarding projects or job offers.
            </p>
            
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Formspree için özel replyto ayarı */}
              <input 
                type="email" name="email" placeholder="Your Email Address" required
                style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white', outline: 'none' }}
              />
              <textarea 
                name="message" placeholder="Your message" rows="4" required
                style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white', outline: 'none', resize: 'none' }}
              ></textarea>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsContactOpen(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #475569', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                  Close
                </button>
                <button type="submit" disabled={isSending} style={{ flex: 1, padding: '12px', backgroundColor: isSending ? '#64748b' : '#3b82f6', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {started && !activeProject && !isContactOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex' }}>
          <div style={{ flex: 1, opacity: 0 }} onTouchStart={() => setMovement(-1)} onTouchEnd={() => setMovement(0)} onMouseDown={() => setMovement(-1)} onMouseUp={() => setMovement(0)} onMouseLeave={() => setMovement(0)} />
          <div style={{ flex: 1, opacity: 0 }} onTouchStart={() => setMovement(1)} onTouchEnd={() => setMovement(0)} onMouseDown={() => setMovement(1)} onMouseUp={() => setMovement(0)} onMouseLeave={() => setMovement(0)} />
        </div>
      )}

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

      {activeProject && !isContactOpen && (
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
                Close
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