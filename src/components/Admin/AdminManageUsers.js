import { useEffect, useState } from "react/cjs/react.development";
import AdminUserList from "./AdminUserList";

async function getUsers() {
  const response = await fetch(
    "https://graph-library-kl-default-rtdb.europe-west1.firebasedatabase.app/Users.json"
  );
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
    getUsers().then((data) => {
      const transformedUsers = [];
      for (const key in data) {
        const userObj = {
          id: key,
          ...data[key],
        };

        transformedUsers.push(userObj);
      }
      setUsers(transformedUsers);
      setIsLoading(false);
    });
  }, []);

  return <div>{isLoading ? "Yo" : <AdminUserList users={users} />}</div>;
};

export default AdminManageUsers;
