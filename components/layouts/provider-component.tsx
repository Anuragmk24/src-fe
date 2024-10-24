'use client';
import App from '@/App';
import store from '@/store';
import { Provider } from 'react-redux';
import React, { ReactNode, Suspense } from 'react';
import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';
import Loading from '@/components/layouts/loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import TanStack Query
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
// import './layout.css';
interface IProps {
    children?: ReactNode;
}
const queryClient = new QueryClient();

const ProviderComponent = ({ children }: IProps) => {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
            {/* <MantineProvider 
            theme={{ colorScheme: 'light' }}
             withGlobalStyles withNormalizeCSS> */}

                <Suspense fallback={<Loading />}>
                    <App>{children} </App>
                </Suspense>
                {/* </MantineProvider> */}

            </QueryClientProvider>
        </Provider>
    );
};

export default ProviderComponent;
