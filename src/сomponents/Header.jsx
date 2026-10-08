import { Button, Tabs } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { setSearchQuery } from "../redux/videosSlice";
import { clearVideos } from "../redux/videosSlice";
function Header({ activeKey }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logout());
    dispatch(setSearchQuery(""));
    dispatch(clearVideos());
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  const handleTabChange = (key) => {
    if (key == 1) {
      navigate("/");
    } else {
      navigate("/favorites");
    }
  };
  const tabItems = [
    {
      key: "1",
      label: "Search",
    },
    {
      key: "2",
      label: "Favorites",
    },
  ];
  return (
    <>
      <Tabs
        defaultActiveKey={activeKey}
        items={tabItems}
        onChange={handleTabChange}
      />

      <Button onClick={handleLogOut}>Log out</Button>
    </>
  );
}
export default Header;
