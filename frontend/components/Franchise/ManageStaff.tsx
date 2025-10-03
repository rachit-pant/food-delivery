'use client';
import { useEffect, useState } from 'react';
import AddStaff from './AddStaff';
import { api } from '@/api/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import AddExistingFranchise from './AddExistingFranchise';

export interface Info {
  id: number;
  staffId: number;
  franchiseId: number;
  staffRoleId: number;
  isActive: boolean;
  assignedAt: string;
  staff: Staff;
  staffRole: Role;
  franchise: Franchise;
}
export interface Franchise {
  id: number;
  userId: number;
  name: string;
  address: string | null;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: number;
  userId: number;
  fullName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  role: string;
  createdAt: string;
}

interface StaffRole {
  id: number;
  role: string;
}

const ManageStaff = () => {
  const [staff, setStaff] = useState<Info[]>([]);
  const [staffRoles, setStaffRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, rolesRes] = await Promise.all([
          api.get('/franchise/getAllStaff'),
          api.get('/franchise/getStaffRoles'),
        ]);

        console.log('staff', staffRes.data);
        console.log('staffRoles', rolesRes.data);

        setStaff(staffRes.data);
        setStaffRoles(rolesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (id: number, roleId: string) => {
    console.log('Updating staff:', id, 'to role:', roleId);
    try {
      const response = await api.post(`/franchise/updateRole`, {
        franchiseStaffId: id,
        roleId: Number(roleId),
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleRemove = async (id: number) => {
    console.log('Removing staff:', id);
    try {
      const response = await api.delete(
        `/franchise/deleteFranchiseStaff/${id}`
      );
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error removing staff:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCurrentRoleName = (roleId: number) => {
    const role = staffRoles.find((r) => r.id === roleId);
    return role?.role || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Staff
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your franchise team members and permissions
            </p>
          </div>
          <AddStaff />
          <AddExistingFranchise />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">Loading staff...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No staff members found
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {staff.map((item, index) => (
              <div
                key={item.id}
                className={`group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50 ${
                  index !== staff.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {getInitials(item.staff.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-medium text-foreground">
                      {item.staff.fullName}
                    </h3>
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.isActive ? 'bg-green-500' : 'bg-muted-foreground'
                      }`}
                    />
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-mono text-xs"
                >
                  {getCurrentRoleName(item.staffRole.id)}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-mono text-xs"
                >
                  {item.franchise.name}
                </Badge>

                <div className="w-44">
                  <Select
                    onValueChange={(value) => handleRoleChange(item.id, value)}
                  >
                    <SelectTrigger className="h-8 border-border bg-background text-xs font-mono">
                      <SelectValue placeholder="Change role" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffRoles.map((role) => (
                        <SelectItem
                          key={role.id}
                          value={role.id.toString()}
                          className="font-mono text-xs"
                        >
                          {role.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-16 text-center">
                  <span
                    className={`text-xs ${
                      item.isActive ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    {item.isActive ? 'Working' : 'Not Working'}
                  </span>
                </div>

                <div className="w-24 text-right">
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatDate(item.assignedAt)}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:cursor-pointer "
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStaff;
