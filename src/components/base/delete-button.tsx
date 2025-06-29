import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import React from "react";

interface DeleteButtonProps {
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  return (
    <Popconfirm
      title="确定要删除吗?"
      onConfirm={onDelete}
      okText="确定"
      cancelText="取消"
    >
      <button
        type="button"
        className="flex items-center gap-1 text-red-500 text-[12px] btn-remove"
      >
        <DeleteOutlined className="w-3 h-3" />
        删除
      </button>
    </Popconfirm>
  );
};

export default DeleteButton;

