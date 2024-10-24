'use client';
import { IRootState } from '@/store';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProviderComponent from './provider-component';

const ContentAnimation = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [animation, setAnimation] = useState(themeConfig.animation);

    useEffect(() => {
        setAnimation(themeConfig.animation);
    }, [themeConfig.animation]);

    useEffect(() => {
        setAnimation(themeConfig.animation);
        setTimeout(() => {
            setAnimation('');
        }, 1100);
    }, [pathname]);
    return (
        <>
            {/* BEGIN CONTENT AREA */}
            <ProviderComponent>
                <div className={`${animation} animate__animated p-6`}>{children}</div>
            </ProviderComponent>
            {/* END CONTENT AREA */}
        </>
    );
};

export default ContentAnimation;
