import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-[100dvh] bg-slate-50 w-full font-sans">
      <Sidebar />
      <main className="flex-1 lg:h-screen lg:overflow-y-auto pt-16 lg:pt-0 relative w-full overflow-x-hidden">
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
