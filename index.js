import InputDate from '@volenday/input-date';
import React, { Component } from 'react';
import { Button, Drawer, Form, Popover, Select } from 'antd';

import './styles.css';

export default class InputSelect extends Component {
	state = {
		hasChange: false,
		isPopoverVisible: false,
		isDrawerVisible: false
	};

	renderSelect() {
		const {
			disabled = false,
			options = [],
			id,
			action,
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
				onChange={e => {
					this.setState({ hasChange: action === 'add' ? false : true });
					onChange(id, e);
				}}
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

	handlePopoverVisible = visible => {
		this.setState({ isPopoverVisible: visible });
	};

	closeDrawer = () => {
		this.setState({ isDrawerVisible: false });
	};

	showDrawer = () => {
		this.setState({ isDrawerVisible: true });
	};

	renderPopover = () => {
		const { isPopoverVisible } = this.state;
		const { id, label = '', historyTrackValue = '', onHistoryTrackChange } = this.props;

		return (
			<Popover
				content={
					<InputDate
						id={id}
						label={label}
						required={true}
						withTime={true}
						withLabel={true}
						value={historyTrackValue}
						onChange={onHistoryTrackChange}
					/>
				}
				trigger="click"
				title="History Track"
				visible={isPopoverVisible}
				onVisibleChange={this.handlePopoverVisible}>
				<span class="float-right">
					<Button
						type="link"
						shape="circle-outline"
						icon="warning"
						size="small"
						style={{ color: '#ffc107' }}
					/>
				</span>
			</Popover>
		);
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
		const { hasChange } = this.state;
		const {
			action,
			label = '',
			historyTrack = false,
			required = false,
			showManageButton = false,
			withLabel = false
		} = this.props;

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
				{historyTrack && hasChange && action !== 'add' && this.renderPopover()}
				{this.renderSelect()}
				{showManageButton && this.renderDrawer()}
			</Form.Item>
		);
	}
}
