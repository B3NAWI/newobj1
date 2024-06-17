import React from 'react';
import { FloatButton } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const SupportIcon = () => (
    <>
        <Link to={"/SupportPage"}>
            <FloatButton
                shape="circle"
                type="primary"
                style={{ right: 54 }}
                icon={<CustomerServiceOutlined />}
            />
        </Link>
    </>
);

export default SupportIcon;
