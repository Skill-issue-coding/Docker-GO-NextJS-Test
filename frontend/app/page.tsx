"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCard } from "@/components/usercard";

import axios from "axios"
import { SquareArrowUpRight } from "lucide-react";
import Link from "next/link";
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
      <div>
        <Link href={"https://github.com/Skill-issue-coding/Docker-GO-NextJS-Test"} target="_blank">
          <Button className="flex justify-center items-center gap-3 text-base cursor-pointer" variant={"outline"}>
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="fill-foreground size-6 aspect-square">
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Check out the repository
            <SquareArrowUpRight className="text-foreground/40 size-4" />
          </Button>
        </Link>
      </div>
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
