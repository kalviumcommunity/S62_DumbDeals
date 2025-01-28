/* eslint-disable react/prop-types */
const UserCard = ({ user, rank }) => {
    return (
      <div className="user-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center space-x-4 mb-4">
          <span className="rank-badge bg-black text-white text-lg font-bold rounded-full h-12 w-12 flex items-center justify-center">
            #{rank}
          </span>
          <h2 className="text-xl font-bold text-black">{user.username}</h2>
        </div>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p className="text-gray-500 text-sm mb-1">
          <span className="font-medium">Created:</span>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
        <p className="text-gray-500 text-sm">
          <span className="font-medium">Updated:</span>{" "}
          {new Date(user.updatedAt).toLocaleString()}
        </p>
      </div>
    );
  };
  
  export default UserCard;
  