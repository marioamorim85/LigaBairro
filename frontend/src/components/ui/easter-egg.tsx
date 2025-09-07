'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToastDelight } from '@/components/ui/toast-delight';
import { useConfetti } from '@/components/ui/confetti';

// Konami Code sequence: ↑↑↓↓←→←→BA
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

// Click sequence for mobile
const CLICK_SEQUENCE = [3, 1, 4, 1, 5]; // Pi sequence for fun

export function EasterEggDetector() {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const { showCelebration, showLove } = useToastDelight();
  const { triggerConfetti } = useConfetti();

  // Reset sequences after timeout
  const resetSequences = useCallback(() => {
    setKeySequence([]);
    setClickSequence([]);
    setClickCount(0);
  }, []);

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSequence = [...prev, event.code].slice(-KONAMI_CODE.length);
        
        if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
          // Konami code activated!
          triggerConfetti({ 
            duration: 5000, 
            particleCount: 300,
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
          });
          
          showCelebration(
            'Konami Code Activado! 🎮',
            'És um verdadeiro gamer da velha escola! A comunidade Liga Bairro saúda-te! 🏆'
          );
          
          // Add special CSS class to body for extra effects
          document.body.classList.add('konami-active');
          setTimeout(() => {
            document.body.classList.remove('konami-active');
          }, 10000);
          
          resetSequences();
          return [];
        }
        
        return newSequence;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [triggerConfetti, showCelebration, resetSequences]);

  // Logo click sequence detection
  useEffect(() => {
    const handleLogoClick = () => {
      const now = Date.now();
      
      // Reset if too much time passed since last click
      if (now - lastClickTime > 2000) {
        setClickCount(1);
        setClickSequence([1]);
      } else {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        
        const newSequence = [...clickSequence, newCount].slice(-CLICK_SEQUENCE.length);
        setClickSequence(newSequence);
        
        // Check if sequence matches
        if (JSON.stringify(newSequence) === JSON.stringify(CLICK_SEQUENCE)) {
          triggerConfetti({
            duration: 3000,
            particleCount: 150,
            colors: ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5']
          });
          
          showLove(
            'Descobriste o segredo do Pi! π',
            'Matemática + Comunidade = Amor infinito! 💕∞'
          );
          
          resetSequences();
        }
      }
      
      setLastClickTime(now);
    };

    // Add click listeners to logo elements
    const logoElements = document.querySelectorAll('[data-easter-egg="logo"]');
    logoElements.forEach(el => {
      el.addEventListener('click', handleLogoClick);
    });

    return () => {
      logoElements.forEach(el => {
        el.removeEventListener('click', handleLogoClick);
      });
    };
  }, [clickCount, clickSequence, lastClickTime, triggerConfetti, showLove, resetSequences]);

  // Special date celebrations
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1; // 0-based, so +1
    const day = now.getDate();
    
    // Check for special dates
    const specialDates = [
      { month: 12, day: 25, message: 'Feliz Natal! 🎄', description: 'Que este Natal traga muita união à comunidade de Fiães!' },
      { month: 1, day: 1, message: 'Feliz Ano Novo! 🎊', description: 'Que 2024 seja cheio de vizinhança e solidariedade!' },
      { month: 6, day: 24, message: 'São João! 🔥', description: 'Festa na comunidade! Vamos celebrar as tradições de Fiães!' },
      { month: 10, day: 31, message: 'Halloween! 👻', description: 'Doces ou travessuras... ou melhor, ajuda aos vizinhos!' }
    ];
    
    const todaySpecial = specialDates.find(date => date.month === month && date.day === day);
    
    if (todaySpecial) {
      setTimeout(() => {
        triggerConfetti({ duration: 4000, particleCount: 200 });
        showCelebration(todaySpecial.message, todaySpecial.description);
      }, 2000); // Show after 2 seconds
    }
  }, [triggerConfetti, showCelebration]);

  return null; // This component doesn't render anything visible
}

// Component to mark logo elements for Easter egg detection
export function EasterEggLogo({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-easter-egg="logo" className={className}>
      {children}
    </div>
  );
}

// Secret developer panel (activated by Konami code)
export function SecretPanel() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkKonami = () => {
      setIsVisible(document.body.classList.contains('konami-active'));
    };

    const observer = new MutationObserver(checkKonami);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce-in">
      <div className="text-sm font-bold mb-2">🎮 Modo Desenvolvedor Ativado</div>
      <div className="text-xs opacity-90">
        <div>• Liga Bairro v1.0</div>
        <div>• Easter eggs descobertos: 1/5</div>
        <div>• Feito com ❤️ em Fiães</div>
      </div>
    </div>
  );
}

// Global CSS for Konami code effects
export const konamiStyles = `
  .konami-active {
    animation: rainbow-bg 5s linear infinite;
  }
  
  .konami-active * {
    animation: rainbow-text 3s linear infinite;
  }
  
  @keyframes rainbow-bg {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  @keyframes rainbow-text {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;

// More Easter eggs for power users
export const easterEggActions = {
  // Triple-click anywhere
  tripleClick: {
    message: 'Triplo clique mestre! 🖱️',
    description: 'Tens dedos rápidos! Vais ser óptimo a ajudar vizinhos!'
  },
  
  // Long press (mobile)
  longPress: {
    message: 'Pressão longa detectada! 📱',
    description: 'Paciência é uma virtude... especialmente na comunidade!'
  },
  
  // Shake device (mobile)
  shake: {
    message: 'Shake it! 📳',
    description: 'Agitaste o dispositivo como um verdadeiro vizinho empolgado!'
  },
  
  // Zoom in/out rapidly
  zoom: {
    message: 'Zoom Master! 🔍',
    description: 'Vês todos os detalhes... até os mais pequenos pedidos de ajuda!'
  }
};