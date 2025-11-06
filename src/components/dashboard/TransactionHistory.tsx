import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface TransactionHistoryProps {
  userId: string;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  referral_level: number;
  commission_percent: number;
  created_at: string;
}

const transactionTypeLabels: Record<string, string> = {
  registration: "Регистрация",
  purchase: "Покупка",
  renewal: "Продление",
  paid_feature: "Платная функция",
};

export const TransactionHistory = ({ userId }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>("all");

  useEffect(() => {
    loadTransactions();
  }, [userId, levelFilter]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (levelFilter !== "all") {
        query = query.eq("referral_level", parseInt(levelFilter));
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>История начислений</CardTitle>
            <CardDescription>Все ваши транзакции в USDT</CardDescription>
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по линии" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все линии</SelectItem>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  Линия {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Пока нет транзакций
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Линия</TableHead>
                  <TableHead>Процент</TableHead>
                  <TableHead className="text-right">Сумма (USDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transactionTypeLabels[transaction.transaction_type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>Линия {transaction.referral_level}</Badge>
                    </TableCell>
                    <TableCell>{transaction.commission_percent}%</TableCell>
                    <TableCell className="text-right font-bold">
                      {Number(transaction.amount).toFixed(6)}
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
