import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function MobileLayout() {
  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto pb-[72px]">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
