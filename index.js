import InputDate from '@volenday/input-date';
import { diff } from 'deep-object-diff';
import React, { Component } from 'react';
import Select from 'react-select';

import { Drawer, Button, Popover } from 'antd';
import { size, omit, keyBy } from 'lodash';

export default class InputSelect extends Component {
	state = {
		hasChange: false,
		isPopoverVisible: false,
		isDrawerVisible: false
	};

	getValue() {
		const { value, options = [] } = this.props;

		let optionList = [];
		if (options.length) {
			optionList = options.map(option => {
				return omit(option, 'Id');
			});
		}

		let listObject = keyBy(optionList, 'value');

		if (Array.isArray(value)) {
			return value.map(d => (listObject[d] ? listObject[d] : null));
		} else {
			return value ? (listObject[value] ? listObject[value] : null) : null;
		}
	}

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

		let optionList = [];
		if (options.length) {
			optionList = options.map(option => {
				return omit(option, 'Id');
			});
		}

		const listObject = keyBy(optionList, 'value');

		return (
			<Select
				isDisabled={disabled}
				isMulti={multiple}
				onChange={e => {
					if (Array.isArray(e)) {
						onChange(id, e.length ? e.map(d => d.value) : null);
					} else {
						onChange(id, e ? e.value : null);
					}

					if (size(diff(listObject[value], e))) {
						this.setState({ hasChange: true });
					} else {
						this.setState({ hasChange: false });
					}
				}}
				options={optionList}
				placeholder={placeholder || label || id}
				value={this.getValue()}
				styles={{ menu: provided => ({ ...provided, zIndex: 999 }) }}
			/>
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
		const { id, label = '', required = false, withLabel = false, historyTrack = false } = this.props;

		if (withLabel) {
			if (historyTrack) {
				return (
					<div className="form-group">
						<label for={id}>{required ? `*${label}` : label}</label>
						<Button onClick={this.showDrawer} type="link">
							Manage
						</Button>
						{hasChange && this.renderPopover()}
						{this.renderSelect()}
						{this.renderDrawer()}
					</div>
				);
			}

			return (
				<div className="form-group">
					<label for={id}>{required ? `*${label}` : label}</label>
					<Button onClick={this.showDrawer} type="link">
						Manage
					</Button>
					{this.renderSelect()}
					{this.renderDrawer()}
				</div>
			);
		} else {
			if (historyTrack) {
				return (
					<div class="form-group">
						<Button onClick={this.showDrawer} type="link">
							Manage
						</Button>
						{hasChange && this.renderPopover()}
						{this.renderInput()}
						{this.renderDrawer()}
					</div>
				);
			}

			return (
				<div class="form-group">
					<Button onClick={this.showDrawer} type="link">
						Manage
					</Button>
					{this.renderSelect()}
					{this.renderDrawer()}
				</div>
			);
		}

		return null;
	}
}
