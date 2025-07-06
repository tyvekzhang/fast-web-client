'use client';
import { message } from '@/components/GlobalToast';
import UndoComp from '@/components/Undo';
import { fetchRoleByPage } from '@/service/role';
import {
  userAdd,
  userBatchModify,
  userBatchRemove,
  userExport,
  userImport,
  userModify,
  userRecover,
  userRemove,
  users,
} from '@/service/user';
import { assignUserRole } from '@/service/user-role';
import { RolePage } from '@/types/role';
import {
  UserAdd,
  UserBatchModify,
  UserModify,
  UserQuery,
  UserQueryForm,
  UserRoleAssign,
} from '@/types/user';
import {
  Button,
  Card,
  Form,
  Pagination,
  Popconfirm,
  PopconfirmProps,
  RadioChangeEvent,
  Space,
  Switch,
  Table,
} from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { CheckCircle2, PenLine, Trash2 } from 'lucide-react';
import type { RcFile } from 'rc-upload/lib/interface';
import React, { useEffect, useState } from 'react';
import Add from './components/Add';
import AssignRole from './components/AssignRole';
import BatchModify from './components/BatchModify';
import Import from './components/Import';
import Modify from './components/Modify';
import Search from './components/Search';
import useStyles from './style';
const CheckCircleOutlined = CheckCircle2;
const DeleteOutlined = Trash2;
const EditOutlined = PenLine;

const columns = (
  onModify: (user: UserQuery) => void,
  onDelete: (user: UserQuery) => void,
  loadingDelete: boolean,
  handleStatusChange: (user: UserQuery) => void,
  showAssignRoleModal: (user: UserQuery) => void,
) => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    hidden: true,
  },
  {
    title: '序号',
    dataIndex: 'No',
    key: 'No',
    render: (_: number, _record: UserQuery, rowIndex: number) => rowIndex + 1,
    width: '8%',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: number, record: UserQuery) => {
      if (status === 1) {
        return (
          <Switch checked={true} onChange={() => handleStatusChange(record)} />
        );
      }
      return <Switch onChange={() => handleStatusChange(record)} />;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    render: (remark: string) => {
      if (remark && remark.length > 0) {
        return remark;
      }
      return '-';
    },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    render: (text: number) => {
      const formattedDate = dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss');
      return <span>{formattedDate}</span>;
    },
  },
  {
    title: '操作',
    key: 'action',
    render: (_: string, record: UserQuery) => (
      <Space>
        <Button
          style={{ fontSize: 12, color: '#4096ff' }}
          size={'small'}
          icon={<EditOutlined className="w-4 h-4" />}
          type={'link'}
          onClick={() => onModify(record)}
        >
          编辑
        </Button>
        <Button
          style={{ marginLeft: '-8px', fontSize: 12, color: '#4096ff' }}
          size={'small'}
          icon={<DeleteOutlined className="w-4 h-4" />}
          type={'link'}
          onClick={() => onDelete(record)}
          loading={loadingDelete}
        >
          删除
        </Button>
        <button
          type="button"
          onClick={() => showAssignRoleModal(record)}
          className="flex items-center gap-0.5 text-xs btn-operation"
        >
          <CheckCircleOutlined className="w-3 h-3" />
          <span>分配角色</span>
        </button>
      </Space>
    ),
  },
];

const UserPage: React.FC = () => {
  const { styles } = useStyles();

  const [isUserAddModalVisible, setIsUserAddModalVisible] =
    useState<boolean>(false);
  const handleShowModal = () => {
    setIsUserAddModalVisible(true);
  };
  const [addForm] = Form.useForm();
  const handleUserAddCancel = () => {
    setIsUserAddModalVisible(false);
    addForm.resetFields();
  };
  const [isUserAddLoading, setIsUserAddLoading] = useState<boolean>(false);
  const handleUserAdd = async (data: UserAdd) => {
    setIsUserAddLoading(true);
    try {
      await userAdd(data);
      message.success('新增成功');
      await setUserTableData();
      handleUserAddCancel();
    } finally {
      setIsUserAddLoading(false);
    }
  };

  const [queryForm] = Form.useForm();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [userQueryForm, setUserQueryForm] = useState<UserQueryForm>({
    current: 1,
    page_size: 10,
    username: undefined,
    nickname: undefined,
    status: undefined,
    create_time: undefined,
  });
  const [totalCount, setTotal] = useState<number | undefined>(0);
  const [dataSource, setDataSource] = useState<UserQuery[] | undefined>([]);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const handleChangeState = (data: string) => {
    setStatus(data);
  };
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const setUserTableData = async () => {
    try {
      setIsTableLoading(true);
      const { records, total_count } = await users(userQueryForm);
      setDataSource(records);
      setTotal(total_count);
    } finally {
      setIsTableLoading(false);
    }
  };
  const handleUserQuery = async (data: UserQueryForm) => {
    const { create_time } = data;
    let timeRange: string | undefined;
    if (create_time && create_time.length === 2) {
      const startDate = dayjs(create_time[0]).valueOf() / 1000;
      const endDate = dayjs(create_time[1]).valueOf() / 1000;
      timeRange = startDate + ',' + endDate;
    }
    setPage(1);
    setSize(10);
    setUserQueryForm((prev) => ({
      ...prev,
      current: 1,
      page_size: 10,
      username: data.username?.trim(),
      nickname: data.nickname?.trim(),
      status: data.status,
      create_time: timeRange,
    }));
  };
  const handlePaginationSearch = async (current: number, size: number) => {
    setPage(current);
    setSize(size);
    setUserQueryForm((prev) => ({
      ...prev,
      current: current,
      page_size: size,
    }));
  };
  const handleQueryReset = () => {
    queryForm.resetFields();
    setStatus(undefined);
    setPage(1);
    setSize(10);
    setUserQueryForm((prev) => ({
      ...prev,
      current: 1,
      page_size: 10,
      username: undefined,
      nickname: undefined,
      status: undefined,
      create_time: undefined,
    }));
  };

  const handleExport = async () => {
    await userExport(userQueryForm);
  };

  const [isUserEditModalVisible, setIsModifyUserModalVisible] =
    useState<boolean>(false);
  const [isUserEditLoading, setIsUserEditLoading] = useState<boolean>(false);
  const [editForm] = Form.useForm();
  const [editUser, setEditUser] = useState<UserModify | null>(null);
  const onUserEdit = (user: UserModify) => {
    setEditUser(user);
    editForm.setFieldsValue(user);
    setIsModifyUserModalVisible(true);
  };
  const handleUserEditCancel = () => {
    setIsModifyUserModalVisible(false);
    editForm.resetFields();
  };
  const handleStatusChange = async (user: UserQuery) => {
    const updatedStatus = user.status === 1 ? 0 : 1;
    await userModify({ ...user, status: updatedStatus });
    message.success('修改成功');
    await setUserTableData();
  };
  const handleUserEdit = async (data: UserQuery) => {
    setIsUserEditLoading(true);
    try {
      if (editUser === null) {
        return;
      }
      await userModify({ ...editUser, ...data });
      handleUserEditCancel();
      message.success('修改成功');
      await setUserTableData();
    } finally {
      setIsUserEditLoading(false);
    }
  };
  const [isAssignRoleModalVisible, setIsAssignRoleModalVisible] =
    useState(false);
  const [isAssignRoleLoading, setIsAssignRoleLoading] = useState(false);
  const [assignRoleForm] = Form.useForm();

  const [availableRoles, setAvailableRoles] = useState<RolePage[]>([]);
  const [userId, setUserId] = useState<string>('');

  const showAssignRoleModal = async (user: UserQuery) => {
    const resp = await fetchRoleByPage();
    setAvailableRoles(resp.records);
    setUserId(user.id);
    setIsAssignRoleModalVisible(true);
  };

  const handleAssignRoleCancel = () => {
    setIsAssignRoleModalVisible(false);
    assignRoleForm.resetFields();
  };

  const handleAssignRole = async (values: { roles: string[] }) => {
    setIsAssignRoleLoading(true);
    try {
      const userRoleAssign = {
        user_id: userId,
        role_ids: values.roles,
      };
      await assignUserRole(userRoleAssign as UserRoleAssign);
      message.success('角色分配成功');
      setIsAssignRoleModalVisible(false);
      assignRoleForm.resetFields();
    } finally {
      setIsAssignRoleLoading(false);
    }
  };

  const [isUserBatchModifyEnable, setIsUserBatchModifyEnable] =
    useState<boolean>(true);
  const [isUserBatchEditModalVisible, setIsUserBatchEditModalVisible] =
    useState<boolean>(false);
  const onUserBatchEdit = () => {
    setIsUserBatchEditModalVisible(true);
  };
  const [batchEditForm] = Form.useForm();
  const [batchStatusValue, setBatchStatusValue] = useState<number>(1);
  const onBatchStatusChange = (e: RadioChangeEvent) => {
    setBatchStatusValue(e.target.value);
  };
  const handleUserBatchModifyCancel = () => {
    setIsUserBatchEditModalVisible(false);
    batchEditForm.resetFields();
  };
  const [isUserBatchModifyLoading, setIsUserBatchModifyLoading] =
    useState<boolean>(false);
  const handleUserBatchModify = async (data: UserBatchModify) => {
    const ids = selectedRowKeys.map((key) => Number(key));
    if (ids.length === 0) {
      message.warning('请先选择要修改的条目');
      return;
    }
    if (JSON.stringify(data) === '{}') {
      message.warning('请填写修改的信息');
      return;
    }
    try {
      setIsUserBatchModifyLoading(true);
      await userBatchModify(ids, data);
      message.success('修改成功');
      setSelectedRowKeys([]);
      batchEditForm.resetFields();
      setIsUserBatchEditModalVisible(false);
      await setUserTableData();
    } finally {
      setIsUserBatchModifyLoading(false);
    }
  };

  const [isUserImportModalVisible, setIsUserImportModalVisible] =
    useState<boolean>(false);
  const [isUserImportLoading, setIsUserImportLoading] =
    useState<boolean>(false);
  const [userImportFile, setUserImportFile] = useState<RcFile | null>(null);
  const onUserImport = () => {
    setIsUserImportModalVisible(true);
  };
  const handleFileUpload = (uploadFile: RcFile | null) => {
    setUserImportFile(uploadFile);
  };
  const handleUserImportCancel = () => {
    handleFileUpload(null);
    setIsUserImportModalVisible(false);
  };
  const handleUserImport = async () => {
    try {
      setIsUserImportLoading(true);
      if (!userImportFile) {
        message.warning('请先选择上传文件');
        return;
      }
      await userImport(userImportFile);
      message.success('导入成功');
      await setUserTableData();
      handleFileUpload(null);
      setIsUserImportModalVisible(false);
    } finally {
      setIsUserImportLoading(false);
    }
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<UserQuery> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const handlePasswordVisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const [isBatchDeleteEnabled, setIsBatchDeleteEnabled] =
    useState<boolean>(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isShowUndo, setIsShowUndo] = useState<boolean>(false);
  const [recoverUser, setRecoverUser] = useState<UserQuery | null>(null);

  const handleUndo = async () => {
    if (recoverUser) {
      await userRecover(recoverUser);
    }
    setIsShowUndo(false);
    await setUserTableData();
  };
  const handleHide = () => {
    setIsShowUndo(false);
  };
  const handleUserDelete = async (user: UserQuery) => {
    setIsLoadingDelete(true);
    try {
      setRecoverUser(user);
      await userRemove(user);
      await setUserTableData();
      setIsShowUndo(true);
    } finally {
      setIsLoadingDelete(false);
    }
  };
  const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
    const ids = selectedRowKeys.map((key) => Number(key));
    await userBatchRemove(ids);
    await setUserTableData();
    message.success('删除成功');
  };
  const confirmCancel: PopconfirmProps['onCancel'] = async () => {
    setSelectedRowKeys([]);
    message.success('删除撤销');
  };

  useEffect(() => {
    setIsTableLoading(true);
    users(userQueryForm).then(async (resp) => {
      const { records, total_count } = resp;
      setDataSource(records);
      setTotal(total_count);
    });
    setIsTableLoading(false);
    return () => {
      setDataSource([]);
    };
  }, [userQueryForm]);

  useEffect(() => {
    if (selectedRowKeys.length > 0) {
      setIsBatchDeleteEnabled(false);
      setIsUserBatchModifyEnable(false);
    } else {
      setIsBatchDeleteEnabled(true);
      setIsUserBatchModifyEnable(true);
    }
  }, [selectedRowKeys]);

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.searchContainer}>
        <Search
          form={queryForm}
          handleUserQuery={handleUserQuery}
          handleChangeState={handleChangeState}
          handleQueryReset={handleQueryReset}
          status={status}
        />
      </Card>
      <Space className={styles.resultSearch}>
        <Button onClick={handleShowModal} type="primary">
          新增
        </Button>
        <Button
          disabled={isUserBatchModifyEnable}
          onClick={onUserBatchEdit}
          className={`btn btn-batch-update`}
        >
          编辑
        </Button>
        <Button onClick={handleExport} className={`btn btn-export`}>
          导出
        </Button>
        <Button onClick={onUserImport} className={`btn btn-import`}>
          导入
        </Button>
        <Popconfirm
          title="删除所选的内容"
          description="你确定删除吗? 删除后将无法找回"
          onConfirm={confirmDelete}
          onCancel={confirmCancel}
          okText="是"
          cancelText="否"
        >
          <Button disabled={isBatchDeleteEnabled} className={`btn btn-delete`}>
            删除
          </Button>
        </Popconfirm>
      </Space>
      <Card bordered={false} className={styles.resultContainer}>
        <Add
          isModalVisible={isUserAddModalVisible}
          handleCancel={handleUserAddCancel}
          handleUserAdd={handleUserAdd}
          isLoading={isUserAddLoading}
          formProp={addForm}
        />
        <Modify
          isModalVisible={isUserEditModalVisible}
          handleCancel={handleUserEditCancel}
          handleUserEdit={handleUserEdit}
          isLoading={isUserEditLoading}
          form={editForm}
        />
        <AssignRole
          isAssignRoleModalVisible={isAssignRoleModalVisible}
          handleAssignRoleCancel={handleAssignRoleCancel}
          handleAssignRole={handleAssignRole}
          isAssignRoleLoading={isAssignRoleLoading}
          assignRoleForm={assignRoleForm}
          availableRoles={availableRoles}
        />
        <Import
          isModalVisible={isUserImportModalVisible}
          isLoading={isUserImportLoading}
          handleCancel={handleUserImportCancel}
          handleUserImport={handleUserImport}
          handleFileUpload={handleFileUpload}
        />
        <BatchModify
          isModalVisible={isUserBatchEditModalVisible}
          handleCancel={handleUserBatchModifyCancel}
          handlePasswordVisible={handlePasswordVisible}
          userBatchModifyForm={batchEditForm}
          isUserBatchModifyLoading={isUserBatchModifyLoading}
          handleUserBatchModify={handleUserBatchModify}
          handleBatchStatusChange={onBatchStatusChange}
          batchStatusValue={batchStatusValue}
          isPasswordVisible={isPasswordVisible}
        />
        <Table
          loading={isTableLoading}
          dataSource={dataSource}
          columns={columns(
            onUserEdit,
            handleUserDelete,
            isLoadingDelete,
            handleStatusChange,
            showAssignRoleModal,
          )}
          rowKey={'id'}
          pagination={false}
          rowSelection={rowSelection}
          style={{ minHeight: 640 }}
        />
        <div style={{ margin: 8 }}>
          <Pagination
            current={page}
            page_size={size}
            total={totalCount}
            align="end"
            showSizeChanger
            showQuickJumper
            onChange={handlePaginationSearch}
          />
        </div>
        {isShowUndo && (
          <UndoComp duration={5} onUndo={handleUndo} onHide={handleHide} />
        )}
      </Card>
    </div>
  );
};

export default UserPage;
