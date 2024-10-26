import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Header from '@/components/user/Header';
import Footer from '@/components/user/Footer';
import Carousal from '@/components/user/Carousal';
import Gallery from '@/components/user/Gallery';
import LocaltionMap from '@/components/user/LocaltionMap';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
    title: {
        template: '%s | VRISTO - Multipurpose Tailwind Dashboard Template',
        default: 'VRISTO - Multipurpose Tailwind Dashboard Template',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <Header />

                <ProviderComponent>{children}</ProviderComponent>
                <div className="grid grid-cols-1 sm:grid-cols-2  p-1   dark:bg-white">
                    <div className="h-full">
                        <LocaltionMap />
                    </div>
                    <div className="flex ">
                        <Gallery />
                    </div>
                </div>
                <Footer />
            </body>
            <Toaster position="bottom-right" />
        </html>
    );
}
