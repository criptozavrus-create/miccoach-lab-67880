import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet, Loader2, Save } from "lucide-react";

interface WalletManagementProps {
  userId: string;
}

interface WalletData {
  wallet_address: string;
}

export const WalletManagement = ({ userId }: WalletManagementProps) => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWallet();
  }, [userId]);

  const loadWallet = async () => {
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setWallet(data);
        setWalletAddress(data.wallet_address);
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
      toast.error("Ошибка загрузки кошелька");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress.trim()) {
      toast.error("Введите адрес кошелька");
      return;
    }

    setSaving(true);
    try {
      if (wallet) {
        // Update existing wallet
        const { error } = await supabase
          .from("wallets")
          .update({ wallet_address: walletAddress })
          .eq("user_id", userId);

        if (error) throw error;
        toast.success("Кошелёк обновлён");
      } else {
        // Insert new wallet
        const { error } = await supabase
          .from("wallets")
          .insert({ user_id: userId, wallet_address: walletAddress });

        if (error) throw error;
        toast.success("Кошелёк добавлен");
      }
      
      await loadWallet();
    } catch (error: any) {
      console.error("Error saving wallet:", error);
      toast.error(error.message || "Ошибка сохранения кошелька");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Управление кошельком
          </CardTitle>
          <CardDescription>
            Привяжите ваш USDT кошелёк для вывода средств
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveWallet} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Адрес кошелька USDT</Label>
              <Input
                id="wallet-address"
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Введите адрес вашего кошелька для получения выплат
              </p>
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {wallet ? "Обновить кошелёк" : "Добавить кошелёк"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Вывод средств</CardTitle>
          <CardDescription>
            Запросите вывод заработанных средств
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Текущий кошелёк:</p>
              <p className="font-mono text-sm break-all">
                {wallet?.wallet_address || "Не указан"}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={!wallet}
              onClick={() => toast.info("Функция вывода будет доступна скоро")}
            >
              Запросить вывод
            </Button>
            <p className="text-xs text-muted-foreground">
              Минимальная сумма для вывода: 10 USDT
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
