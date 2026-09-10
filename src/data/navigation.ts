export interface NavItem {
  key: string;
  href: string;
  badge?: string;
  icon?: string;
  children?: Array<{
    key: string;
    href: string;
    descriptionKey?: string;
  }>;
}

export const mainNavigation: NavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "schedule", href: "/schedule" },
  { key: "sevas", href: "/sevas" },
  { key: "annadanam", href: "/annadanam" },
  { key: "live", href: "/live", badge: "LIVE" },
  { key: "gallery", href: "/gallery" },
  { key: "donate", href: "/donate" },
  { key: "contact", href: "/contact" }
];

export const mobileBottomNavItems: NavItem[] = [
  { key: "home", href: "/", icon: "Home" },
  { key: "schedule", href: "/schedule", icon: "Calendar" },
  { key: "sevas", href: "/sevas", icon: "Flame" },
  { key: "live", href: "/live", icon: "Radio", badge: "LIVE" },
  { key: "account", href: "/account", icon: "User" }
];
