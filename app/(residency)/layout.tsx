import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Setting from '@/components/layouts/setting';
import Portals from '@/components/portals';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import { MantineProvider } from '@mantine/core';
import ResidencySidebar from '@/components/layouts/ResidencySidebar';
import ResidencyHeader from '@/components/layouts/ResidencyHeader';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* BEGIN MAIN CONTAINER */}
            <div className="relative">

            <MantineProvider >

                <Overlay />
                <ScrollToTop />

                {/* BEGIN APP SETTING LAUNCHER */}
                <Setting />
                {/* END APP SETTING LAUNCHER */}

                <MainContainer>
                    {/* BEGIN SIDEBAR */}
                    <ResidencySidebar />
                    {/* END SIDEBAR */}
                    <div className="main-content flex min-h-screen flex-col">
                        {/* BEGIN TOP NAVBAR */}
                        <ResidencyHeader />
                        {/* END TOP NAVBAR */}

                        {/* BEGIN CONTENT AREA */}
                        <ContentAnimation>{children}</ContentAnimation>
                        {/* END CONTENT AREA */}

                        {/* BEGIN FOOTER */}
                        <Footer />
                        {/* END FOOTER */}
                        <Portals />
                    </div>
                </MainContainer>
                </MantineProvider>

            </div>
        </>
    );
}
