import { Button, Input, Tabs, Flex, Typography } from "antd";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import "../style/MainPage.css";
import {
  getVideos,
  setSearchQuery,
  selectVideo,
  selectSearchQuery,
} from "../redux/videosSlice";
import SavedSearchModal from "../сomponents/SavedSearchModal";
import Header from "../сomponents/Header";
import { addSavedSearch } from "../redux/savedSearchesSlice";

function MainPage() {
  const [isGrid, setIsGrid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { Search } = Input;
  const { Paragraph } = Typography;

  const dispatch = useDispatch();

  const video = useSelector(selectVideo);
  const searchQuery = useSelector(selectSearchQuery);

  const hadleFavorites = () => {
    setIsModalOpen(true);
    setEditingItem({
      query: searchQuery,
      title: "",
      maxResult: 12,
      order: "relevance",
    });
  };
  const handleOk = () => {
    if (editingItem.title.trim().length > 0) {
      dispatch(
        addSavedSearch({
          id: crypto.randomUUID(),
          query: editingItem.query,
          title: editingItem.title,
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
          <Header activeKey={"1"} />
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
        <SavedSearchModal
          open={isModalOpen}
          onChange={setEditingItem}
          onOk={handleOk}
          onCancel={handleCancel}
          title={"Add query"}
          item={editingItem}
        />
      </div>
    </div>
  );
}
export default MainPage;
