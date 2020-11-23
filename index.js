import React, { useState } from 'react';
import { Button, Form, Select } from 'antd';

import './styles.css';

const browser = typeof process.browser !== 'undefined' ? process.browser : true;

export default ({
	children,
	disabled = false,
	error = null,
	extra = null,
	options = [],
	id,
	label = '',
	loading = false,
	multiple,
	onChange,
	placeholder = '',
	required = false,
	showManageButton = false,
	value = '',
	withLabel = false,
	relatedEntityModalClose
}) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	const renderSelect = () => {
		return (
			<Select
				disabled={disabled}
				filterOption={(input, { props }) => props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				loading={loading}
				mode={multiple ? 'multiple' : 'default'}
				onChange={e => onChange({ target: { name: id, value: e } }, id, e)}
				optionFilterProp="children"
				placeholder={placeholder || label || id}
				showSearch
				style={{ width: '100%' }}
				value={value ? value : []}>
				{options.map(e => (
					<Select.Option key={e.value} value={e.value}>
						{e.label}
					</Select.Option>
				))}
			</Select>
		);
	};

	const renderDrawer = () => {
		const { Drawer } = require('antd');

		return (
			<Drawer
				title="Manage"
				width={720}
				visible={isDrawerVisible}
				onClose={() => {
					setIsDrawerVisible(false);
					relatedEntityModalClose();
				}}>
				{children}
			</Drawer>
		);
	};

	const formItemCommonProps = {
		colon: false,
		help: error ? error : '',
		label: withLabel ? (
			<>
				<div style={{ float: 'right' }}>{extra}</div>{' '}
				<div class="label">
					<span>{label}</span>{' '}
					{showManageButton && (
						<a
							className="ant-btn ant-btn-link"
							onClick={e => {
								e.preventDefault();
								setIsDrawerVisible(true);
							}}
							type="link">
							(Manage)
						</a>
					)}
				</div>
			</>
		) : (
			false
		),
		required,
		validateStatus: error ? 'error' : 'success'
	};

	return (
		<Form.Item {...formItemCommonProps}>
			{browser ? (
				<>
					{renderSelect()}
					{showManageButton && renderDrawer()}
				</>
			) : (
				<Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />
			)}
		</Form.Item>
	);
};
