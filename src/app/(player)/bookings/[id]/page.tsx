import ClientPage from './client-page';
export function generateStaticParams() { return [{ id: 'BK-20260624' }]; }
export default function Page({ params }: { params: Promise<{ id: string }> }) { return <ClientPage params={params} />; }
