"use client";
import { useState, useEffect } from "react";
import { Table } from "@/components/LayoutComponents";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

export const ExampleTable = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Lee",
      email: "charlie@example.com",
      role: "Editor",
    },
    { id: 4, name: "Dana White", email: "dana@example.com", role: "User" },
    {
      id: 5,
      name: "Ethan Brown",
      email: "ethan@example.com",
      role: "Moderator",
    },
    { id: 6, name: "Fiona Black", email: "fiona@example.com", role: "User" },
    { id: 7, name: "George Young", email: "george@example.com", role: "Admin" },
  ]);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(() => {
  //   fetch(`/api/users?page=${page}`)
  //     .then((res) => res.json())
  //     .then(({ users, totalPages }) => {
  //       setData(users);
  //       setTotalPages(totalPages);
  //     });
  // }, [page]);

  return (
    <Table
      data={data}
      columns={columns}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
};
