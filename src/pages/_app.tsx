import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#603cba" />
      <meta name="theme-color" content="#ffffff" />

      <header className={`py-4 px-2 flex flex-grow justify-evenly ${inter.className}`}>
        <Link href='/'>#</Link>
        <Link href='/vods/finished'>Finished Vods</Link>
        <Link href='/vods/submit'>Submit Vod</Link>
      </header>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </>
  )
}