import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, CheckCircle2, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReferralNetworkProps {
  userId: string;
}

interface Partner {
  user_id: string;
  email: string;
  full_name: string | null;
  referral_level: number;
  created_at: string;
  has_wallet: boolean;
}

export const ReferralNetwork = ({ userId }: ReferralNetworkProps) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>("all");

  useEffect(() => {
    loadPartners();
  }, [userId]);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_referral_network", {
        root_user_id: userId,
      });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error("Error loading partners:", error);
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
    }).format(date);
  };

  const filteredPartners =
    levelFilter === "all"
      ? partners
      : partners.filter((p) => p.referral_level === parseInt(levelFilter));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Мои партнёры
            </CardTitle>
            <CardDescription>
              Всего партнёров: {partners.length}
            </CardDescription>
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Все линии" />
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
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {levelFilter === "all"
              ? "У вас пока нет партнёров"
              : `Нет партнёров на линии ${levelFilter}`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Партнёр</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Линия</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.user_id}>
                    <TableCell className="font-medium">
                      {partner.full_name || "Не указано"}
                    </TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Линия {partner.referral_level}</Badge>
                    </TableCell>
                    <TableCell>
                      {partner.has_wallet ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Активен
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <UserPlus className="h-3 w-3" />
                          Регистрация
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(partner.created_at)}</TableCell>
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
