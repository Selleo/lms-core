import { useLayoutEffect } from "react";

const Dashboard = () => {
  useLayoutEffect(() => {
    window.location.replace("/admin/resources/users");
  }, []);
  return null;
};

export default Dashboard;
