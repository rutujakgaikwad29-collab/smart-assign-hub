import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Shield, Users, BookOpen, GraduationCap, Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/admin/system-admin")({
  head: () => ({ meta: [{ title: "System Dashboard — SmartAssign Pro" }] }),
  component: SystemAdminDashboard,
});

function SystemAdminDashboard() {
  const { profile, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Ensure only System Admins can view this
  useEffect(() => {
    if (role && (role !== "admin" || (profile as any)?.designation !== "System Admin")) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [role, profile, navigate]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const allUsers = usersSnap.docs.map(d => d.data());
        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching system data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const students = users.filter(u => u.role === "student");
  const teachers = users.filter(u => u.role === "teacher");
  const admins = users.filter(u => u.role === "admin");

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 p-4 rounded-2xl text-destructive">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold font-[var(--font-heading)]">System Administrator Mode</h1>
            <p className="text-sm opacity-90">You have full god-mode access to all user records across the entire database.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">{users.length}</h3>
            <p className="text-sm text-muted-foreground mt-1">Total Users</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <GraduationCap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold">{students.length}</h3>
            <p className="text-sm text-muted-foreground mt-1">Students</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold">{teachers.length}</h3>
            <p className="text-sm text-muted-foreground mt-1">Teachers</p>
          </div>
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold">{admins.length}</h3>
            <p className="text-sm text-muted-foreground mt-1">Administrators</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold font-[var(--font-heading)]">Global Master Database</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search any user..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring outline-none"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading global database...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{u.fullName}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-purple-500/10 text-purple-600' : 
                          u.role === 'teacher' ? 'bg-green-500/10 text-green-600' : 
                          'bg-blue-500/10 text-blue-600'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div>{u.email}</div>
                        <div className="text-xs">{u.mobileNumber || "No mobile"}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.department || "N/A"}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : "Unknown"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
