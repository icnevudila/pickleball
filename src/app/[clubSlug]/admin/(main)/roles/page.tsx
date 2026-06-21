"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PermissionNode {
  key: string;
  label: string;
  description: string;
  isRisky: boolean;
}

interface RolePermissions {
  id: string;
  name: string;
  description: string;
  isSystem: boolean; // cannot archive/delete system roles
  permissions: Record<string, boolean>; // permission key -> allowed
}

const permissionNodes: PermissionNode[] = [
  { key: "refund_bookings", label: "Refund Bookings / Charges", description: "Trigger credit delta top-ups or override invoices.", isRisky: true },
  { key: "edit_cancellation", label: "Edit Cancellation Policies", description: "Change grace periods, refund windows, and no-show fees.", isRisky: true },
  { key: "pos_inventory_override", label: "POS Inventory Overrides", description: "Bypass stock limits when selling water, rackets, etc.", isRisky: false },
  { key: "manage_courts", label: "Manage Court Status & Block", description: "Toggle courts offline or log maintenance blocks.", isRisky: false },
  { key: "view_audit_logs", label: "View System Audit Logs", description: "Track cashier activity and configuration history.", isRisky: true },
];

const defaultRoles: RolePermissions[] = [
  {
    id: "owner",
    name: "Club Owner",
    description: "Full access to all systems. Owner permissions cannot be modified.",
    isSystem: true,
    permissions: {
      refund_bookings: true,
      edit_cancellation: true,
      pos_inventory_override: true,
      manage_courts: true,
      view_audit_logs: true,
    },
  },
  {
    id: "manager",
    name: "Club Manager",
    description: "Standard administrative controls with complete ledger visibility.",
    isSystem: true,
    permissions: {
      refund_bookings: true,
      edit_cancellation: false,
      pos_inventory_override: true,
      manage_courts: true,
      view_audit_logs: true,
    },
  },
  {
    id: "reception",
    name: "Front Desk Staff",
    description: "Daily queue flow controls, product sales, and check-ins.",
    isSystem: true,
    permissions: {
      refund_bookings: false,
      edit_cancellation: false,
      pos_inventory_override: true,
      manage_courts: true,
      view_audit_logs: false,
    },
  },
  {
    id: "coach",
    name: "Session Coach",
    description: "Attendance listing and session drills manager.",
    isSystem: true,
    permissions: {
      refund_bookings: false,
      edit_cancellation: false,
      pos_inventory_override: false,
      manage_courts: false,
      view_audit_logs: false,
    },
  },
];

export default function AdminRolesPage() {
  const params = useParams();
  const clubSlug = (params?.clubSlug as string) || "kadikoy";

  const [toastMessage, setToastMessage] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  // Stateful Roles
  const [roles, setRoles] = React.useState<RolePermissions[]>([]);
  // Working draft state to support save/discard flow
  const [workingRoles, setWorkingRoles] = React.useState<RolePermissions[]>([]);

  // Modals state
  const [showAddModal, setShowAddModal] = React.useState(false);

  // Form State
  const [newRoleName, setNewRoleName] = React.useState("");
  const [newRoleDesc, setNewRoleDesc] = React.useState("");
  const [cloneBaseRoleId, setCloneBaseRoleId] = React.useState("reception");

  // Load from localStorage or set defaults
  React.useEffect(() => {
    const rolesKey = `pickle_roles_permissions_${clubSlug}`;
    const stored = localStorage.getItem(rolesKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRoles(parsed);
        setWorkingRoles(JSON.parse(JSON.stringify(parsed))); // deep copy
      } catch (e) {
        setRoles(defaultRoles);
        setWorkingRoles(JSON.parse(JSON.stringify(defaultRoles)));
      }
    } else {
      setRoles(defaultRoles);
      setWorkingRoles(JSON.parse(JSON.stringify(defaultRoles)));
      localStorage.setItem(rolesKey, JSON.stringify(defaultRoles));
    }
  }, [clubSlug]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const logAudit = (actionType: string, details: string) => {
    const newLog = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      user: "Manager Ece",
      action: `${actionType}: ${details}`,
    };
    try {
      const logsKey = `pickle_audit_logs_${clubSlug}`;
      const existing = localStorage.getItem(logsKey);
      const logs = existing ? JSON.parse(existing) : [];
      logs.unshift(newLog);
      localStorage.setItem(logsKey, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  };

  // Check if there are changes pending save
  const hasChanges = React.useMemo(() => {
    return JSON.stringify(roles) !== JSON.stringify(workingRoles);
  }, [roles, workingRoles]);

  // Handle matrix checkbox toggle
  const handleCheckboxToggle = (roleId: string, permissionKey: string) => {
    // Prevent modifying Owner access to prevent self-locking
    if (roleId === "owner") {
      triggerToast("Owner permission nodes are locked by the system policy.");
      return;
    }

    const updated = workingRoles.map((r) => {
      if (r.id === roleId) {
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [permissionKey]: !r.permissions[permissionKey],
          },
        };
      }
      return r;
    });
    setWorkingRoles(updated);
  };

  // ROLE-001: Save changes
  const handleSavePermissions = () => {
    // Additional Guard: Make sure at least one permission remains for each role
    for (const r of workingRoles) {
      const activeCount = Object.values(r.permissions).filter(Boolean).length;
      if (activeCount === 0) {
        triggerToast(`Role "${r.name}" must have at least one active permission.`);
        return;
      }
    }

    setRoles(workingRoles);
    const rolesKey = `pickle_roles_permissions_${clubSlug}`;
    localStorage.setItem(rolesKey, JSON.stringify(workingRoles));

    logAudit("permissions.updated", "Saved permissions matrix update across staff roles");
    triggerToast("Permissions updated. New access rules are active.");
  };

  const handleDiscardChanges = () => {
    setWorkingRoles(JSON.parse(JSON.stringify(roles)));
    triggerToast("Discarded unsaved matrix changes.");
  };

  // ROLE-002: Add custom role
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRoleName.trim()) {
      triggerToast("Role name is required.");
      return;
    }

    const nameExists = roles.some((r) => r.name.toLowerCase() === newRoleName.trim().toLowerCase());
    if (nameExists) {
      triggerToast("A role with this name already exists.");
      return;
    }

    // Find base permissions to clone from
    const baseRole = roles.find((r) => r.id === cloneBaseRoleId);
    const clonedPermissions = baseRole ? { ...baseRole.permissions } : {};

    const newRole: RolePermissions = {
      id: `role-${Date.now()}`,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || "Custom staff role",
      isSystem: false,
      permissions: clonedPermissions,
    };

    const updated = [...roles, newRole];
    setRoles(updated);
    setWorkingRoles(JSON.parse(JSON.stringify(updated)));
    const rolesKey = `pickle_roles_permissions_${clubSlug}`;
    localStorage.setItem(rolesKey, JSON.stringify(updated));

    logAudit("role.created", `Created custom staff role "${newRole.name}" cloned from "${baseRole?.name || "reception"}"`);
    triggerToast("Custom role created. Assign it to staff from the team page.");
    setShowAddModal(false);
    setNewRoleName("");
    setNewRoleDesc("");
  };

  return (
    <div className="w-full text-[#3a312a]">
      <style dangerouslySetInnerHTML={{ __html: `
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
          background: #211b16;
          color: #fffaf4;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.2s ease;
          pointer-events: none;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(33, 27, 22, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 16px;
        }
        .modal-content {
          background: #fffaf4;
          border: 1px solid #e2d3c4;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(33,27,22,0.18);
        }
        .matrix-table {
          width: 100%;
          border-collapse: collapse;
        }
        .matrix-th {
          border-bottom: 2px solid #e2d3c4;
          padding: 12px 8px;
          font-weight: 800;
          text-align: center;
        }
        .matrix-td {
          border-bottom: 1px solid #e2d3c4;
          padding: 12px 8px;
          text-align: center;
        }
      ` }} />

      {/* Toast Notification */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        {toastMessage}
      </div>

      {/* Page Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 border-b border-[#e2d3c4] pb-5 mb-4 text-left">
        <div className="space-y-1">
          <div className="text-[11px] text-[#9d3d25] uppercase tracking-[0.07em] font-extrabold">Pickle Pulse</div>
          <h1 className="text-2xl font-extrabold tracking-[-0.035em] text-[#211b16]">Roles & Permissions Matrix</h1>
          <p className="text-sm text-[#756a61] mt-1.5">
            Configure role-based access control policies, protect financial overrides, and create custom staff profiles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 border-[#d1bdae] bg-[#fffaf4] hover:bg-[#fff6ef] text-[#3a312a] rounded-[9px] text-xs font-semibold"
            onClick={handleDiscardChanges}
            disabled={!hasChanges}
          >
            Discard Changes
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="h-8 bg-[#d95b35] border-[#d95b35] hover:bg-[#c94f2f] text-white rounded-[9px] text-xs font-semibold px-3"
            onClick={() => setShowAddModal(true)}
          >
            Add Custom Role
          </Button>
        </div>
      </section>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 w-full items-start text-left">
        
        {/* Left Side: Permissions Matrix */}
        <div className="space-y-4 min-w-0">
          
          {/* Matrix Card */}
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[16px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden p-6">
            <h2 className="text-lg font-extrabold mb-4">RBAC Permission Matrix Grid</h2>
            
            <div className="overflow-x-auto">
              <table className="matrix-table text-xs text-left">
                <thead>
                  <tr>
                    <th className="matrix-th text-slate-700 w-[200px]">Permission Node / Risk</th>
                    {workingRoles.map((role) => (
                      <th key={role.id} className="matrix-th text-center">
                        <div className="font-bold text-[#211b16]">{role.name}</div>
                        {!role.isSystem && (
                          <span className="text-[9px] text-slate-500 font-normal uppercase block mt-0.5">(Custom)</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionNodes.map((node) => (
                    <tr key={node.key} className="hover:bg-slate-50/50">
                      <td className="matrix-td py-3.5 pr-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          {node.label}
                          {node.isRisky && (
                            <span className="bg-red-50 text-red-700 border border-red-200 text-[8px] font-black px-1 py-0.2 rounded uppercase">
                              RISKY
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{node.description}</div>
                      </td>
                      {workingRoles.map((role) => {
                        const allowed = role.permissions[node.key] || false;
                        const isOwner = role.id === "owner";
                        return (
                          <td key={role.id} className="matrix-td text-center">
                            <input
                              type="checkbox"
                              checked={allowed}
                              disabled={isOwner}
                              onChange={() => handleCheckboxToggle(role.id, node.key)}
                              className={`w-4.5 h-4.5 cursor-pointer accent-[#d95b35] ${
                                isOwner ? "opacity-60 cursor-not-allowed" : ""
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sticky Save / Discard Bar at the bottom of the card */}
            {hasChanges && (
              <div className="mt-6 p-3 bg-[#fff8e6] border border-[#ead59c] rounded-[10px] flex justify-between items-center animate-pulse">
                <span className="text-xs text-[#755308] font-bold">⚠️ Warning: Unsaved changes to the roles permission matrix will be lost on page reload.</span>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary"
                    className="h-8 border-[#d1bdae] bg-white text-xs font-semibold rounded-[8px]"
                    onClick={handleDiscardChanges}
                  >
                    Discard
                  </Button>
                  <Button 
                    variant="primary"
                    className="h-8 bg-[#d95b35] hover:bg-[#c94f2f] text-white text-xs font-semibold rounded-[8px] border-none px-4"
                    onClick={handleSavePermissions}
                  >
                    Save Permissions
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Action Rail / Role details info */}
        <aside className="space-y-3 xl:sticky xl:top-[78px]">
          <div className="bg-[#fffaf4] border border-[#e2d3c4] rounded-[14px] shadow-[0_1px_0_rgba(49,36,24,0.04)] overflow-hidden">
            <header className="p-3 border-b border-[#e2d3c4] bg-[#fffdf9]">
              <h3 className="font-extrabold text-[14px] text-[#211b16] tracking-tight">Active Staff Roles</h3>
              <p className="text-xs text-[#756a61] mt-0.5">Role definitions & description summaries</p>
            </header>
            <div className="p-3.5 space-y-3 text-xs">
              {workingRoles.map((role) => (
                <div key={role.id} className="p-2.5 rounded-[10px] border border-[#e2d3c4] bg-[#fffdf9]">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-800">{role.name}</strong>
                    {role.isSystem ? (
                      <span className="text-[9px] text-slate-400 font-bold uppercase">System Default</span>
                    ) : (
                      <span className="text-[9px] text-[#d95b35] font-bold uppercase">Custom Role</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[10px] font-semibold mt-1 leading-normal">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ROLE-002: Add Custom Role Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-[#e2d3c4] pb-2 mb-4">
              <h3 className="text-base font-extrabold text-[#211b16]">Add Custom Staff Role</h3>
              <button className="text-[#756a61] hover:text-[#211b16] font-bold text-lg" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Role Profile Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lead Coach, Front Desk Night"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Description / Scope</label>
                <input 
                  type="text" 
                  placeholder="Brief summary of duties and restrictions"
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none focus:border-[#d95b35]"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#756a61]">Clone Permissions From Base Role</label>
                <select 
                  className="h-10 border border-[#d1bdae] bg-[#fffdf9] rounded-[10px] px-3 outline-none"
                  value={cloneBaseRoleId}
                  onChange={(e) => setCloneBaseRoleId(e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#f2faf6] border border-[#c1ddce] rounded-[10px] text-xs text-[#23624f]">
                <strong>Info:</strong> Creating a custom role clones the active permission checkboxes immediately. You can tweak individual permission nodes in the matrix grid after saving.
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="btn flex-1" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 bg-[#d95b35] text-white hover:bg-[#c94f2f] rounded-[9px] font-semibold h-10">Create Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
