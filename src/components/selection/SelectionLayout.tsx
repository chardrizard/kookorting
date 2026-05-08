
import { ReactNode } from 'react';
import Header from '@/components/Header';

interface SelectionLayoutProps {
  children: ReactNode;
}

const SelectionLayout = ({ children }: SelectionLayoutProps) => {
  return (
    <div className="min-h-screen bg-nature-background">
      <Header />
      
      <main className="w-full pt-24 pb-24">
        <div className="mx-auto px-4 sm:px-6 w-full md:w-[70%] max-w-[1200px] min-w-[min(800px,100%)] space-y-10 sm:space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SelectionLayout;
