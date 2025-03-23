/* eslint-disable react/prop-types */
const UserCard = ({ user, rank, onDelete, onUpdate }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="bg-black text-white text-lg font-bold rounded-full h-10 w-10 flex items-center justify-center">
            #{rank}
          </span>
          <h2 className="text-xl font-semibold text-black">{user.name}</h2> 
        </div>
      </div>
      <p className="text-gray-700 text-base mb-2"> 
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <div className="flex justify-between mt-4">
        <button
          onClick={onUpdate}
          className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-500 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;