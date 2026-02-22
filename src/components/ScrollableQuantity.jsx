import React, { useRef, useEffect } from 'react';

const ScrollableQuantity = ({ quantity, setQuantity, min = 1, max = 99 }) => {
    const scrollRef = useRef(null);
    const isScrollingRef = useRef(null);
    const isProgrammaticScrollRef = useRef(false);
    
    // Generate array of options
    const options = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    
    // Add empty spaces at top and bottom so first and last items can reach exactly the middle
    const ITEM_HEIGHT = 40;
    // We want exactly 1 item visible in the middle. Container height is 40px.
    // So top and bottom padding should be 0 since the container is exactly 1 item tall.
    const PADDING_TOP = 0; 

    // Initial scroll sync
    useEffect(() => {
        if (scrollRef.current) {
            const index = options.indexOf(quantity);
            if (index !== -1) {
                isProgrammaticScrollRef.current = true;
                scrollRef.current.scrollTop = index * ITEM_HEIGHT;
                setTimeout(() => { isProgrammaticScrollRef.current = false; }, 50);
            }
        }
    }, []); 

    // Handle scroll events triggered by user swipe
    const handleScroll = (e) => {
        if (isProgrammaticScrollRef.current) return;
        
        clearTimeout(isScrollingRef.current);
        const target = e.target;
        
        isScrollingRef.current = setTimeout(() => {
            const scrollTop = target.scrollTop;
            let index = Math.round(scrollTop / ITEM_HEIGHT);
            
            // Boundary checks
            if (index < 0) index = 0;
            if (index >= options.length) index = options.length - 1;

            if (options[index] !== undefined) {
                const newValue = options[index];
                if (quantity !== newValue) {
                    setQuantity(newValue);
                }
                
                // Snap to exact position
                isProgrammaticScrollRef.current = true;
                target.scrollTo({
                    top: index * ITEM_HEIGHT,
                    behavior: 'smooth'
                });
                setTimeout(() => { isProgrammaticScrollRef.current = false; }, 300);
            }
        }, 150);
    };

    // When quantity props change externally (like clicking + or -), update scroll position
    useEffect(() => {
        if (scrollRef.current) {
            const index = options.indexOf(quantity);
            if (index !== -1) {
                const currentScrollTop = scrollRef.current.scrollTop;
                const targetScrollTop = index * ITEM_HEIGHT;
                // Only scroll if we are not already there
                if (Math.abs(currentScrollTop - targetScrollTop) > 2) {
                    isProgrammaticScrollRef.current = true;
                    scrollRef.current.scrollTo({
                        top: targetScrollTop,
                        behavior: 'smooth'
                    });
                    setTimeout(() => { isProgrammaticScrollRef.current = false; }, 300);
                }
            }
        }
    }, [quantity, options]);

    return (
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="quantity-scroll-container no-scrollbar"
            style={{ 
                height: `${ITEM_HEIGHT}px`, 
                overflowY: 'scroll', 
                scrollSnapType: 'y mandatory',
                width: '60px',
                textAlign: 'center',
                position: 'relative',
                scrollBehavior: 'smooth'
            }}
        >
            <div style={{ paddingTop: PADDING_TOP, paddingBottom: PADDING_TOP }}>
                {options.map(opt => (
                    <div 
                        key={opt}
                        onClick={() => {
                            if (quantity !== opt) {
                                setQuantity(opt);
                            }
                        }}
                        style={{
                            height: `${ITEM_HEIGHT}px`,
                            lineHeight: `${ITEM_HEIGHT}px`,
                            scrollSnapAlign: 'center',
                            fontSize: '1.2rem',
                            fontWeight: quantity === opt ? 'bold' : 'normal',
                            color: quantity === opt ? 'var(--text-primary)' : '#ccc',
                            cursor: 'pointer',
                            transition: 'color 0.2s, font-weight 0.2s',
                            userSelect: 'none'
                        }}
                    >
                        {opt}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrollableQuantity;
