'use client';

import React, { useState, useEffect } from 'react';
import { useDevoteeAuth } from '@/context/DevoteeAuthContext';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { Plus, RefreshCw, Edit3 } from 'lucide-react';

export default function AccountSankalpamPage() {
  const { session } = useDevoteeAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/devotee/dashboard?phone=${encodeURIComponent(session?.phone || '')}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.profile) {
          setProfile(json.data.profile);
        }
      })
      .catch((err) => console.error('Failed to load Sankalpam profile from MongoDB:', err))
      .finally(() => setLoading(false));
  }, [session?.phone]);

  const familyMembers = profile?.familyMembers || [];

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
                Registered gotram and birth stars in MongoDB used across all your Yajna offerings
              </p>
            </div>
            <Link href="/account/profile">
              <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10 text-xs" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                Edit Profile
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
              <p className="text-xs text-gold-light">Loading Sankalpam Profile from MongoDB...</p>
            </div>
          ) : (
            <>
              {/* Primary Devotee Card */}
              <Card variant="gold-border" className="p-6 space-y-4">
                <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                  Primary Devotee
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-ivory/50 block">Name:</span>
                    <strong className="text-ivory text-sm">{profile?.fullName || 'Sacred Devotee'}</strong>
                  </div>
                  <div>
                    <span className="text-ivory/50 block">Gotram:</span>
                    <strong className="text-gold-light text-sm">{profile?.gotram || 'Not Provided'}</strong>
                  </div>
                  <div>
                    <span className="text-ivory/50 block">Janma Star / Rasi:</span>
                    <strong className="text-gold-light text-sm">
                      {profile?.nakshatra || 'Not Provided'}{profile?.rasi ? ` (${profile.rasi})` : ''}
                    </strong>
                  </div>
                </div>
              </Card>

              {/* Family Members Cards */}
              <div className="space-y-4">
                <h3 className="font-cinzel text-lg font-bold text-gold-light">
                  Registered Family Members for Sankalpam ({familyMembers.length})
                </h3>

                {familyMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {familyMembers.map((fm: any, idx: number) => (
                      <Card key={fm.id || idx} variant="sacred" className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-cinzel text-base font-bold text-ivory">
                            {fm.name}
                          </h4>
                          <Badge variant="gold" size="sm">
                            {fm.relation || 'Family'}
                          </Badge>
                        </div>
                        <div className="text-xs text-ivory/75">
                          Nakshatra: <strong className="text-gold-lighter">{fm.nakshatra || 'Sarva'}</strong> • Rasi: <strong className="text-gold-lighter">{fm.rasi || ''}</strong>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center space-y-2 bg-[#1A0004] border-gold/20">
                    <p className="text-xs text-ivory/70">No additional family members registered yet.</p>
                    <Link href="/account/profile">
                      <Button variant="gold" size="sm" className="text-xs font-bold mt-1">
                        Add Family Members
                      </Button>
                    </Link>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
