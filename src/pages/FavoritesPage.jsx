import { Button, List } from "antd";
import { useNavigate } from "react-router";
import { selectEmail } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  loadSavedSearches,
  deleteSavedSearch,
  changeSavedSearch,
  selectList,
} from "../redux/savedSearchesSlice";
import SavedSearchModal from "../сomponents/SavedSearchModal";
import Header from "../сomponents/Header";
import "../style/MainPage.css";
import { getVideos, setSearchQuery } from "../redux/videosSlice";

function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const email = useSelector(selectEmail);
  const list = useSelector(selectList);
  useEffect(() => {
    dispatch(loadSavedSearches(email));
  }, [dispatch, email]);

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

  return (
    <div className="mainDiv">
      <div className="innerDiv">
        <div className="header">
          <Header activeKey={"2"} />
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
                  onClick={() => dispatch(deleteSavedSearch({ id: item.id }))}
                >
                  ❌
                </Button>
                <Button onClick={() => showModal(item)}>✏️</Button>
                <Button onClick={() => handleRun(item)}>✅</Button>
              </div>
            </List.Item>
          )}
        />

        <SavedSearchModal
          open={isModalOpen}
          onChange={setEditingItem}
          onOk={handleOk}
          onCancel={handleCancel}
          title={"Modify query"}
          item={editingItem}
        />
      </div>
    </div>
  );
}
export default FavoritesPage;
