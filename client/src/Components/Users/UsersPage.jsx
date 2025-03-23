import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = () => {
    fetch("http://localhost:8080/user-router")
      .then((response) => response.json())
      .then((data) => setUsers(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`http://localhost:8080/user-router/${id}`, { method: "DELETE" });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  
  return (
    <div className="users-page bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-black text-center mb-8">User Leaderboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.length > 0 ? (
            users.map((user, index) => (
              <UserCard 
                key={user.id} 
                user={user} 
                rank={index + 1} 
                onDelete={handleDelete} 
                onUpdate={() => navigate(`/update-user/${user.id}`)} 
              />
            ))
          ) : (
            <p className="text-black text-center col-span-full">No users found. Keep exploring!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;