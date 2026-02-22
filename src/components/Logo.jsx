import React from 'react';

const Logo = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hand-drawn style house logo */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* House Outline - Hand drawn feel with rounded joins */}
                <path
                    d="M20.5 4.5C20.5 4.5 9.5 13.5 6.5 16.5C5.5 17.5 5.5 19.5 5.5 19.5V32.5C5.5 34.5 7.5 35.5 9.5 35.5H30.5C32.5 35.5 34.5 33.5 34.5 31.5V19.5C34.5 19.5 34.5 17.5 33.5 16.5C30.5 13.5 20.5 4.5 20.5 4.5Z"
                    stroke="#4a4a4a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Warm Light / Window - A cozy yellow square/circle inside */}
                <path
                    d="M16 22H24V30H16V22Z"
                    fill="#f4a261"
                    fillOpacity="0.2"
                />
                <path
                    d="M16 22H24V30H16V22Z"
                    stroke="#d4a373"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Window Pane Lines */}
                <path d="M20 22V30" stroke="#d4a373" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 26H24" stroke="#d4a373" strokeWidth="1.5" strokeLinecap="round" />

                {/* Chimney (optional, adds to house feel) */}
                <path d="M28 10V14" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1' }}>
                <span style={{
                    fontFamily: "'Noto Sans TC', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    color: '#4a4a4a',
                    letterSpacing: '0.05em'
                }}>
                    棲所
                </span>
                <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: '0.75rem',
                    color: '#8ab0ab', /* Sage green subtitle */
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginTop: '2px'
                }}>
                    The Haven
                </span>
            </div>
        </div>
    );
};

export default Logo;
