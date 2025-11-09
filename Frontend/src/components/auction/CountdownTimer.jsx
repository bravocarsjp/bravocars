import { useState, useEffect } from 'react';
import { Tag, Typography, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CountdownTimer = ({ endTime, status, onCountdownUpdate }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(endTime);
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0
        });
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const remaining = {
        days,
        hours,
        minutes,
        seconds,
        total: difference
      };

      setTimeRemaining(remaining);

      // Call parent callback if provided
      if (onCountdownUpdate) {
        onCountdownUpdate(remaining);
      }

      return remaining;
    };

    // Initial calculation
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onCountdownUpdate]);

  if (status === 'Completed') {
    return (
      <Tag icon={<CheckCircleOutlined />} color="default">
        Auction Ended
      </Tag>
    );
  }

  if (status === 'Cancelled') {
    return (
      <Tag icon={<CloseCircleOutlined />} color="error">
        Auction Cancelled
      </Tag>
    );
  }

  if (status === 'Scheduled') {
    return (
      <Tag icon={<ClockCircleOutlined />} color="blue">
        Scheduled
      </Tag>
    );
  }

  if (!timeRemaining || isExpired) {
    return (
      <Tag icon={<ClockCircleOutlined />} color="warning">
        Ending...
      </Tag>
    );
  }

  const getTimeColor = () => {
    const totalHours = timeRemaining.total / (1000 * 60 * 60);
    if (totalHours < 1) return 'error';
    if (totalHours < 24) return 'warning';
    return 'success';
  };

  const formatTime = () => {
    const parts = [];

    if (timeRemaining.days > 0) {
      parts.push(`${timeRemaining.days}d`);
    }
    if (timeRemaining.hours > 0 || timeRemaining.days > 0) {
      parts.push(`${timeRemaining.hours}h`);
    }
    if (timeRemaining.minutes > 0 || timeRemaining.hours > 0 || timeRemaining.days > 0) {
      parts.push(`${timeRemaining.minutes}m`);
    }
    parts.push(`${timeRemaining.seconds}s`);

    return parts.join(' ');
  };

  const getDetailedTime = () => {
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days} day${timeRemaining.days !== 1 ? 's' : ''}, ${timeRemaining.hours} hour${timeRemaining.hours !== 1 ? 's' : ''}`;
    }
    if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours} hour${timeRemaining.hours !== 1 ? 's' : ''}, ${timeRemaining.minutes} minute${timeRemaining.minutes !== 1 ? 's' : ''}`;
    }
    return `${timeRemaining.minutes} minute${timeRemaining.minutes !== 1 ? 's' : ''}, ${timeRemaining.seconds} second${timeRemaining.seconds !== 1 ? 's' : ''}`;
  };

  const getColorValue = () => {
    const colorName = getTimeColor();
    if (colorName === 'error') return '#ff4d4f';
    if (colorName === 'warning') return '#faad14';
    return '#52c41a';
  };

  return (
    <div>
      <Space align="center" style={{ marginBottom: '8px' }}>
        <ClockCircleOutlined style={{ color: getColorValue() }} />
        <Text type="secondary">Time Remaining</Text>
      </Space>
      <Title
        level={4}
        style={{
          fontWeight: 'bold',
          fontFamily: 'monospace',
          color: getColorValue(),
          margin: 0
        }}
      >
        {formatTime()}
      </Title>
      <Text type="secondary" style={{ fontSize: '12px' }}>
        {getDetailedTime()}
      </Text>
    </div>
  );
};

export default CountdownTimer;
