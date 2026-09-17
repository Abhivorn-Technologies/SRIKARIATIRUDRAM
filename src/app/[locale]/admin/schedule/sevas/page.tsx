"use client";

import React, { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Flame, ArrowRight, Sparkles } from "lucide-react";

export default function AdminDaySevasRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/admin/schedule");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <Card className="max-w-md p-8 bg-[#240006] border border-gold/40 shadow-2xl space-y-6 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center mx-auto text-gold animate-bounce">
          <Flame className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="gold" className="uppercase font-cinzel text-[10px]">
            <Sparkles className="w-3 h-3 mr-1" /> Unified Control Center
          </Badge>
          <h2 className="font-cinzel text-xl font-bold text-gold">
            Day Seva Allocation Desk is now Unified!
          </h2>
          <p className="text-xs text-ivory/70 leading-relaxed">
            Seva ticket allocation, capacity management, and show/hide toggles are now directly integrated into the <strong>28-Day Programme Manager</strong>.
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => router.replace("/admin/schedule")}
            className="w-full bg-gold text-maroon font-bold hover:bg-gold-light text-xs flex items-center justify-center gap-2 py-2.5"
          >
            <span>Go to Unified 28-Day Schedule</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}