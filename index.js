import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Checkbox, Col, Form, Input, List, Row, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const browser = typeof window !== 'undefined' ? true : false;

if (browser) require('./styles.css');

export default ({
	allowSearch = true,
	children,
	disabled = false,
	disabledItems = [],
	dynamicHeight = false,
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
	toolTip = '',
	value = '',
	withLabel = false,
	relatedEntityModalClose,
	type = 'dropdown'
}) => {
	const [listOptions, setListOptions] = useState([]);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [searchValueProp, setSearchValueProp] = useState({ value: '' });
	const searchVal = useRef('');

	const handleSearch = useCallback(
		(val = '') => {
			searchVal.current = val;
			const newOptions = options.filter(d => d.label.match(new RegExp(searchVal.current, 'i')));
			setListOptions(newOptions);
		},
		[listOptions]
	);

	useEffect(() => {
		setSearchValueProp({ value: '' });
		searchVal.current = '';
		setListOptions(options);
	}, [value]);

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

	const renderListComponent = () => {
		const height = dynamicHeight ? 'auto' : 234;

		return (
			<div className="listComponentWrapper">
				<Row gutter={4}>
					{allowSearch && (
						<Col span={24} style={{ paddingRight: '0px !important' }}>
							<Input.Search
								size="small"
								placeholder="Search.."
								onSearch={e => handleSearch(e)}
								onFocus={() => setSearchValueProp({})}
								onKeyUp={e => {
									handleSearch(e.target.value);
								}}
								{...searchValueProp}
							/>
						</Col>
					)}
					<Col span={24} className="listWrapper" style={{ height }}>
						<List
							itemLayout="horizontal"
							dataSource={listOptions}
							renderItem={d => (
								<List.Item style={{ paddingTop: 3, paddingBottom: 3 }}>
									<Checkbox
										className="table-font-size"
										disabled={disabledItems.includes(d.value) ? true : false}
										style={{ fontSize: '8pt' }}
										onChange={e => {
											const { checked, value: newValue } = e.target;

											const finalValue = checked
												? multiple
													? [...value, newValue]
													: newValue
												: multiple
												? value.filter(d => d !== newValue)
												: '';

											onChange({ target: { name: id, value: finalValue } }, id, finalValue);
										}}
										value={d.value}
										checked={value ? value.includes(d.value) : false}>
										{d.label}
									</Checkbox>
								</List.Item>
							)}
							rowKey={e => `${id}-${e.value}`}
							size="small"
						/>
					</Col>
				</Row>
			</div>
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
					<span>
						{label}{' '}
						{toolTip && (
							<Tooltip title={toolTip}>
								{' '}
								<QuestionCircleOutlined />
							</Tooltip>
						)}
					</span>{' '}
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
					{type === 'dropdown' ? renderSelect() : renderListComponent()}
					{showManageButton && renderDrawer()}
				</>
			) : (
				<Skeleton active paragraph={{ rows: 1, width: '100%' }} title={false} />
			)}
		</Form.Item>
	);
};
