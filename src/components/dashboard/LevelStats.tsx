import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp } from "lucide-react";

interface LevelStatsProps {
  userId: string;
}

interface LevelStat {
  level: number;
  partner_count: number;
  total_earnings: number;
}

const commissionRates: Record<number, number> = {
  1: 15,
  2: 5,
  3: 5,
  4: 3,
  5: 3,
  6: 3,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  11: 1,
  12: 1,
  13: 2,
  14: 3,
  15: 5,
};

export const LevelStats = ({ userId }: LevelStatsProps) => {
  const [stats, setStats] = useState<LevelStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_level_statistics", {
        root_user_id: userId,
      });

      if (error) throw error;
      
      // Create full array with all 15 levels
      const fullStats: LevelStat[] = Array.from({ length: 15 }, (_, i) => {
        const level = i + 1;
        const existingStat = data?.find((s: any) => s.level === level);
        return {
          level,
          partner_count: existingStat?.partner_count || 0,
          total_earnings: existingStat?.total_earnings || 0,
        };
      });
      
      setStats(fullStats);
    } catch (error) {
      console.error("Error loading level stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPartners = stats.reduce((sum, s) => sum + Number(s.partner_count), 0);
  const totalEarnings = stats.reduce((sum, s) => sum + Number(s.total_earnings), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Статистика по линиям
        </CardTitle>
        <CardDescription>
          Всего партнёров: {totalPartners} • Общий доход: {totalEarnings.toFixed(2)} USDT
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Линия</TableHead>
                  <TableHead>Комиссия</TableHead>
                  <TableHead className="text-right">Партнёров</TableHead>
                  <TableHead className="text-right">Доход (USDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat) => (
                  <TableRow 
                    key={stat.level}
                    className={Number(stat.partner_count) > 0 ? "" : "opacity-50"}
                  >
                    <TableCell className="font-medium">
                      <Badge variant="outline">Линия {stat.level}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{commissionRates[stat.level]}%</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(stat.partner_count)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {Number(stat.total_earnings).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
