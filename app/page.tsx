import Link from 'next/link';


export default function Home() {
  return (
    <main>
      <Link href="/products" className="text-blue-600 underline">Go to Product Catalog</Link>
    </main>
  );
}
