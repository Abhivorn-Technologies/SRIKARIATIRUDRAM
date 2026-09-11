import { redirect } from '@/i18n/routing';

export default function BookSevaSubstepPage({ params: { locale } }: { params: { locale: string } }) {
  redirect({ href: '/book-seva', locale });
}
