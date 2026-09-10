import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Bell, Flame, Calendar, Gift } from 'lucide-react';

export default function AccountNotificationsPage() {
  const alerts = [
    {
      title: "Prasadam Dispatched via Speed Post",
      desc: "Your Maha Rudrabhishekam blessed vibhuti and silver coin kit has been dispatched. Tracking: EM984920194IN.",
      date: "Today, 11:30 AM",
      icon: Gift,
      badge: "Prasadam"
    },
    {
      title: "Day 3 Maha Rudra Trishathi Japa Commencing",
      desc: "Morning Abhishekam live stream is now broadcasting from the main sanctum.",
      date: "Today, 07:15 AM",
      icon: Flame,
      badge: "Live Alert"
    },
    {
      title: "Sankalpam Muhurtham Reminder",
      desc: "Your Janma Nakshatra (Arudra) Homam is scheduled for Day 6 at 08:30 AM.",
      date: "Yesterday",
      icon: Calendar,
      badge: "Reminder"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="border-b border-gold/20 pb-4">
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
              Live Updates & Devotee Alerts
            </h1>
            <p className="text-xs sm:text-sm text-ivory/70">
              Real-time notifications about your pujas, prasadam tracking, and Yagasala darshan
            </p>
          </div>

          <div className="space-y-4">
            {alerts.map((al, idx) => {
              const Icon = al.icon;
              return (
                <Card key={idx} variant="sacred" className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/60 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-cinzel text-sm sm:text-base font-bold text-ivory">
                        {al.title}
                      </h4>
                      <Badge variant="gold" size="sm">{al.badge}</Badge>
                    </div>
                    <p className="text-xs text-ivory/80 leading-relaxed">
                      {al.desc}
                    </p>
                    <span className="text-[10px] text-ivory/50 block pt-1">{al.date}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
