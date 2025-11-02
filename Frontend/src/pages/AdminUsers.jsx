import { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  Button,
  Tag,
  Space,
  Modal,
  Input,
  Select,
  Alert,
  Spin,
  message,
} from 'antd';
import { EditOutlined, CheckCircleOutlined, StopOutlined, UserAddOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import adminService from '../services/adminService';

const { Title } = Typography;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    status: '',
    newPassword: '',
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: 1,
        pageSize: 20,
      };

      if (searchTerm) params.searchTerm = searchTerm;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const result = await adminService.getUsers(params);
      if (result.success) {
        setUsers(result.data.items || []);
      } else {
        setError(result.message || 'Failed to load users');
      }
    } catch (err) {
      setError('An error occurred while loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      newPassword: '',
    });
    setEditDialog(true);
  };

  const handleCloseDialog = () => {
    setEditDialog(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      status: '',
      newPassword: '',
    });
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveUser = async () => {
    try {
      console.log('=== UPDATE USER ===');
      console.log('Selected user:', selectedUser);
      console.log('Form data:', formData);

      if (!selectedUser || !selectedUser.id) {
        message.error('No user selected');
        return;
      }

      // Track if any updates succeed
      let hasSuccessfulUpdate = false;
      let errorMessages = [];

      // 1. Update basic user information
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: selectedUser?.phoneNumber || null,
        newPassword: formData.newPassword?.trim() || null,
      };

      console.log('Update data being sent:', updateData);

      try {
        const result = await adminService.updateUser(selectedUser.id, updateData);
        console.log('Update result:', result);

        if (result.success) {
          hasSuccessfulUpdate = true;
        } else {
          errorMessages.push(result.message || 'Failed to update user info');
        }
      } catch (err) {
        console.error('Error updating user info:', err);
        errorMessages.push(err.response?.data?.message || 'Failed to update user info');
      }

      // 2. Handle role change if role was modified
      if (formData.role !== selectedUser.role) {
        console.log(`Role changed from ${selectedUser.role} to ${formData.role}`);

        try {
          // Remove old role if it exists
          if (selectedUser.role) {
            const removeResult = await adminService.removeRole(selectedUser.id, selectedUser.role);
            console.log('Remove old role result:', removeResult);
          }

          // Assign new role
          const assignResult = await adminService.assignRole(selectedUser.id, formData.role);
          console.log('Assign new role result:', assignResult);

          if (assignResult.success) {
            hasSuccessfulUpdate = true;
          } else {
            errorMessages.push(assignResult.message || 'Failed to update role');
          }
        } catch (err) {
          console.error('Error updating role:', err);
          errorMessages.push(err.response?.data?.message || 'Failed to update role');
        }
      }

      // 3. Handle status change if status was modified
      if (formData.status !== selectedUser.status) {
        console.log(`Status changed from ${selectedUser.status} to ${formData.status}`);

        try {
          let statusResult;

          if (formData.status === 'Active') {
            if (selectedUser.status === 'Pending') {
              statusResult = await adminService.approveUser(selectedUser.id);
            } else if (selectedUser.status === 'Suspended') {
              statusResult = await adminService.activateUser(selectedUser.id);
            }
          } else if (formData.status === 'Suspended') {
            statusResult = await adminService.suspendUser(selectedUser.id);
          } else if (formData.status === 'Pending') {
            errorMessages.push('Cannot change status back to Pending');
          }

          console.log('Status change result:', statusResult);

          if (statusResult && statusResult.success) {
            hasSuccessfulUpdate = true;
          } else if (statusResult && !statusResult.success) {
            errorMessages.push(statusResult.message || 'Failed to update status');
          }
        } catch (err) {
          console.error('Error updating status:', err);
          errorMessages.push(err.response?.data?.message || 'Failed to update status');
        }
      }

      // Show result to user
      if (errorMessages.length > 0) {
        message.error(errorMessages.join('; '));
      }

      if (hasSuccessfulUpdate) {
        message.success('User updated successfully');
        handleCloseDialog();
        loadUsers();
      } else if (errorMessages.length === 0) {
        message.info('No changes were made');
        handleCloseDialog();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      message.error('An unexpected error occurred while updating the user');
    }
  };

  const handleApprove = async (userId) => {
    try {
      const result = await adminService.approveUser(userId);
      if (result.success) {
        message.success(result.message || 'User approved successfully');
        loadUsers();
      } else {
        message.error(result.message || 'Failed to approve user');
      }
    } catch (err) {
      console.error('Error approving user:', err);
      message.error('An error occurred while approving the user');
    }
  };

  const handleSuspend = async (userId) => {
    try {
      const result = await adminService.suspendUser(userId);
      if (result.success) {
        message.success(result.message || 'User suspended successfully');
        loadUsers();
      } else {
        message.error(result.message || 'Failed to suspend user');
      }
    } catch (err) {
      console.error('Error suspending user:', err);
      message.error('An error occurred while suspending the user');
    }
  };

  const handleActivate = async (userId) => {
    try {
      const result = await adminService.activateUser(userId);
      if (result.success) {
        message.success(result.message || 'User activated successfully');
        loadUsers();
      } else {
        message.error(result.message || 'Failed to activate user');
      }
    } catch (err) {
      console.error('Error activating user:', err);
      message.error('An error occurred while activating the user');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'red';
      case 'Seller':
        return 'blue';
      case 'Bidder':
        return 'green';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', display: 'none' }} className="mobile-email">
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['sm'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={getRoleColor(role)}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status || 'Unknown'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space wrap>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          />
          {record.status === 'Pending' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleApprove(record.id)}
            />
          )}
          {record.status === 'Active' && (
            <Button
              type="link"
              size="small"
              icon={<StopOutlined />}
              danger
              onClick={() => handleSuspend(record.id)}
            />
          )}
          {record.status === 'Suspended' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleActivate(record.id)}
            />
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '64px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '32px 20px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Title level={3}>User Management</Title>
          <Button type="primary" icon={<UserAddOutlined />}>
            Add User
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Input
            placeholder="Search by name or email"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
            allowClear
          />
          <Select
            placeholder="Filter by Role"
            value={roleFilter || undefined}
            onChange={(value) => setRoleFilter(value || '')}
            style={{ width: '180px' }}
            allowClear
          >
            <Select.Option value="Seller">Seller</Select.Option>
            <Select.Option value="Bidder">Bidder</Select.Option>
          </Select>
          <Select
            placeholder="Filter by Status"
            value={statusFilter || undefined}
            onChange={(value) => setStatusFilter(value || '')}
            style={{ width: '180px' }}
            allowClear
          >
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Suspended">Suspended</Select.Option>
          </Select>
          {(searchTerm || roleFilter || statusFilter) && (
            <Button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setStatusFilter('');
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />

        {/* Edit User Modal */}
        <Modal
          title="Edit User"
          open={editDialog}
          onCancel={handleCloseDialog}
          onOk={handleSaveUser}
          okText="Save Changes"
          width={600}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <div style={{ marginBottom: '4px', fontSize: '12px', color: '#8c8c8c' }}>First Name</div>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '12px', color: '#8c8c8c' }}>Last Name</div>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Last Name"
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '12px', color: '#8c8c8c' }}>Email</div>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '12px', color: '#8c8c8c' }}>New Password (leave empty to keep current)</div>
              <Input.Password
                name="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="New Password"
              />
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '12px', color: '#8c8c8c' }}>Role</div>
              <Select
                style={{ width: '100%' }}
                value={formData.role}
                onChange={(value) => handleInputChange('role', value)}
              >
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Seller">Seller</Select.Option>
                <Select.Option value="Bidder">Bidder</Select.Option>
              </Select>
            </div>
            <div>
              <div style={{ marginBottom: '4px', fontSize: '12px', color: '#8c8c8c' }}>Status</div>
              <Select
                style={{ width: '100%' }}
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
              >
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Suspended">Suspended</Select.Option>
              </Select>
            </div>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsers;
