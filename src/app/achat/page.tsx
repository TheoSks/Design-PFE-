import { redirect } from 'next/navigation';

export default function AchatPage() {
  redirect('/recherche?mode=achat');
}
