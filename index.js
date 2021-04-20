import React, { useState } from 'react';
import { Form, Select } from 'antd';
import { Tooltip } from 'antd';

const browser = typeof window !== 'undefined' ? true : false;

if (browser) require('./styles.css');

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
	toolTip = {},
	value = '',
	withLabel = false,
	relatedEntityModalClose
}) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	const renderSelect = () => {
		const select = (
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

		return Object.keys(toolTip).length === 0 ? select : <Tooltip {...toolTip}>{select}</Tooltip>;
	};

	const renderDrawer = () => {
		const { Drawer } = require('antd');

		const drawer = (
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

		return Object.keys(toolTip).length === 0 ? drawer : <Tooltip {...toolTip}>{drawer}</Tooltip>;
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
