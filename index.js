import React, { Component } from 'react';
import { Button, Drawer, Form, Select } from 'antd';

import './styles.css';

export default class InputSelect extends Component {
	state = {
		isDrawerVisible: false
	};

	renderSelect() {
		const {
			disabled = false,
			options = [],
			id,
			label = '',
			multiple,
			onChange,
			placeholder = '',
			value = ''
		} = this.props;

		return (
			<Select
				allowClear
				disabled={disabled}
				mode={multiple ? 'multiple' : 'default'}
				onChange={e => onChange({ target: { name: id, value: e } }, id, e)}
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
	}

	closeDrawer = () => {
		this.setState({ isDrawerVisible: false });
	};

	showDrawer = () => {
		this.setState({ isDrawerVisible: true });
	};

	renderDrawer = () => {
		const { children } = this.props;
		const { isDrawerVisible } = this.state;

		return (
			<Drawer title="Manage" width={720} visible={isDrawerVisible} onClose={this.closeDrawer}>
				{children}
			</Drawer>
		);
	};

	render() {
		const { label = '', required = false, showManageButton = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			label: withLabel ? label : false,
			required
		};

		return (
			<Form.Item {...formItemCommonProps}>
				{showManageButton && (
					<Button onClick={this.showDrawer} type="link">
						Manage
					</Button>
				)}
				{this.renderSelect()}
				{showManageButton && this.renderDrawer()}
			</Form.Item>
		);
	}
}
