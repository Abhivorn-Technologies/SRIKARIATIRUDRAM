import { devoteeService } from '@/services/devotee.service';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { User, Plus } from 'lucide-react';

export default async function AccountSankalpamPage() {
  const profile = await devoteeService.getProfile();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div>
              <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
                Sankalpam Profile & Family Records
              </h1>
              <p className="text-xs sm:text-sm text-ivory/70">
                Registered gotram and birth stars used across all your Yajna offerings
              </p>
            </div>
            <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Family Member
            </Button>
          </div>

          {/* Primary Devotee Card */}
          <Card variant="gold-border" className="p-6 space-y-4">
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
              Primary Devotee
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-ivory/50 block">Name:</span>
                <strong className="text-ivory text-sm">{profile.fullName}</strong>
              </div>
              <div>
                <span className="text-ivory/50 block">Gotram:</span>
                <strong className="text-gold-light text-sm">{profile.gotram}</strong>
              </div>
              <div>
                <span className="text-ivory/50 block">Janma Star / Rasi:</span>
                <strong className="text-gold-light text-sm">{profile.nakshatra} ({profile.rasi})</strong>
              </div>
            </div>
          </Card>

          {/* Family Members Cards */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-gold-light">
              Registered Family Members for Sankalpam
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.familyMembers.map((fm) => (
                <Card key={fm.id} variant="sacred" className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-cinzel text-base font-bold text-ivory">
                      {fm.name}
                    </h4>
                    <Badge variant="gold" size="sm">
                      {fm.relation}
                    </Badge>
                  </div>
                  <div className="text-xs text-ivory/75">
                    Nakshatra: <strong className="text-gold-lighter">{fm.nakshatra}</strong> • Rasi: <strong className="text-gold-lighter">{fm.rasi}</strong>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
