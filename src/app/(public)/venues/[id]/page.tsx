import ClientPage from './client-page';
export function generateStaticParams() { return [{ id: 'venue-1' }]; }
export default function Page({ params }: { params: Promise<{ id: string }> }) { return <ClientPage params={params} />; }
