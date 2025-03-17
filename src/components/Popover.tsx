import React, { useEffect, useRef, useState } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: string;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = 'bottom',
  width = '240px'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current && 
      !popoverRef.current.contains(event.target as Node) && 
      triggerRef.current && 
      !triggerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle popover positioning
  useEffect(() => {
    if (isOpen && popoverRef.current && triggerRef.current) {
      const updatePosition = () => {
        const popover = popoverRef.current;
        const trigger = triggerRef.current;
        if (!popover || !trigger) return;

        const popoverRect = popover.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset any previously applied styles
        popover.style.left = '';
        popover.style.right = '';
        popover.style.top = '';
        popover.style.bottom = '';

        // Determine if popover would go off-screen in its default position
        let adjustedPosition = position;
        let popoverClasses = 'absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in-up';

        // Check for horizontal overflow
        const rightOverflow = triggerRect.right + popoverRect.width > viewportWidth;
        const leftOverflow = triggerRect.left - popoverRect.width < 0;

        // Check for vertical overflow
        const bottomOverflow = triggerRect.bottom + popoverRect.height > viewportHeight;
        const topOverflow = triggerRect.top - popoverRect.height < 0;

        // Apply position classes and adjust if needed
        switch (position) {
          case 'bottom':
            if (bottomOverflow && !topOverflow) {
              adjustedPosition = 'top';
              popoverClasses += ' bottom-full mb-2';
            } else {
              popoverClasses += ' top-full mt-2';
              
              // Handle horizontal overflow when position is bottom
              if (rightOverflow) {
                popover.style.right = '0';
                popover.style.left = 'auto';
              }
            }
            break;
          case 'top':
            if (topOverflow && !bottomOverflow) {
              adjustedPosition = 'bottom';
              popoverClasses += ' top-full mt-2';
            } else {
              popoverClasses += ' bottom-full mb-2';
              
              // Handle horizontal overflow when position is top
              if (rightOverflow) {
                popover.style.right = '0';
                popover.style.left = 'auto';
              }
            }
            break;
          case 'left':
            if (leftOverflow && !rightOverflow) {
              adjustedPosition = 'right';
              popoverClasses += ' left-full ml-2';
            } else {
              popoverClasses += ' right-full mr-2';
              
              // Handle vertical overflow when position is left
              if (bottomOverflow) {
                popover.style.bottom = '0';
                popover.style.top = 'auto';
              }
            }
            break;
          case 'right':
            if (rightOverflow && !leftOverflow) {
              adjustedPosition = 'left';
              popoverClasses += ' right-full mr-2';
            } else {
              popoverClasses += ' left-full ml-2';
              
              // Handle vertical overflow when position is right
              if (bottomOverflow) {
                popover.style.bottom = '0';
                popover.style.top = 'auto';
              }
            }
            break;
        }

        // Apply the calculated classes
        popover.className = popoverClasses;
      };

      // Initial positioning
      updatePosition();

      // Update position on resize
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, position]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div 
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in-up"
          style={{ width }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;