"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserForm } from "./UserForm"
import type { User } from "@/type/user"
import { deleteUser } from "@/lib/AdminApis"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface UserTableProps {
  users: User[]
  onUserUpdated: (user: User) => void
  onUserDeleted: (userId: string) => void
}

export function UserTable({ users, onUserUpdated, onUserDeleted }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null);
  console.log(users)

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      setIsDeleting(true)
      await deleteUser(selectedUser._id)
      onUserDeleted(selectedUser._id)
      setIsDeleteDialogOpen(false)
    } catch (err) {
      setError("Failed to delete user. Please try again.")
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "destructive" : "default"}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  {user.isVerfied ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit user
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about the user.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Username:</div>
                <div className="col-span-2">{selectedUser.username}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{selectedUser.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Full Name:</div>
                <div className="col-span-2">
                  {selectedUser.firstName || selectedUser.lastName
                    ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim()
                    : "Not provided"}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Role:</div>
                <div className="col-span-2">
                  <Badge variant={selectedUser.role === "admin" ? "destructive" : "default"}>{selectedUser.role}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Verified:</div>
                <div className="col-span-2">{selectedUser.isVerfied ? "Yes" : "No"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Phone:</div>
                <div className="col-span-2">{selectedUser.phone || "Not provided"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Gender:</div>
                <div className="col-span-2">{selectedUser.gender || "Not provided"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Date of Birth:</div>
                <div className="col-span-2">{selectedUser.dob ? formatDate(selectedUser.dob) : "Not provided"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Created:</div>
                <div className="col-span-2">{formatDate(selectedUser.createdAt)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Updated:</div>
                <div className="col-span-2">{formatDate(selectedUser.updatedAt)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onUserUpdated={(updatedUser) => {
                onUserUpdated(updatedUser)
                setIsEditDialogOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </DialogContent>
      </Dialog>
    </div>
  )
}
