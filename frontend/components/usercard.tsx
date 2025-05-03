"use client"
import { User } from "@/app/page";
import { Dispatch, SetStateAction, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";

export function UserCard({ user, setUsers, users }: { user: User; setUsers: Dispatch<SetStateAction<User[]>>; users: User[] }) {
    const [updateUser, setUpdateUser] = useState<User>({ id: user.id, name: user.name, email: user.email });
    const api_path = process.env.NEXT_PUBLIC_API_URL;

    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`${api_path}/${user.id}`, { name: updateUser.name, email: updateUser.email })
            setUsers(
                users.map((_user) => {
                    if (_user.id === updateUser.id) {
                        return { ..._user, name: updateUser.name, email: updateUser.email };
                    }
                    return _user;
                })
            )
        } catch (error) {
            console.error("Error updating user: ", error)
        }
    }

    const deleteUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.delete(`${api_path}/${user.id}`);
            setUsers(users.filter((_user) => _user.id !== user.id));
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
    }

    return (
        <TableRow>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <Dialog>
                <DialogTrigger asChild>
                    <TableCell><Button variant={"outline"}>Update User</Button></TableCell>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit user</DialogTitle>
                        <DialogDescription>
                            Edit the name or the email of user: <span className="font-bold text-foreground">{updateUser.id}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form className="flex flex-col gap-4" onSubmit={handleUpdateUser}>
                        <div className="flex flex-col gap-2">
                            <Label>Name:</Label>
                            <Input value={updateUser.name} onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Email:</Label>
                            <Input value={updateUser.email} onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })} />
                        </div>
                        <DialogFooter>
                            <DialogClose type="submit" className="inline-flex justify-center items-center bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 rounded-md text-base">Save changes</DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <TableCell><Button variant={"destructive"}>Delete User</Button></TableCell>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            You will delete user: <span className="font-bold text-foreground">{user.id} - {user.name} - {user.email}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form className="flex flex-col gap-4" onSubmit={deleteUser}>
                        <DialogFooter>
                            <DialogClose type="submit" className="inline-flex justify-center items-center bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 h-9 px-4 py-2 has-[>svg]:px-3 rounded-md text-base">Save changes</DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </TableRow>
    )
}