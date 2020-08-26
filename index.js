import React, { useState } from 'react';
import { Button, Drawer, Form, Select } from 'antd';

import './styles.css';

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
	withLabel = false
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
		return (
			<Drawer title="Manage" width={720} visible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)}>
				{children}
			</Drawer>
		);
	};

	const formItemCommonProps = {
		colon: false,
		help: error ? error : '',
		label: withLabel ? (
			<>
				<div style={{ float: 'right' }}>{extra}</div> <span class="label">{label}</span>
			</>
		) : (
			false
		),
		required,
		validateStatus: error ? 'error' : 'success'
	};

	return (
		<Form.Item {...formItemCommonProps}>
			{showManageButton && (
				<Button onClick={() => setIsDrawerVisible(true)} type="link">
					Manage
				</Button>
			)}
			{renderSelect()}
			{showManageButton && renderDrawer()}
		</Form.Item>
	);
};
