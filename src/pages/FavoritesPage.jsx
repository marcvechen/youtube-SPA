import {
  Button,
  Tabs,
  List,
  Modal,
  Input,
  Select,
  Typography,
  Slider,
} from "antd";
import { useNavigate } from "react-router";
import { logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  loadSavedSearches,
  deleteSavedSearch,
  changeSavedSearch,
} from "../redux/savedSearchesSlice";
import "../style/MainPage.css";
import { getVideos, setSearchQuery } from "../redux/videosSlice";

function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { Text } = Typography;
  const { email } = useSelector((state) => state.auth);
  const { list } = useSelector((state) => state.savedSearches);
  useEffect(() => {
    dispatch(loadSavedSearches(email));
  }, [dispatch, email]);
  const handleLogOut = () => {
    dispatch(logout());
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  const handleRun = (item) => {
    dispatch(setSearchQuery(item.query));
    dispatch(
      getVideos({
        query: item.query,
        maxResult: item.maxResult,
        order: item.order,
      }),
    );
    navigate("/");
  };
  const showModal = (item) => {
    setIsModalOpen(true);
    setEditingItem(item);
  };
  const handleOk = () => {
    if (editingItem.title.trim().length > 0) {
      dispatch(
        changeSavedSearch({
          id: editingItem.id,
          newTitle: editingItem.title,
          email,
          maxResult: editingItem.maxResult,
          order: editingItem.order,
        }),
      );
      setIsModalOpen(false);
      setEditingItem(null);
    } else {
      alert("Please fill in all the fields");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (key) => {
    if (key == 1) {
      navigate("/");
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
    <div className="mainDiv">
      <div className="innerDiv">
        <div className="header">
          <Tabs defaultActiveKey="2" items={tabItems} onChange={onChange} />

          <Button onClick={handleLogOut}>Log out</Button>
        </div>
        <List
          size="large"
          header={<div>Favorites</div>}
          bordered
          dataSource={list}
          renderItem={(item) => (
            <List.Item style={{ display: "flex" }}>
              {item.title}
              <div>
                <Button
                  onClick={() =>
                    dispatch(deleteSavedSearch({ id: item.id, email }))
                  }
                >
                  ❌
                </Button>
                <Button onClick={() => showModal(item)}>✏️</Button>
                <Button onClick={() => handleRun(item)}>✅</Button>
              </div>
            </List.Item>
          )}
        />

        <Modal
          title="Modify query "
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <Text>Query</Text>
              <Input disabled placeholder={editingItem?.query} />
            </div>
            <div>
              {" "}
              <Text>Title</Text>
              <Input
                value={editingItem?.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text>Sorting</Text>
              <Select
                value={editingItem?.order}
                onChange={(e) => setEditingItem({ ...editingItem, order: e })}
                options={[
                  { value: "relevance", label: "Popular" },
                  { value: "date", label: "New" },
                  { value: "viewCount", label: "Most views" },
                ]}
              />
            </div>
            <div>
              <Text>Maximum number of videos</Text>
              <Slider
                value={editingItem?.maxResult}
                onChange={(count) =>
                  setEditingItem({ ...editingItem, maxResult: count })
                }
                max={50}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
export default FavoritesPage;
