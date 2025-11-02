import { useState } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Avatar,
  Divider,
  Tag,
  Button,
  Input,
  Modal,
  Space,
  Alert,
  message,
} from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import useAuthStore from '../../stores/authStore';
import userService from '../../services/userService';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const result = await userService.updateProfile(formData);

      if (result.success) {
        // Update the auth store with new user data
        const updatedUser = { ...user, ...result.data };
        useAuthStore.getState().setUser(updatedUser);

        message.success(result.message || 'Profile updated successfully!');
        setEditMode(false);
      } else {
        message.error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      message.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      message.error('Password must be at least 6 characters!');
      return;
    }

    try {
      const result = await userService.changePassword(passwordData);

      if (result.success) {
        message.success(result.message || 'Password changed successfully!');
        setPasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        message.error(result.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      message.error('Failed to change password');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setEditMode(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          padding: '48px 20px',
          minHeight: 'calc(100vh - 160px)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <Title level={3} style={{ marginBottom: '24px' }}>
          My Profile
        </Title>

        <Row gutter={[24, 24]}>
          {/* Profile Card */}
          <Col xs={24} md={8}>
            <Card style={{ textAlign: 'center', height: '100%' }}>
              <Avatar
                size={120}
                style={{
                  backgroundColor: '#1976d2',
                  fontSize: '3rem',
                  margin: '0 auto',
                }}
                icon={!user?.firstName && !user?.lastName ? <UserOutlined /> : null}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
              <Title level={4} style={{ marginTop: '16px' }}>
                {user?.firstName} {user?.lastName}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginTop: '8px', wordBreak: 'break-word' }}>
                {user?.email}
              </Text>
              <Space style={{ marginTop: '16px' }} wrap>
                <Tag color={getRoleColor(user?.role)}>{user?.role}</Tag>
                <Tag color={getStatusColor(user?.status)}>{user?.status}</Tag>
              </Space>
              <Button
                block
                style={{ marginTop: '24px' }}
                onClick={() => setPasswordDialog(true)}
              >
                Change Password
              </Button>
            </Card>
          </Col>

          {/* Account Information */}
          <Col xs={24} md={16}>
            <Card style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0 }}>
                  Account Information
                </Title>
                {!editMode ? (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <Space>
                    <Button onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSaveProfile}
                    >
                      Save
                    </Button>
                  </Space>
                )}
              </div>
              <Divider style={{ margin: '16px 0' }} />

              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '16px' }}>
                    {editMode ? (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          First Name
                        </Text>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="First Name"
                        />
                      </div>
                    ) : (
                      <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          First Name
                        </Text>
                        <Text strong>{user?.firstName || 'N/A'}</Text>
                      </>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '16px' }}>
                    {editMode ? (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Last Name
                        </Text>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Last Name
                        </Text>
                        <Text strong>{user?.lastName || 'N/A'}</Text>
                      </>
                    )}
                  </div>
                </Col>
                <Col xs={24}>
                  <div style={{ marginBottom: '16px' }}>
                    {editMode ? (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Email Address
                        </Text>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email Address"
                        />
                      </div>
                    ) : (
                      <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Email Address
                        </Text>
                        <Text strong style={{ wordBreak: 'break-word' }}>
                          {user?.email || 'N/A'}
                        </Text>
                      </>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '16px' }}>
                    {editMode ? (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Phone Number
                        </Text>
                        <Input
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Phone Number"
                        />
                      </div>
                    ) : (
                      <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                          Phone Number
                        </Text>
                        <Text strong>
                          {user?.phoneNumber || 'Not provided'}
                        </Text>
                      </>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                      Role
                    </Text>
                    <Tag
                      color={getRoleColor(user?.role || user?.roles?.[0])}
                      style={{ marginTop: '4px' }}
                    >
                      {user?.role || user?.roles?.[0] || 'N/A'}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                      Account Status
                    </Text>
                    <Tag
                      color={getStatusColor(user?.status)}
                      style={{ marginTop: '4px' }}
                    >
                      {user?.status || 'N/A'}
                    </Tag>
                  </div>
                </Col>
              </Row>

              {user?.status === 'Pending' && (
                <div style={{ marginTop: '24px' }}>
                  <Divider style={{ margin: '16px 0' }} />
                  <Alert
                    message="Account Pending Approval"
                    description="Your account is pending approval. You will be able to participate in auctions once an administrator approves your account."
                    type="warning"
                    showIcon
                  />
                </div>
              )}

              {user?.status === 'Suspended' && (
                <div style={{ marginTop: '24px' }}>
                  <Divider style={{ margin: '16px 0' }} />
                  <Alert
                    message="Account Suspended"
                    description="Your account has been suspended. Please contact support for more information."
                    type="error"
                    showIcon
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Change Password Modal */}
        <Modal
          title="Change Password"
          open={passwordDialog}
          onCancel={() => setPasswordDialog(false)}
          onOk={handleChangePassword}
          okText="Change Password"
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Current Password
              </Text>
              <Input.Password
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current Password"
              />
            </div>
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                New Password
              </Text>
              <Input.Password
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>At least 6 characters</Text>
            </div>
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                Confirm New Password
              </Text>
              <Input.Password
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password"
              />
            </div>
          </Space>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
