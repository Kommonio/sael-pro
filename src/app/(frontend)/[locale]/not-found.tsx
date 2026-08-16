import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="site-shell py-32">
      <h1 className="type-display">404</h1>
      <p className="mt-6 type-lede">This room is empty.</p>
      <Link href="/" className="mt-8 inline-block type-meta">
        Home
      </Link>
    </div>
  )
}
