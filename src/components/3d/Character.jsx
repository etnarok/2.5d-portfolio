// src/components/3d/Character.jsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import useStore from '../../store/useStore';

export default function Character() {
  const groupRef = useRef();
  const movement = useStore((state) => state.movement);
  const speed = 5;

  // 1. Modeli ve Animasyonları Yükle
  // DİKKAT: Dosya adını kendi indirdiğin modelin adıyla değiştirmelisin!
    // YENİ HALİ:
  // Hem draco dosyamızın adını yazıyoruz, hem de Google'ın çözücü linkini (CDN) ekliyoruz.
  const { scene, animations } = useGLTF(
    '/models/karakter-draco.glb', 
    'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
  );
  const { actions } = useAnimations(animations, groupRef);

  // 2. Animasyon Kontrolcüsü (Controller)
  useEffect(() => {
    // Modelinin içindeki animasyonların gerçek isimlerini görmek için bu log'u kullan:
    // console.log("Animasyonlar:", actions);

    // Kendi modelindeki animasyon isimlerini (Walk, Idle vb.) buraya yazmalısın.
    // Çoğu Mixamo modelinde isimler 'Idle' ve 'Walk' veya 'Run' olur.
    const idleActionName = 'Zombie|Idle'; 
    const walkActionName = 'Zombie|Walk'; 

    let currentAction;

    if (movement === 0 && actions[idleActionName]) {
       // Duruyorsa bekleme animasyonu
       currentAction = actions[idleActionName];
    } else if (movement !== 0 && actions[walkActionName]) {
       // Gidiyorsa yürüme animasyonu
       currentAction = actions[walkActionName];
    }

    // Seçilen animasyonu yavaşça geçiş yaparak (fadeIn) oynat
    if (currentAction) {
       currentAction.reset().fadeIn(0.2).play();
    }

    // Component güncellenirken eski animasyonu durdur
    return () => {
       if (currentAction) {
         currentAction.fadeOut(0.2);
       }
    };
  }, [movement, actions]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // --- YENİ: SINIRLAR (LIMITS) ---
      const minX = 8;   // Başlangıç noktası (Kırmızı duvarın olduğu yer)
      const maxX = 80;  // Bitiş noktası (Son tabeladan biraz sonrası. İhtiyaca göre artırabilirsin)

      // Önce yeni pozisyonu hesaplıyoruz
      let nextX = groupRef.current.position.x + movement * speed * delta;

      // Eğer yeni pozisyon sınırları aşıyorsa, onu sınırda tutuyoruz
      if (nextX < minX) nextX = minX;
      if (nextX > maxX) nextX = maxX;

      // Onaylanmış güvenli pozisyonu karaktere uyguluyoruz
      groupRef.current.position.x = nextX;

      // Yön çevirme (Aynı kalıyor)
      if (movement === 1 && nextX < maxX) { // Sınıra dayandıysa olduğu yerde yürümeye devam etmesin
        groupRef.current.rotation.y = Math.PI / 2; 
      } else if (movement === -1 && nextX > minX) {
        groupRef.current.rotation.y = -Math.PI / 2;
      } else {
        groupRef.current.rotation.y = 0; 
      }

      // Kamera takibi (Aynı kalıyor)
      state.camera.position.x = groupRef.current.position.x;
      state.camera.lookAt(groupRef.current.position.x, 1, 0);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 
        Modeli sahneye ekliyoruz. 
        Eğer model çok büyük veya küçük gelirse scale değerini değiştirebilirsin.
        position-y değerini modelin ayakları yere basacak şekilde ayarlayabilirsin.
      */}
      <primitive object={scene} scale={0.25} position={[0, -0.5, 0]} />
    </group>
  );
}

// Performans için modeli önceden belleğe alıyoruz
useGLTF.preload(
  '/models/karakter-draco.glb',
  'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'
);