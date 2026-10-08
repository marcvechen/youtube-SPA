import { Modal, Input, Select, Typography, Slider } from "antd";

function SavedSearchModal({ open, title, item, onChange, onCancel, onOk }) {
  const { Text } = Typography;

  return (
    <Modal
      title={title}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <Text>Query</Text>
          <Input disabled placeholder={item?.query} />
        </div>
        <div>
          {" "}
          <Text>Title</Text>
          <Input
            value={item?.title}
            onChange={(e) => onChange({ ...item, title: e.target.value })}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>Sorting</Text>
          <Select
            value={item?.order}
            onChange={(e) => onChange({ ...item, order: e })}
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
            value={item?.maxResult}
            onChange={(count) => onChange({ ...item, maxResult: count })}
            max={50}
          />
        </div>
      </div>
    </Modal>
  );
}
export default SavedSearchModal;
