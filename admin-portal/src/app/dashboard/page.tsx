export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Users</span>
          <span className="text-4xl font-bold text-slate-900 mt-2">1,248</span>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Orders</span>
          <span className="text-4xl font-bold text-slate-900 mt-2">42</span>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
          <span className="text-4xl font-bold text-slate-900 mt-2">15,890</span>
        </div>
      </div>
    </div>
  );
}