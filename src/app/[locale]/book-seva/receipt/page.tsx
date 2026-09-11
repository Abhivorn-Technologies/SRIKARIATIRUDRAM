import { redirect } from '@/i18n/routing';

export default function BookSevaReceiptDefaultPage({ params: { locale } }: { params: { locale: string } }) {
  redirect({ href: '/book-seva', locale });
}
