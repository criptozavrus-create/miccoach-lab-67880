import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, LogOut, Copy, Check } from "lucide-react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { WalletManagement } from "@/components/dashboard/WalletManagement";
import { ReferralNetwork } from "@/components/dashboard/ReferralNetwork";
import { LevelStats } from "@/components/dashboard/LevelStats";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  referral_code: string;
  referred_by: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      if (!profile) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Ошибка загрузки профиля");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/auth?ref=${profile?.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Реферальная ссылка скопирована!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Партнёрский кабинет</h1>
            <p className="text-muted-foreground mt-1">
              Добро пожаловать, {profile?.full_name || profile?.email}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>

        {/* Referral Link Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ваша реферальная ссылка</CardTitle>
            <CardDescription>
              Делитесь этой ссылкой для привлечения новых партнёров
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 bg-muted p-3 rounded-md font-mono text-sm break-all">
                {window.location.origin}/auth?ref={profile?.referral_code}
              </div>
              <Button onClick={copyReferralLink} className="sm:w-auto">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Копировать
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Ваш реферальный код: <span className="font-bold">{profile?.referral_code}</span>
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {user && <StatsCards userId={user.id} />}

        {/* Tabs Section */}
        <Tabs defaultValue="partners" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="partners">Партнёры</TabsTrigger>
            <TabsTrigger value="levels">По линиям</TabsTrigger>
            <TabsTrigger value="transactions">Начисления</TabsTrigger>
            <TabsTrigger value="wallet">Кошелёк</TabsTrigger>
          </TabsList>
          
          <TabsContent value="partners" className="mt-6">
            {user && <ReferralNetwork userId={user.id} />}
          </TabsContent>
          
          <TabsContent value="levels" className="mt-6">
            {user && <LevelStats userId={user.id} />}
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-6">
            {user && <TransactionHistory userId={user.id} />}
          </TabsContent>
          
          <TabsContent value="wallet" className="mt-6">
            {user && <WalletManagement userId={user.id} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
