import React from 'react';

export const Logo = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="130"
                height="40"
                viewBox="0 0 130 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
            >
                {/* A */}
                <path d="M10 35L20 5L30 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 25H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

                {/* X (Stylized) */}
                <path d="M40 5C40 5 45 5 48 12C51 19 55 28 60 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M60 5C60 5 55 5 52 12C49 19 45 28 40 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

                {/* O */}
                <circle cx="78" cy="20" r="13" stroke="currentColor" strokeWidth="3" />

                {/* L */}
                <path d="M100 7V33H112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* O */}
                <path d="M135 20C135 27.1797 129.18 33 122 33C114.82 33 109 27.1797 109 20C109 12.8203 114.82 7 122 7C129.18 7 135 12.8203 135 20Z" stroke="currentColor" strokeWidth="3" />

                {/* T */}
                <path d="M125 7H145M135 7V33" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
};

export const LogoCompact = ({ className = "" }: { className?: string }) => {
    return (
        <svg
            width="150"
            height="40"
            viewBox="0 0 150 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path d="M12 32L19 10L26 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 24H24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

            {/* Scaled X */}
            <path d="M36 10L48 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M48 10L36 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

            {/* O */}
            <rect x="55" y="10" width="18" height="22" rx="6" stroke="currentColor" strokeWidth="2.5" />

            {/* L */}
            <path d="M82 10V32H92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* O */}
            <rect x="100" y="10" width="18" height="22" rx="6" stroke="currentColor" strokeWidth="2.5" />

            {/* T */}
            <path d="M126 10H144" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M135 10V32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    )
}
