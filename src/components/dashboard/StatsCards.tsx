import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  userId: string;
}

interface Stats {
  totalReferrals: number;
  totalEarnings: number;
  monthlyEarnings: number;
}

export const StatsCards = ({ userId }: StatsCardsProps) => {
  const [stats, setStats] = useState<Stats>({
    totalReferrals: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      // Get referral count
      const { count: referralCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("referred_by", userId);

      // Get total earnings
      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", userId);

      const totalEarnings = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // Get monthly earnings (current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyTransactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());

      const monthlyEarnings = monthlyTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setStats({
        totalReferrals: referralCount || 0,
        totalEarnings,
        monthlyEarnings,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего рефералов</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : stats.totalReferrals}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : `${stats.totalEarnings.toFixed(2)} USDT`}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Доход за месяц</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? "..." : `${stats.monthlyEarnings.toFixed(2)} USDT`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
