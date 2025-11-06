import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, TrendingUp, Users, Wallet, Gift } from 'lucide-react';
import o2Logo from '../assets/o2-logo-square.png';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={o2Logo} alt="AI Syndicate" className="h-10 w-10" />
              <span className="text-xl font-bold text-primary">AI Syndicate</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Войти</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Начать</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              Новая эра партнёрской программы
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Зарабатывайте с{' '}
            <span className="text-primary">AI Syndicate</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Присоединяйтесь к экосистеме спортивной аналитики и получайте доход 
            от реферальной программы с прозрачной системой вознаграждений
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg h-12 px-8">
              <Link to="/auth">
                Начать зарабатывать
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg h-12 px-8">
              <Link to="/running">
                Посмотреть калькулятор
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Почему выбирают нас
          </h2>
          <p className="text-muted-foreground text-lg">
            Всё необходимое для успешного партнёрства в одной платформе
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Многоуровневая система</h3>
              <p className="text-muted-foreground">
                Получайте комиссию с пяти уровней партнёров и создавайте пассивный доход
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Прозрачность</h3>
              <p className="text-muted-foreground">
                Полный контроль над вашими транзакциями и реферальной сетью в реальном времени
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Быстрые выплаты</h3>
              <p className="text-muted-foreground">
                Получайте выплаты в USDT прямо на ваш кошелёк без задержек
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Реферальная сеть</h3>
              <p className="text-muted-foreground">
                Визуализация вашей команды и отслеживание активности каждого партнёра
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Бонусная программа</h3>
              <p className="text-muted-foreground">
                Получайте дополнительные бонусы за достижения и активность
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Мощная аналитика</h3>
              <p className="text-muted-foreground">
                Инструменты для анализа спортивных показателей и профилирования атлетов
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-12 md:p-16 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Готовы начать зарабатывать?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Присоединяйтесь к нашей платформе сегодня и начните строить свою реферальную сеть
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="text-lg h-12 px-8"
            >
              <Link to="/auth">
                Зарегистрироваться бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={o2Logo} alt="AI Syndicate" className="h-8 w-8" />
              <span className="text-sm text-muted-foreground">
                © 2024 AI Syndicate. Все права защищены.
              </span>
            </div>
            <div className="flex gap-6">
              <Link to="/running" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Калькулятор
              </Link>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Вход
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
