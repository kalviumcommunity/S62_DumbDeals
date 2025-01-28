import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/user-router/users")
      .then((response) => response.json())
      .then((data) => setUsers(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="users-page bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto">
        <h1 className="users-title text-4xl font-bold text-black text-center mb-8">
          User Leaderboard
        </h1>
        <div className="users-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.length > 0 ? (
            users.map((user, index) => (
              <UserCard key={index} user={user} rank={index + 1} />
            ))
          ) : (
            <p className="text-black text-center col-span-full">
              No users found. Keep exploring!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
