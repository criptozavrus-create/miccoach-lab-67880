import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';

const Landing = () => {
  const [showContent, setShowContent] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Login Button - Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <Button 
          asChild 
          variant="ghost" 
          size="icon"
          className="h-12 w-12 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all"
        >
          <Link to="/auth">
            <LogIn className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {/* Main Content - Center */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl w-full space-y-12">
          {/* Title with Blinking Cursor */}
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold inline-flex items-center gap-2">
              AI Syndicate
              <span className="animate-pulse">|</span>
            </h1>
          </div>

          {/* Content Blocks */}
          <div className="space-y-8 animate-fade-in">
            {showContent && (
              <>
                {/* First Block */}
                <div className="text-center space-y-6 animate-fade-in">
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                    AI Syndicate — это закрытое сообщество исследователей и практиков, 
                    объединённых целью создать устойчивый источник дохода с помощью 
                    технологий нового поколения.
                  </p>

                  {/* Step Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      onClick={() => setActiveStep(1)}
                      className={`h-3 w-3 rounded-full transition-all ${
                        activeStep >= 1 ? 'bg-white w-12' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label="Шаг 1"
                    />
                    <button
                      onClick={() => setActiveStep(2)}
                      className={`h-3 w-3 rounded-full transition-all ${
                        activeStep >= 2 ? 'bg-white w-12' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label="Шаг 2"
                    />
                    <button
                      onClick={() => setActiveStep(3)}
                      className={`h-3 w-3 rounded-full transition-all ${
                        activeStep >= 3 ? 'bg-white w-12' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label="Шаг 3"
                    />
                  </div>
                </div>

                {/* Second Block */}
                {activeStep >= 2 && (
                  <div className="text-center space-y-6 animate-fade-in">
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                      Мы используем нейросети, автоматизацию и коллективный опыт, 
                      чтобы создавать системы пассивного дохода, которые высвобождают 
                      главное — время.
                    </p>
                  </div>
                )}

                {/* Third Block */}
                {activeStep >= 3 && (
                  <div className="text-center space-y-8 animate-fade-in">
                    <div className="space-y-4">
                      <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                        Мы создаём живую Базу знаний и инструментов, постоянно отслеживаем 
                        новейшие технологии и делимся свежими идеями.
                      </p>
                      <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                        Внутри сообщества — взаимопомощь, обмен опытом и созидательная 
                        философия, где каждый помогает другому расти.
                      </p>
                      <p className="text-lg md:text-xl text-white/90 leading-relaxed font-semibold">
                        Вместе мы развиваемся быстрее и достигаем результатов, 
                        недоступных в одиночку.
                      </p>
                    </div>

                    {/* Registration Button */}
                    <div className="pt-8">
                      <Button 
                        asChild 
                        size="lg"
                        className="bg-white text-black hover:bg-white/90 text-lg px-12 h-14 rounded-full font-semibold"
                      >
                        <Link to="/auth">
                          Регистрация
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
