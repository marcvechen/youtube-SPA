import {
  Button,
  Input,
  Tabs,
  Flex,
  Typography,
  List,
  Modal,
  Select,
  Slider,
} from "antd";
import { useNavigate } from "react-router";
import { logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "../style/MainPage.css";
import { getVideos, setSearchQuery, clearVideos } from "../redux/videosSlice";
import { addSavedSearch } from "../redux/savedSearchesSlice";

function MainPage() {
  const [isGrid, setIsGrid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { Search } = Input;
  const { Text, Paragraph } = Typography;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { video, searchQuery, maxResult, loading, error } = useSelector(
    (state) => state.videos,
  );
  const { email } = useSelector((state) => state.auth);
  const hadleFavorites = () => {
    setIsModalOpen(true);
    setEditingItem({
      query: searchQuery,
      title: "",
      maxResult: 12,
      order: "relevance",
    });
  };
  const handleLogOut = () => {
    dispatch(logout());
    dispatch(setSearchQuery(""));
    dispatch(clearVideos());
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  const handleOk = () => {
    if (editingItem.title.trim().length > 0) {
      dispatch(
        addSavedSearch({
          query: editingItem.query,
          title: editingItem.title,
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
    if (key == 2) {
      navigate("/favorites");
    }
  };
  const items = [
    {
      key: "1",
      label: "Search",
    },
    {
      key: "2",
      label: "Favorites",
    },
  ];
  const formatViews = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return count;
  };
  return (
    <div className="mainDiv">
      <div className="innerDiv">
        <div className="header">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

          <Button onClick={handleLogOut}>Log out</Button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Search
            placeholder="Search"
            enterButton="🔍"
            size="large"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onSearch={(value) => {
              if (value.trim().length > 0) {
                dispatch(
                  getVideos({
                    query: value,
                    maxResult: 12,
                    order: "relevance",
                  }),
                );
              } else {
                alert("Please fill in all the fields");
              }
            }}
          />
          <Button onClick={hadleFavorites}>❤️</Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", margin: 10, gap: 10 }}>
            <Button
              onClick={() => {
                setIsGrid((prevState) => (prevState = true));
              }}
            >
              Grid
            </Button>
            <Button
              onClick={() => {
                setIsGrid((prevState) => (prevState = false));
              }}
            >
              Column
            </Button>
          </div>
        </div>

        <Flex
          wrap="wrap"
          gap="middle"
          className={isGrid ? "videosGrid" : "videosColumn"}
        >
          {video.map((item) => (
            <div
              key={item.id}
              style={{
                width: isGrid ? "280px" : "100%",
                display: "flex",
                flexDirection: isGrid ? "column" : "row",
                gap: "12px",
              }}
            >
              <img
                src={item.thumbnail}
                alt=""
                style={{
                  width: isGrid ? "100%" : "220px",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div>
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ marginBottom: 4, fontWeight: 600 }}
                >
                  {item.title}
                </Paragraph>
                <p style={{ margin: 0, color: "#606060", fontSize: "13px" }}>
                  {item.channelTitle}
                </p>
                <p style={{ margin: 0, color: "#606060", fontSize: "13px" }}>
                  {formatViews(item.views)} views
                </p>
              </div>
            </div>
          ))}
        </Flex>
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
              <Text>Query title</Text>
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
export default MainPage;
