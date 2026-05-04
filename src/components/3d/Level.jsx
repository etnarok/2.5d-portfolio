// src/components/3d/Level.jsx
import { Html, useGLTF } from '@react-three/drei';
import useStore from '../../store/useStore';

// --- SES DOSYALARI ---
// Bileşenin dışında tanımlıyoruz ki bir kere yüklensin, her seferinde baştan render olmasın
const clickSound = new Audio('/sounds/click.wav');

// --- ARKA PLAN BİLEŞENLERİ ---
function Tree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 1, 5]} />
        <meshLambertMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[1, 2.5, 5]} />
        <meshLambertMaterial color="#2E8B57" />
      </mesh>
    </group>
  );
}

function Cloud({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 7, 7]} />
        <meshLambertMaterial color="white" />
      </mesh>
      <mesh position={[0.8, -0.2, 0]}>
        <sphereGeometry args={[0.8, 7, 7]} />
        <meshLambertMaterial color="white" />
      </mesh>
      <mesh position={[-0.8, -0.2, 0]}>
        <sphereGeometry args={[0.8, 7, 7]} />
        <meshLambertMaterial color="white" />
      </mesh>
    </group>
  );
}

export default function Level() {
  const { scene: groundScene } = useGLTF('/models/zemin.glb');
  
  const activeProject = useStore((state) => state.activeProject);
  const setActiveProject = useStore((state) => state.setActiveProject);

  const started = useStore((state) => state.started);

  const portfolioItems = [
    {
      id: 1,
      positionX: 15,
      title: "Who am I?",
      shortDescription: "Computer Programming -> Information Systems Engineering (4th Year).",
      detailedDescription: "Hello, I am a full-stack web developer. I have been interested in computers and the internet since childhood. I started producing content as a software developer for the ecosystem I was interested in.  I continue to improve myself every day to satisfy my thirst for self-improvement and knowledge in this field.In this adventure, where I started my education as a computer programmer, I thought that it was not enough for me and I took my education to a higher level to get the title of engineer.",
      color: "#3b82f6",
      image: "/images/profile.jpg",
      link: "https://www.linkedin.com/in/emir-arslaner/",
      buttonText: "Go to LinkedIn" 
    },
    {
      id: 2,
      positionX: 35,
      title: "Parallax Effect Js",
      shortDescription: "Parallax effect experience on the website",
      detailedDescription: "A front-end designed to adapt to and innovate with today’s rapidly evolving modern web technologies ",
      color: "#10b981",
      image: "/images/parallax.png",
      link: "https://github.com/etnarok/Parallax-Efect-JS",
      buttonText: "View on GitHub" 
    },
    {
      id: 3,
      positionX: 55,
      title: "Music Player with Vanilla JavaScript",
      shortDescription: "My first Vanilla JS Music Player",
      detailedDescription: "A music player I built from scratch to learn JavaScript in detail from start to finish",
      color: "#f59e0b",
      image: "/images/vanilla-musicplayer.png",
      link: "https://github.com/etnarok/js-musicPlayer",
      buttonText: "View on GitHub" 
    },
    {
      id: 4,
      positionX: 75,
      title: "Vanilla Js Quiz App",
      shortDescription: "My first Quiz App",
      detailedDescription: "A sleek, interactive, and responsive Quiz Application built using pure JavaScript, HTML5, and CSS3. This project demonstrates DOM manipulation, state management, and dynamic UI updates without the need for external frameworks.",
      color: "#8b5cf6",
      image: "/images/vanilla-quizapp.png",
      link: "https://github.com/etnarok/Basic-Vanilla-Js-Quiz-App",
      buttonText: "View on GitHub" 
    }
  ];

  const numberOfGroundTiles = 16;
  const groundLength = 5.6; 

  return (
    <group>
      
      {/* ZEMİN */}
      {Array.from({ length: numberOfGroundTiles }).map((_, index) => (
        <primitive 
          key={index} 
          object={groundScene.clone()} 
          position={[index * groundLength, -0.5, 0]} 
          scale={[1, 1, 1]} 
        />
      ))}

      {/* ARKA PLAN DEKORASYONU */}
      <Tree position={[5, -0.4, -3]} />
      <Tree position={[12, -0.4, -3]} />
      <Tree position={[25, -0.4, -3]} />
      <Tree position={[45, -0.4, -3]} />
      <Tree position={[65, -0.4, -3]} />
      <Tree position={[85, -0.4, -3]} />

      <Cloud position={[10, 5, -8]} scale={1.2} />
      <Cloud position={[30, 6, -10]} scale={0.8} />
      <Cloud position={[50, 4, -7]} scale={1.5} />
      <Cloud position={[70, 7, -12]} scale={1} />

      {/* PORTFOLYO TABELALARI (BILLBOARDS) */}
      {portfolioItems.map((item) => (
        <group key={item.id} position={[item.positionX, 1.5, -2]}>
          <mesh>
            <boxGeometry args={[4.2, 2.7, 0.2]} />
            <meshLambertMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
            <meshLambertMaterial color="#718096" />
          </mesh>
          <Html transform position={[0, 0, 0.11]} scale={0.3}>
            <div style={{
                // İŞTE SİHİRLİ SATIR BURASI: Oyun başlamadıysa VEYA pop-up açıksa gizle
                display: (!started || activeProject) ? 'none' : 'block', 
                width: '350px', padding: '20px', background: item.color, color: 'white',
                borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                fontFamily: 'sans-serif', textAlign: 'center', border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>{item.title}</h2>
              {/* TABELA İÇİN KISA AÇIKLAMA */}
              <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5' }}>{item.shortDescription}</p>
              <button 
                style={{ marginTop: '15px', padding: '8px 16px', border: 'none', borderRadius: '6px',
                         background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => {
                  clickSound.play().catch((e) => console.log("Ses dosyası bulunamadı", e));
                  setActiveProject(item);
                }}
              >
                Details
              </button>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

// Performans için zemin modelini önceden yükle
useGLTF.preload('/models/zemin.glb');