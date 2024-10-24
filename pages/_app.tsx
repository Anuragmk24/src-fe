import { AppProps } from 'next/app';
import '@/styles/tailwind.css';
import '@/styles/animate.css';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
