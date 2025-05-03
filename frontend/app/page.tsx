"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCard } from "@/components/usercard";

import axios from "axios"
import { useEffect, useState } from "react";

export interface User extends UserInput {
  id: number;
}

export type UserInput = {
  name: string;
  email: string;
}

export default function Home() {
  const site_url = process.env.NEXT_PUBLIC_SITE_URL;
  const api_path = process.env.NEXT_PUBLIC_API_URL;
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<UserInput>({ name: '', email: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${api_path}`);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, [site_url, api_path])

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api_path}`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  }

  return (
    <>
      <div className="w-3/5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>GO Backend</CardTitle>
            <CardDescription>Next JS Frontend + GO + Postgres</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form className="w-1/2 flex justify-start gap-4" onSubmit={createUser}>
              <Input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
              <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              <Button type="submit">Create User</Button>
            </form>
            <Table>
              <TableCaption>Number of users: {users.length}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.sort((userA, userB) => userA.id - userB.id).map((user) => (
                  <UserCard user={user} setUsers={setUsers} users={users} key={user.id} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
