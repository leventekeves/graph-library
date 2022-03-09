import { useEffect, useState } from "react";

import AdminUserList from "./AdminUserList";
import LoadingSpinner from "../../utility/LoadingSpinner";

async function getUsers() {
  const response = await fetch("/user");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch users.");
  }
  return data;
}

const AdminManageUsers = () => {
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    getUsers().then((data) => {
      const transformedUsers = [];
      for (const key in data) {
        const userObj = {
          id: key,
          ...data[key],
        };

        transformedUsers.push(userObj);
      }
      if (isActive) {
        setUsers(transformedUsers);
        setIsLoading(false);
      }
    });
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div>
      {isLoading ? <LoadingSpinner /> : <AdminUserList users={users} />}
    </div>
  );
};

export default AdminManageUsers;
