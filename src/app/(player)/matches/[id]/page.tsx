import ClientPage from './client-page';
export function generateStaticParams() { return [{ id: 'match-01' }]; }
export default function Page() { return <ClientPage />; }
